import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { Observable, map, switchMap, withLatestFrom } from 'rxjs';
import { AdkAssetsService } from '../assets/assets.service';
import {
  AdkAngularMarkdownParser,
  AngularMarkdownMarkdownSection,
  AngularMarkdownSection,
} from '../markdown/angular-markdown.service';
import { MarkedCreator } from '../markdown/marked-creator.service';
import { ShikiTheme } from '../markdown/shiki-highligher.service';
import { AdkDocumentationConfigParser } from './documentation-config-parser.service';

export interface AdkDocsConfig {
  title: string;
  items: AdkFilesConfig;
}

export interface AdkFilesConfig {
  [key: string]: AdkFilesItem;
}

export type AdkFilesItem = string | null | AdkFilesConfig;

export interface ParsedAngularMarkdownFile {
  sections: AngularMarkdownSection[];
  headings: HtmlHeader[];
}

export interface ParsedDocumentation extends ParsedAngularMarkdownFile {
  siblings: NavigationSiblings;
}

export interface HtmlHeader {
  id: string;
  level: number; // starts at 1
  text: string;
}

export interface NavigationSiblings {
  previous: string | undefined;
  next: string | undefined;
}

export interface AdkDocumentationOptions {
  assetsDirectory?: string;
  docsBasePath?: string;
  docsConfig: AdkDocsConfig;
  configPath$: Observable<string>;
  shikiTheme?: ShikiTheme;
}

@Injectable()
export class AdkDocumentationDisplayService implements AdkDocumentationOptions {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;
  private files: { [name: string]: Observable<AngularMarkdownSection[]> } = {};
  assetsDirectory?: string;
  docsBasePath?: string;
  docsConfig: AdkDocsConfig;
  configPath$: Observable<string>;
  shikiTheme: ShikiTheme;
  renderer: typeof marked;

  constructor(
    private markedCreator: MarkedCreator,
    private assetsService: AdkAssetsService,
    private docsConfigParser: AdkDocumentationConfigParser,
    private angularMarkdownParser: AdkAngularMarkdownParser
  ) {}

  /**
   * This service requires the consuming app to provide the AdkDocumentationDsiplayService, the AdkAssetsService, and the AdkDocumentationConfigParser at the level at which this service is configured.
   */
  initialize(options: AdkDocumentationOptions): void {
    Object.assign(this, options);
    this.assetsService.setAssetsPath(this.assetsDirectory || 'assets/');
    if (this.docsBasePath) {
      this.docsConfigParser.setBasePath(this.docsBasePath);
    }
    this.renderer = this.markedCreator.getMarkedInstance({
      theme: this.shikiTheme,
    });
  }

  /**
   * Assumed that the content path matches
   */
  getContentForCurrentContentPath(): Observable<ParsedDocumentation> {
    return this.configPath$.pipe(
      switchMap((configPath) => {
        const pathToFile = this.docsConfigParser.getPathToFile(
          configPath,
          this.docsConfig
        );
        return this.getParsedMarkdownFile(pathToFile, this.renderer);
      }),
      withLatestFrom(this.configPath$),
      map(([angularMarkdownSections, configPath]) => {
        return {
          sections: angularMarkdownSections,
          headings: angularMarkdownSections.reduce((acc, section) => {
            if (section['headers']) {
              acc.push(...(section as AngularMarkdownMarkdownSection).headers);
            }
            return acc;
          }, [] as HtmlHeader[]),
          siblings: this.docsConfigParser.findPreviousAndNextByPath(
            this.docsConfig.items,
            configPath
          ),
        };
      })
    );
  }

  private getParsedMarkdownFile(
    filePathFromAssets: string,
    customMarked: typeof marked
  ): Observable<AngularMarkdownSection[]> {
    if (!this.files[filePathFromAssets]) {
      this.files[filePathFromAssets] = this.assetsService
        .loadAsset(filePathFromAssets, 'text')
        .pipe(
          switchMap((text) =>
            this.angularMarkdownParser.parseMarkdown(
              text as string,
              customMarked
            )
          )
        );
    }
    return this.files[filePathFromAssets];
  }
}

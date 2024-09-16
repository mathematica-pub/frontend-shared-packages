import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { Observable, map, switchMap, withLatestFrom } from 'rxjs';
import { AdkAssetsService } from '../assets/assets.service';
import {
  AdkAngularMarkdownParser,
  AngularMarkdownMarkdownSection,
  AngularMarkdownSection,
} from '../markdown/angular-markdown.service';
import { AdkMarkedCreator } from '../markdown/marked-creator.service';
import { ShikiTheme } from '../markdown/shiki-highligher.service';
import {
  AdkDocumentationConfigParser,
  AdkNestedObject,
  NavigationSiblings,
} from './documentation-config-parser.service';

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

export interface AdkDocumentationOptions {
  assetsDirectory?: string;
  shikiTheme?: ShikiTheme;
}

@Injectable()
export class AdkDocumentationDisplayService {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;
  private files: { [name: string]: Observable<AngularMarkdownSection[]> } = {};
  renderer: typeof marked;

  constructor(
    private markedCreator: AdkMarkedCreator,
    private assetsService: AdkAssetsService,
    private docsConfigParser: AdkDocumentationConfigParser,
    private angularMarkdownParser: AdkAngularMarkdownParser
  ) {}

  /**
   * This service requires the consuming app to provide the AdkDocumentationDisplayService, the AdkAssetsService, and the AdkDocumentationConfigParser at the level at which this service is configured.
   */
  initialize(options?: AdkDocumentationOptions): void {
    this.assetsService.setAssetsPath(options?.assetsDirectory || 'assets/');
    this.renderer = this.markedCreator.getMarkedInstance({
      theme: options?.shikiTheme || ShikiTheme.Nord,
    });
  }

  /**
   * Assumes that the content path matches
   */
  getContentForCurrentContentPath(
    contentPath$: Observable<string>,
    fileConfig: AdkNestedObject,
    basePath: string
  ): Observable<ParsedDocumentation> {
    return contentPath$.pipe(
      switchMap((contentPath) => {
        const pathToFile = this.docsConfigParser.getPathToFile(
          contentPath,
          fileConfig,
          basePath
        );
        return this.getParsedMarkdownFile(pathToFile, this.renderer);
      }),
      withLatestFrom(contentPath$),
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
            fileConfig,
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

import { Injectable } from '@angular/core';
import { Observable, map, switchMap, withLatestFrom } from 'rxjs';
import { AdkAssetResponse, AdkAssetsService } from '../assets/assets-service';
import {
  AdkMarkdownParser,
  AdkMarkdownParsingOptions,
  AdkParsedContentSection,
} from '../content-parsing';
import {
  AdkDocumentationConfigParser,
  AdkDocumentationNavigationSiblings,
  AdkNestedObject,
} from './documentation-config-parser';

export interface AdkDocsConfig {
  title: string;
  items: AdkFilesConfig;
}

export interface AdkFilesConfig {
  [key: string]: AdkFilesItem;
}

export type AdkFilesItem = string | null | AdkFilesConfig;

export interface AdkParsedMarkdownFile<Content = string> {
  sections: AdkParsedContentSection<Content>[];
  headings: AdkHtmlHeader[];
}

export interface AdkParsedDocumentation<Content = string>
  extends AdkParsedMarkdownFile<Content> {
  siblings: AdkDocumentationNavigationSiblings;
}

export interface AdkHtmlHeader {
  id: string;
  level: number; // starts at 1
  text: string;
}

export interface AdkDocumentationContentOptions {
  fileConfig: AdkNestedObject;
  basePath: string;
  parsingOptions?: AdkMarkdownParsingOptions;
}

@Injectable()
export class AdkDocumentationContentService {
  private files: {
    [name: string]: Observable<AdkParsedContentSection[]>;
  } = {};

  constructor(
    private assetsService: AdkAssetsService,
    private docsConfigParser: AdkDocumentationConfigParser,
    private markdownParser: AdkMarkdownParser
  ) {}

  /**
   * This service requires the consuming app to provide the AdkDocumentationDisplayService, the AdkAssetsService, and the AdkDocumentationConfigParser at the level at which this service is configured.
   *
   * OPTIONAL: If the consuming app wants to use a different assets directory, they can pass it in here.
   */
  initialize(assetsDirectory?: string): void {
    this.assetsService.setAssetsPath(assetsDirectory || 'assets/');
  }

  /**
   * Assumes that the content path matches
   */
  getContentForCurrentContentPath(
    contentPath$: Observable<string>,
    options: AdkDocumentationContentOptions
  ): Observable<AdkParsedDocumentation> {
    return contentPath$.pipe(
      switchMap((contentPath) => {
        const pathToFile = this.docsConfigParser.getPathToFile(
          contentPath,
          options.fileConfig,
          options.basePath
        );
        return this.getParsedMarkdownFile(pathToFile, options.parsingOptions);
      }),
      withLatestFrom(contentPath$),
      map(([markdownSections, configPath]) => {
        return {
          sections: markdownSections,
          headings: markdownSections.reduce((acc, section) => {
            if (section.headers.length > 0) {
              acc.push(...section.headers);
            }
            return acc;
          }, [] as AdkHtmlHeader[]),
          siblings: this.docsConfigParser.findPreviousAndNextByPath(
            options.fileConfig,
            configPath
          ),
        };
      })
    );
  }

  private getParsedMarkdownFile(
    filePathFromAssets: string,
    parsingOptions?: AdkMarkdownParsingOptions
  ): Observable<AdkParsedContentSection[]> {
    if (!this.files[filePathFromAssets]) {
      this.files[filePathFromAssets] = this.assetsService
        .getAsset(filePathFromAssets, AdkAssetResponse.Text)
        .pipe(
          switchMap((text) =>
            this.markdownParser.parse(text as string, parsingOptions)
          )
        );
    }
    return this.files[filePathFromAssets];
  }
}

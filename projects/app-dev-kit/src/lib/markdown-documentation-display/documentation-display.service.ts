import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { getHeadingList } from 'marked-gfm-heading-id';
import { Observable, from, map, switchMap, withLatestFrom } from 'rxjs';
import { MarkedCreator } from '../markdown-utilities/marked-creator.service';
import { ShikiTheme } from '../markdown-utilities/shiki-highligher';

export interface AdkDocsConfig {
  title: string;
  items: AdkFilesConfig;
}

export interface AdkFilesConfig {
  [key: string]: AdkFilesItem;
}

export type AdkFilesItem = string | null | AdkFilesConfig;

export interface ParsedDocumentation {
  html: SafeHtml;
  headings: GfmHeader[];
  siblings: NavigationSiblings;
}

export interface GfmHeader {
  id: string;
  level: number; // starts at 1
  text: string;
}

interface NestedObject {
  [key: string]: string | NestedObject;
}

export interface NavigationSiblings {
  previous: string | undefined;
  next: string | undefined;
}

@Injectable()
export class HsiAdkDocumentationDisplayService {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;
  private files: { [name: string]: Observable<unknown> } = {};
  docsPath = 'documentation/';
  config: AdkDocsConfig;
  contentPath$: Observable<string>;
  shikiTheme: ShikiTheme;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private markedCreator: MarkedCreator
  ) {}

  initialize(
    contentPath$: Observable<string>,
    config: AdkDocsConfig,
    highlightTheme: ShikiTheme = ShikiTheme.CatppuccinLatte
  ): void {
    this.contentPath$ = contentPath$;
    this.config = config;
    this.shikiTheme = highlightTheme;
  }

  getContentForCurrentContentPath(): Observable<ParsedDocumentation> {
    const renderer = this.markedCreator.getMarkedInstance(this.shikiTheme);

    return this.contentPath$.pipe(
      switchMap((contentPath) => {
        const path = this.getPathToDocFile(contentPath, this.config);
        return this.getMarkdownFile(path, renderer);
      }),
      withLatestFrom(this.contentPath$),
      map(([content, contentPath]) => {
        return {
          html: this.sanitizer.bypassSecurityTrustHtml(content),
          headings: getHeadingList().map((heading) => {
            // allow code in headers but remove <code> tags for index
            const cleanedText = heading.text.replace(/<[^>]*>?/gm, '');
            return {
              id: heading.id,
              level: heading.level,
              text: cleanedText,
            };
          }),
          siblings: this.findPreviousAndNextByPath(
            this.config.items,
            contentPath
          ),
        };
      })
    );
  }

  getMarkdownFile(
    filePathFromAssets: string,
    customMarked: typeof marked
  ): Observable<string> {
    if (!this.files[filePathFromAssets]) {
      this.files[filePathFromAssets] = this.http
        .get(`assets/${filePathFromAssets}`, {
          responseType: 'text',
        })
        .pipe(
          switchMap((text) => {
            if (customMarked) {
              // If marked has extensions, return will be Promise<string>, else string
              // See https://github.com/markedjs/marked/discussions/3219
              return from(customMarked.parse(text));
            }
            return from(Promise.resolve(marked.parse(text)));
          })
        );
    }
    return this.files[filePathFromAssets] as Observable<string>;
  }

  getPathToDocFile(contentPath: string, config: AdkDocsConfig): string {
    const pathParts = contentPath.split('/');
    const fileName = this.getFileNameFromConfig(config.items, pathParts);
    return `${this.docsPath}${fileName}`;
  }

  getFileNameFromConfig(config: AdkFilesItem, pathParts: string[]): string {
    const fileName = pathParts.reduce((acc, part) => {
      const level = acc[part];
      acc = level;
      return acc;
    }, config);
    return fileName as string;
  }

  findPreviousAndNextByPath(
    obj: NestedObject,
    targetPath: string
  ): NavigationSiblings {
    const flatPaths = this.flattenObjectWithPath(obj);
    const index = flatPaths.indexOf(targetPath);

    if (index === -1) {
      return { previous: undefined, next: undefined };
    }

    return {
      previous: index > 0 ? flatPaths[index - 1] : undefined,
      next: index < flatPaths.length - 1 ? flatPaths[index + 1] : undefined,
    };
  }

  flattenObjectWithPath(obj: NestedObject, prefix: string = ''): string[] {
    let result: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const newPath = prefix ? `${prefix}/${key}` : key;
      if (typeof value === 'object' && value !== null) {
        result = result.concat(this.flattenObjectWithPath(value, newPath));
      } else {
        result.push(newPath);
      }
    }
    return result;
  }
}

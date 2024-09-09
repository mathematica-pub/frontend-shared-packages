import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getHeadingList } from 'marked-gfm-heading-id';
import {
  Observable,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { AssetsService } from '../../core/services/assets.service';
import {
  DirectoryConfigService,
  DocsConfig,
  FilesItem,
} from '../../core/services/directory-config.service';
import { MarkedCreator } from '../../core/services/marked-creator';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';
import { ShikiHighlighter } from '../../core/services/shiki-highligher';

export interface HighlighterOptions {
  highlightCode?: true;
  theme?: string;
}

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

@Injectable({ providedIn: 'root' })
export class DocumentationHtmlService {
  docsPath = 'documentation/';

  constructor(
    private routerState: RouterStateService,
    private assets: AssetsService,
    private sanitizer: DomSanitizer,
    private configService: DirectoryConfigService
  ) {}

  getContentForCurrentContentPath(
    highlighter?: HighlighterOptions
  ): Observable<ParsedDocumentation> {
    const contentPath$ = this.routerState.state$.pipe(
      filter(
        (state) =>
          !!state.section &&
          state.section === Section.Docs &&
          !!state.contentPath
      ),
      map((state) => state.contentPath),
      distinctUntilChanged()
    );

    return contentPath$.pipe(
      withLatestFrom(this.configService.docsConfig$),
      switchMap(([contentPath, config]) => {
        const path = this.getPathToDocFile(contentPath, config);
        const renderer = !highlighter
          ? new MarkedCreator().getMarkedInstance()
          : new MarkedCreator(
              new ShikiHighlighter(highlighter.theme)
            ).getMarkedInstance();
        return this.assets.getMarkdownFile(path, renderer);
      }),
      withLatestFrom(contentPath$, this.configService.docsConfig$),
      map(([content, contentPath, config]) => {
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
          siblings: this.findPreviousAndNextByPath(config.items, contentPath),
        };
      })
    );
  }

  getPathToDocFile(contentPath: string, config: DocsConfig): string {
    const pathParts = contentPath.split('/');
    const fileName = this.getFileNameFromConfig(config.items, pathParts);
    return `${this.docsPath}${fileName}`;
  }

  getFileNameFromConfig(config: FilesItem, pathParts: string[]): string {
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

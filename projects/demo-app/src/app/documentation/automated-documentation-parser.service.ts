import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import {
  AdkAssetsService,
  AdkDocumentationOptions,
  ShikiHighlighterService,
  ShikiTheme,
} from 'projects/app-dev-kit/src/public-api';
import { rehype } from 'rehype';
import { from, map, Observable, switchMap } from 'rxjs';

// Define a more flexible Element type
interface GenericNode extends Node {
  tagName?: string;
  properties?: {
    [key: string]: unknown;
  };
  children?: GenericNode[];
  value?: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutomatedDocumentationParser {
  private readonly marked: typeof marked;
  private files: { [name: string]: Observable<SafeHtml> } = {};
  renderer: typeof marked;

  constructor(
    private assetsService: AdkAssetsService,
    private sanitizer: DomSanitizer,
    private highlighter: ShikiHighlighterService
  ) {}

  initialize(options?: AdkDocumentationOptions): void {
    this.assetsService.setAssetsPath(options?.assetsDirectory || 'assets/');
  }

  getContentForCurrentContentPath(
    contentPath$: Observable<string>
  ): Observable<SafeHtml> {
    return contentPath$.pipe(
      switchMap((contentPath) => {
        return this.getParsedHtmlFile(contentPath);
      })
    );
  }

  private getParsedHtmlFile(contentPath: string): Observable<SafeHtml> {
    if (!this.files[contentPath]) {
      const filePathFromAssets = `${contentPath.split('#')[0]}.html`;
      this.files[contentPath] = this.assetsService
        .loadAsset(filePathFromAssets, 'text')
        .pipe(
          switchMap((content) => {
            return from(
              rehype()
                .data('settings', { fragment: true })
                .use(
                  this.highlighter.getRehypeExtension,
                  ShikiTheme.CatppuccinLatte
                )
                .process(content as string)
            );
          }),
          map((vFile) => {
            return this.sanitizer.bypassSecurityTrustHtml(String(vFile));
          })
        );
    }
    return this.files[contentPath];
  }
}

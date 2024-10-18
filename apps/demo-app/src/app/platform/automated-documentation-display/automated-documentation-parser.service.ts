import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AdkAssetResponse,
  AdkAssetsService,
  AdkShikiHighlighter,
  AdkShikiHighlighterOptions,
  ShikiTheme,
} from '@hsi/app-dev-kit';
import { rehype } from 'rehype';
import { from, map, mergeMap, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutomatedDocumentationParser {
  private files: { [name: string]: Observable<SafeHtml> } = {};

  constructor(
    private assetsService: AdkAssetsService,
    private sanitizer: DomSanitizer,
    private highlighter: AdkShikiHighlighter
  ) {}

  initialize(assetsPath: string): void {
    this.assetsService.setAssetsPath(assetsPath || 'assets/');
  }

  getContentForCurrentContentPath(
    contentPath$: Observable<string>,
    shikiTheme: ShikiTheme
  ): Observable<SafeHtml> {
    return contentPath$.pipe(
      switchMap((contentPath) => {
        return this.getParsedHtmlFile(contentPath, shikiTheme);
      })
    );
  }

  private getParsedHtmlFile(
    contentPath: string,
    shikiTheme: ShikiTheme
  ): Observable<SafeHtml> {
    if (!this.files[contentPath]) {
      const filePathFromAssets = `${contentPath.split('#')[0]}.html`;
      this.files[contentPath] = this.assetsService
        .getAsset(filePathFromAssets, AdkAssetResponse.Text)
        .pipe(
          mergeMap((text) =>
            from(this.highlighter.getHighlighter()).pipe(
              map((h) => ({
                text,
                highlighter: {
                  highlighter: h,
                  theme: shikiTheme,
                  type: 'html',
                } as AdkShikiHighlighterOptions,
              }))
            )
          ),
          switchMap((content) => {
            return from(
              rehype()
                .data('settings', { fragment: true })
                .use(this.highlighter.rehypeHighlight, content.highlighter)
                .process(content.text as string)
                .then((vFile) => String(vFile))
            );
          }),
          map((html) => {
            return this.sanitizer.bypassSecurityTrustHtml(html);
          })
        );
    }
    return this.files[contentPath];
  }
}

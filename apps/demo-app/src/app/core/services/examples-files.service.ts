import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AdkShikiHighlighter,
  AdkShikiHighlighterOptions,
  ShikiTheme,
} from '@mathstack/app-kit';
import { encode } from 'html-entities';
import { rehype } from 'rehype';
import { from, map, mergeMap, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamplesFilesService {
  files: { [name: string]: Observable<SafeHtml> } = {}; // this requires all examples to have unique names

  constructor(
    private http: HttpClient,
    private highlighter: AdkShikiHighlighter,
    private sanitizer: DomSanitizer
  ) { }

  getComponentCode(name: string, shikiTheme: ShikiTheme): Observable<SafeHtml> {
    if (!this.files[name]) {
      this.files[name] = this.http
        .get(name, {
          responseType: 'text',
        })
        .pipe(
          map((text) => {
            let langClass = 'language-typescript';
            if (name.endsWith('html')) {
              langClass = 'language-html';
            } else if (name.endsWith('scss')) {
              langClass = 'language-scss';
            }
            text = encode(text, { level: 'html5' });
            return `<pre><code class="${langClass}">` + text + '</code></pre>';
          }),
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
          map((html) => this.sanitizer.bypassSecurityTrustHtml(html))
        );
    }
    return this.files[name];
  }
}

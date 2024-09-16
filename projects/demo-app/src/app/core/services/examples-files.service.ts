import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { encode } from 'html-entities';
import {
  ShikiHighlighterService,
  ShikiTheme,
} from 'projects/app-dev-kit/src/public-api';
import { rehype } from 'rehype';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamplesFilesService {
  files: { [name: string]: Observable<SafeHtml> } = {}; // this requires all examples to have unique names

  constructor(
    private http: HttpClient,
    private highlighter: ShikiHighlighterService,
    private sanitizer: DomSanitizer
  ) {}

  getComponentCode(name: string): Observable<SafeHtml> {
    if (!this.files[name]) {
      this.files[name] = this.http
        .get(name, {
          responseType: 'text',
        })
        .pipe(
          map((text) => {
            console.log(text);
            let langClass = 'language-typescript';
            if (name.endsWith('html')) {
              langClass = 'language-html';
            } else if (name.endsWith('scss')) {
              langClass = 'language-scss';
            }
            text = encode(text, { level: 'html5' });
            return `<pre><code class="${langClass}">` + text + '</code></pre>';
          }),
          switchMap((content) => {
            return from(
              rehype()
                .data('settings', { fragment: true })
                .use(
                  this.highlighter.getRehypeExtension,
                  ShikiTheme.GitHubLight
                )
                .process(content as string)
                .then((vFile) => String(vFile))
            );
          }),
          map((html) => this.sanitizer.bypassSecurityTrustHtml(html))
        );
    }
    return this.files[name];
  }
}

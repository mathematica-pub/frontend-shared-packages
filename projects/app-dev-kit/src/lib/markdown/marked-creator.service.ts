import { Injectable } from '@angular/core';
import { marked } from 'marked';
import {
  ShikiHighlighterService,
  ShikiTheme,
} from './shiki-highligher.service';

export interface MarkedOptions {
  theme?: ShikiTheme;
  globalHeaderSlugs?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MarkedCreator {
  constructor(private readonly highlighter: ShikiHighlighterService) {}

  getMarkedInstance(
    options: MarkedOptions = {
      theme: ShikiTheme.Nord,
    }
  ): typeof marked {
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      // Let's do a language based detection like on GitHub
      // So we can still have non-interpreted mermaid code
      if (lang === 'mermaid') {
        return '<pre class="mermaid">' + text + '</pre>';
      }

      if (!lang) {
        return '<pre><code>' + text + '</code></pre>';
      }

      return `<pre class="language-${lang}"><code class="language-${lang}">${text}</code></pre>`;
    };

    const extensions = [
      this.highlighter.getMarkedExtension(options.theme || ShikiTheme.Nord),
    ];

    marked.use(...extensions, {
      renderer,
      pedantic: false,
      gfm: true,
      breaks: false,
    });

    return marked;
  }
}

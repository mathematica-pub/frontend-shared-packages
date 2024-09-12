import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { ShikiHighlighter, ShikiTheme } from './shiki-highligher';

@Injectable({
  providedIn: 'root',
})
export class MarkedCreator {
  constructor(private readonly highlighter: ShikiHighlighter) {}

  getMarkedInstance(theme: ShikiTheme = ShikiTheme.Nord): typeof marked {
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

    const extensions = [gfmHeadingId()];
    extensions.push(this.highlighter.getMarkedExtension(theme));

    marked.use(...extensions, {
      renderer,
      pedantic: false,
      gfm: true,
      breaks: false,
    });

    return marked;
  }
}

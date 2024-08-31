import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { ShikiHighlighter } from './shiki-highligher';

export class MarkedCreator {
  private readonly marked: typeof marked;

  constructor(private readonly highlighter?: ShikiHighlighter) {
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

    if (this.highlighter) {
      extensions.push(this.highlighter.getHighlightExtension());
    }

    marked.use(...extensions, {
      renderer,
      pedantic: false,
      gfm: true,
      breaks: false,
    });

    this.marked = marked;
  }

  getMarkedInstance(): typeof marked {
    return this.marked;
  }
}

import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { forkJoin, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { BundledLanguage } from 'shiki/langs';
import { BundledTheme } from 'shiki/themes';
import { HighlighterGeneric } from 'shiki/types.mjs';
import { unified } from 'unified';
import { deepMerge } from '../core/utilities/deep-merge';
import { AdkShikiHighlighter, ShikiTheme } from './shiki-highlighter';

export interface AdkParsedContentSection<Content = string> {
  type: string;
  content: Content;
  html?: SafeHtml;
  headers: { id: string; text: string; level: number }[];
}

export interface AdkMarkdownParsingOptions {
  highlighter?: AdkShikiHighlighterOptions;
  gfm?: boolean;
  headingIds?: boolean;
  headingFragmentLinks?: AdkHeadingFragmentLinkOptions;
}

export interface AdkShikiHighlighterOptions {
  highlighter?: HighlighterGeneric<BundledLanguage, BundledTheme>;
  theme?: ShikiTheme;
  type?: 'html' | 'markdown';
  ignoreUnknownLanguage?: boolean;
}

export interface AdkHeadingFragmentLinkOptions {
  createLinks?: boolean;
  behavior?: 'append' | 'prepend' | 'wrap' | 'before' | 'after';
}

const DEFAULT_HIGHLIGHTER_OPTIONS: AdkShikiHighlighterOptions = {
  highlighter: undefined,
  theme: ShikiTheme.GitHubLight,
  type: 'markdown',
  ignoreUnknownLanguage: true,
};

const DEFAULT_PARSING_OPTIONS: AdkMarkdownParsingOptions = {
  gfm: true,
  headingIds: true,
  headingFragmentLinks: { createLinks: false },
  highlighter: DEFAULT_HIGHLIGHTER_OPTIONS,
};

@Injectable()
export class AdkMarkdownParser {
  parser: typeof unified;

  constructor(
    private sanitizer: DomSanitizer,
    private shikiHighlighter: AdkShikiHighlighter
  ) {
    this.parser = unified;
  }

  parse(
    markdown: string,
    options?: AdkMarkdownParsingOptions
  ): Observable<AdkParsedContentSection[]> {
    const mergedOptions = deepMerge(DEFAULT_PARSING_OPTIONS, options || {});

    return of(mergedOptions).pipe(
      mergeMap((_options) => {
        if (_options.highlighter && !_options.highlighter.highlighter) {
          return from(this.shikiHighlighter.getHighlighter()).pipe(
            map((highlighter) => ({
              ..._options,
              highlighter: {
                ..._options.highlighter,
                highlighter,
              },
            }))
          );
        } else {
          return of(_options);
        }
      }),
      switchMap((_options) => {
        const sections = this.getSections(markdown);
        const parsedSections$ = sections.map((section) => {
          return this.parseSection(section, _options);
        });
        return forkJoin(parsedSections$);
      })
    );
  }

  private getSections(markdown: string): AdkParsedContentSection[] {
    const sections: AdkParsedContentSection[] = [];
    let currentMarkdown = '';

    const lines = markdown.split('\n');

    for (const line of lines) {
      currentMarkdown += line + '\n';
    }

    // Add any remaining markdown
    if (currentMarkdown.trim()) {
      sections.push({
        type: 'markdown',
        content: currentMarkdown,
        html: undefined,
        headers: this.getHeaders(currentMarkdown),
      });
    }

    return sections;
  }

  private parseSection(
    section: AdkParsedContentSection,
    options: AdkMarkdownParsingOptions
  ): Observable<AdkParsedContentSection> {
    const parsedContent$ = from(
      unified()
        .use(remarkParse)
        .use(options.gfm ? remarkGfm : undefined)
        .use(
          options.highlighter && options.highlighter.type === 'markdown'
            ? this.shikiHighlighter.remarkHighlight
            : undefined,
          options.highlighter
        )
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(options.headingIds ? rehypeSlug : undefined)
        .use(
          options.headingFragmentLinks ? rehypeAutolinkHeadings : undefined,
          { behavior: options.headingFragmentLinks?.behavior }
        )
        .use(rehypeStringify)
        .process(section.content)
        .then((file) => String(file))
    );

    return parsedContent$.pipe(
      map((parsedContent) => {
        const toReturn = {
          ...section,
          html: this.sanitizer.bypassSecurityTrustHtml(parsedContent),
        };
        return toReturn;
      })
    );
  }

  getHeaders(markdown: string): { id: string; text: string; level: number }[] {
    const headerRegex =
      /^(#{1,6})\s*(.+)$|<h([1-6])(?:\s+[^>]*)?>(.*?)<\/h[1-6]>/gm;
    const headers: { id: string; text: string; level: number }[] = [];
    let match;

    while ((match = headerRegex.exec(markdown)) !== null) {
      let level: number;
      let text: string;

      if (match[1]) {
        // Markdown header, e.g., ## Heading
        level = match[1].length;
        text = match[2].trim();
      } else {
        // HTML header, e.g., <h2>Heading</h2>
        level = parseInt(match[3], 10);
        text = match[4].trim();
      }

      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      headers.push({ id, text, level });
    }
    return headers;
  }

  parseComponent(content: string): { name: string; pathTo: string } {
    const cleanedLine = content.trim().slice(2, -2).trim();
    const [nameKV, pathToKV] = cleanedLine.split(',');
    const name = nameKV.split(':')[1]?.trim();
    const pathTo = pathToKV.split(':')[1]?.trim();
    return { name, pathTo };
  }
}

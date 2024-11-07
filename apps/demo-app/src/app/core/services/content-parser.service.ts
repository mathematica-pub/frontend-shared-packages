import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AdkMarkdownParsingOptions,
  AdkMdParsedContentSection,
  AdkShikiHighlighter,
  AdkShikiHighlighterOptions,
  deepMerge,
  ShikiTheme,
} from '@hsi/app-dev-kit';
import yaml from 'js-yaml';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { forkJoin, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { unified } from 'unified';

const DEFAULT_HIGHLIGHTER_OPTIONS: AdkShikiHighlighterOptions = {
  highlighter: undefined,
  theme: ShikiTheme.GitHubLight,
  type: 'markdown',
  ignoreUnknownLanguage: true,
};

const DEFAULT_PARSING_OPTIONS: AdkMarkdownParsingOptions = {
  detectEscaped: true,
  gfm: true,
  headingIds: true,
  headingFragmentLinks: { createLinks: false },
  highlighter: DEFAULT_HIGHLIGHTER_OPTIONS,
};

enum ContentSection {
  Markdown = 'markdown',
  ExampleComponent = 'example-component',
  BuilderMethod = 'builder-method',
}

interface ExampleComponentSection {
  type: ContentSection.ExampleComponent;
  component: string;
}

interface BuilderMethodSection {
  type: ContentSection.BuilderMethod;
  content: Record<string, unknown>;
  headers: { id: string; text: string; level: number }[];
}

type DemoAppCustomContentSection =
  | AdkMdParsedContentSection
  | ExampleComponentSection
  | BuilderMethodSection;

type DemoAppCustomContentSections = (
  | AdkMdParsedContentSection
  | ExampleComponentSection
  | BuilderMethodSection
)[];

@Injectable()
export class ContentParser {
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
  ): Observable<DemoAppCustomContentSections> {
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

  getSections(markdown: string): DemoAppCustomContentSections {
    const sections: DemoAppCustomContentSections = [];
    let currentMarkdown = '';
    let currentSection = [];
    let currentType: ContentSection = ContentSection.Markdown;

    const lines = markdown.split('\n');
    console.log(lines);

    for (const line of lines) {
      if (
        line.startsWith('```example-component') ||
        currentType === ContentSection.ExampleComponent
      ) {
        if (currentMarkdown.trim()) {
          sections.push({
            type: 'markdown',
            content: currentMarkdown,
            html: undefined,
            headers: this.getHeaders(currentMarkdown),
          });
          currentMarkdown = '';
        }
        currentType = ContentSection.ExampleComponent;
        if (!line.startsWith('```')) {
          currentSection.push(line);
        }
        if (line.startsWith('```') && currentSection.length > 1) {
          sections.push({
            type: ContentSection.ExampleComponent,
            component: currentSection[0],
          });
          currentSection = [];
          currentType = ContentSection.Markdown;
        }
      } else if (
        line.startsWith('```builder-method') ||
        currentType === ContentSection.BuilderMethod
      ) {
        currentType = ContentSection.BuilderMethod;
        if (!line.startsWith('```')) {
          currentSection.push(line);
        }
        if (line.startsWith('```') && currentSection.length > 1) {
          try {
            const content = yaml.load(currentSection.join('\n')) as Record<
              string,
              unknown
            >;
            sections.push({
              type: ContentSection.BuilderMethod,
              content,
              headers: [],
            });
          } catch (error) {
            console.error('Error parsing builder method:', error);
          }
          currentSection = [];
          currentType = ContentSection.Markdown;
        }
      } else {
        currentMarkdown += line + '\n';
      }
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
    section: DemoAppCustomContentSection,
    options: AdkMarkdownParsingOptions
  ): Observable<DemoAppCustomContentSection> {
    if (section.type === 'markdown') {
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
          const toReturn: AdkMdParsedContentSection = {
            ...section,
            html: this.sanitizer.bypassSecurityTrustHtml(parsedContent),
          };
          return toReturn;
        })
      );
    }
    return from(Promise.resolve(section));
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
}

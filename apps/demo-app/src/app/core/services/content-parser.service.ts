import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AdkMarkdownParsingOptions,
  AdkParsedContentSection,
  AdkShikiHighlighter,
  AdkShikiHighlighterOptions,
  deepMerge,
  ShikiTheme,
} from '@mathstack/app-kit';
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
import {
  BuilderMethod,
  BuilderMethods,
  BuilderMethodsParserService,
} from './builder-methods-parser.service';

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

export enum ContentSection {
  Markdown = 'markdown',
  CustomAngular = 'custom-angular',
  BuilderMethod = 'builder-method',
}

@Injectable()
export class ContentParser {
  parser: typeof unified;

  constructor(
    private sanitizer: DomSanitizer,
    private shikiHighlighter: AdkShikiHighlighter,
    private builderMethods: BuilderMethodsParserService
  ) {
    this.parser = unified;
  }

  parse(
    markdown: string,
    options?: AdkMarkdownParsingOptions
  ): Observable<
    AdkParsedContentSection<
      | string
      | Record<string, unknown>
      | BuilderMethod<SafeHtml>
      | BuilderMethods<SafeHtml>
    >[]
  > {
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
          if (section.type === ContentSection.Markdown) {
            return this.parseMarkdownSection(section, _options);
          } else if (section.type === ContentSection.BuilderMethod) {
            return this.builderMethods.parseSection(
              section as unknown as AdkParsedContentSection<
                BuilderMethod<string>
              >,
              _options,
              this.getParsedMarkdown.bind(this)
            );
          } else {
            return from(Promise.resolve(section));
          }
        });
        return forkJoin(parsedSections$);
      })
    );
  }

  getSections(
    markdown: string
  ): AdkParsedContentSection<string | Record<string, unknown>>[] {
    const sections: AdkParsedContentSection<
      string | Record<string, unknown>
    >[] = [];
    let currentMarkdown = '';
    let currentSection = [];
    let type: ContentSection = ContentSection.Markdown;
    let level: number;

    const lines = markdown.split('\n');

    for (const line of lines) {
      level = this.getCurrentLevel(line, level);

      if (this.isCustomAngular(line, type)) {
        if (currentMarkdown.trim()) {
          sections.push({
            type: ContentSection.Markdown,
            content: currentMarkdown,
            html: undefined,
            headers: this.getHeaders(currentMarkdown),
          });
        }
        currentMarkdown = '';
        type = ContentSection.CustomAngular;
        if (!this.isCodeBlockStartOrEnd(line)) {
          currentSection.push(line.replace('\r', ''));
        } else if (currentSection.length > 0) {
          // assume only one line of code for ExampleComponent
          sections.push({
            type: ContentSection.CustomAngular,
            content: currentSection[0],
            html: undefined,
            headers: [],
          });
          currentSection = [];
          type = ContentSection.Markdown;
        }
        // Builder Method
      } else if (this.isBuilderMethod(line, type)) {
        if (currentMarkdown.trim()) {
          sections.push({
            type: 'markdown',
            content: currentMarkdown,
            html: undefined,
            headers: this.getHeaders(currentMarkdown),
          });
        }
        currentMarkdown = '';
        type = ContentSection.BuilderMethod;
        if (!this.isCodeBlockStartOrEnd(line)) {
          currentSection.push(line.replace('\r', ''));
        } else if (currentSection.length > 1) {
          try {
            const content = yaml.load(currentSection.join('\n'));
            content['type'] = content['overview'] ? 'methods' : 'method';
            sections.push({
              type: ContentSection.BuilderMethod,
              content,
              html: undefined,
              headers: this.getHeadersFromBuilderMethodYaml(content, level),
            });
            currentSection = [];
            type = ContentSection.Markdown;
          } catch (e) {
            console.error('Error parsing builder method', e);
          }
        }
      } else {
        currentMarkdown += line + '\n';
      }
    }

    // Add any remaining markdown
    if (currentMarkdown.trim()) {
      sections.push({
        type: ContentSection.Markdown,
        content: currentMarkdown,
        html: undefined,
        headers: this.getHeaders(currentMarkdown),
      });
    }

    return sections;
  }

  private getCurrentLevel(line: string, level: number): number {
    if (line.startsWith('#')) {
      return line.split(' ')[0].split('#').length - 1;
    } else {
      return level;
    }
  }

  private isCustomAngular(line: string, type: ContentSection): boolean {
    return (
      line.startsWith(`\`\`\`${ContentSection.CustomAngular}`) ||
      type === ContentSection.CustomAngular
    );
  }

  private isBuilderMethod(line: string, type: ContentSection): boolean {
    return (
      line.startsWith(`\`\`\`${ContentSection.BuilderMethod}`) ||
      type === ContentSection.BuilderMethod
    );
  }

  private getHeadersFromBuilderMethodYaml(
    content: BuilderMethods | BuilderMethod,
    level: number
  ): { id: string; text: string; level: number }[] {
    if ((content as BuilderMethods).methods) {
      return (content as BuilderMethods).methods.map((method) => {
        return {
          id: method.name,
          text: method.name,
          level: level + 1,
        };
      });
    } else {
      return [
        {
          id: (content as BuilderMethod).name,
          text: (content as BuilderMethod).name,
          level: level + 1,
        },
      ];
    }
  }

  private isCodeBlockStartOrEnd(line: string): boolean {
    return line.startsWith('```');
  }

  private parseMarkdownSection(
    section: AdkParsedContentSection<string | Record<string, unknown>>,
    options: AdkMarkdownParsingOptions
  ): Observable<AdkParsedContentSection<string | Record<string, unknown>>> {
    const parsedContent$ = this.getParsedMarkdown(
      section.content as string,
      options
    );

    return parsedContent$.pipe(
      map((parsedContent) => {
        const toReturn: AdkParsedContentSection<
          string | Record<string, unknown>
        > = {
          ...section,
          html: this.sanitizer.bypassSecurityTrustHtml(parsedContent),
        };
        return toReturn;
      })
    );
  }

  private getParsedMarkdown(
    content: string,
    options: AdkMarkdownParsingOptions
  ): Observable<string> {
    return from(
      unified()
        .use(remarkParse)
        .use(options.gfm ? remarkGfm : undefined)
        .use(
          options.highlighter &&
            options.highlighter.type === ContentSection.Markdown
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
        .process(content)
        .then((file) => String(file))
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
}

import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AdkMarkdownParsingOptions,
  AdkParsedContentSection,
} from '@mathstack/app-kit';
import { Observable, combineLatest, map, of } from 'rxjs';

export interface BuilderMethod<Description = string> {
  type: 'method';
  name: string;
  description: Description | Description[];
  params: {
    name: string;
    type: string;
    description?: Description | Description[];
  }[];
}

export interface BuilderMethods<Description = string> {
  type: 'methods';
  overview: Description | Description[];
  methods: BuilderMethod<Description>[];
}

@Injectable({ providedIn: 'root' })
export class BuilderMethodsParserService {
  constructor(private sanitizer: DomSanitizer) { }

  public parseSection(
    section:
      | AdkParsedContentSection<BuilderMethod<string>>
      | AdkParsedContentSection<BuilderMethods<string>>,
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<
    AdkParsedContentSection<BuilderMethod<SafeHtml> | BuilderMethods<SafeHtml>>
  > {
    if (this.isMultipleMethods(section)) {
      return this.parseMultiMethodsSection(section, options, markdownParser);
    } else {
      return this.parseSingleMethodSection(section, options, markdownParser);
    }
  }

  private parseMultiMethodsSection(
    section: AdkParsedContentSection<BuilderMethods<string>>,
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<AdkParsedContentSection<BuilderMethods<SafeHtml>>> {
    const overview$ = this.parseStringOrArrayValue(
      section.content.overview,
      options,
      markdownParser
    );

    const methodDescriptions$ = section.content.methods.map((method) => {
      const mainDescriptions$ = this.parseStringOrArrayValue(
        method.description,
        options,
        markdownParser
      );

      const paramDescriptions$ = method.params?.map((param) =>
        this.parseStringOrArrayValue(param.description, options, markdownParser)
      );

      return combineLatest([
        mainDescriptions$,
        ...(paramDescriptions$ || []),
      ]).pipe(
        map(([mainDescriptionHtmls, ...paramDescriptionHtmls]) => ({
          ...method,
          description: Array.isArray(mainDescriptionHtmls)
            ? mainDescriptionHtmls.map((html) =>
              this.sanitizer.bypassSecurityTrustHtml(html)
            )
            : [this.sanitizer.bypassSecurityTrustHtml(mainDescriptionHtmls)],
          params: method.params.map((param, index) => {
            const description = paramDescriptionHtmls[index];
            return {
              ...param,
              description: Array.isArray(description)
                ? description.map((html) =>
                  this.sanitizer.bypassSecurityTrustHtml(html)
                )
                : [this.sanitizer.bypassSecurityTrustHtml(description)],
            };
          }),
        }))
      );
    });

    return combineLatest([overview$, ...methodDescriptions$]).pipe(
      map(([overviewHtmls, ...parsedMethods]) => ({
        ...section,
        content: {
          type: 'methods',
          overview: Array.isArray(overviewHtmls)
            ? overviewHtmls.map((html) =>
              this.sanitizer.bypassSecurityTrustHtml(html)
            )
            : [this.sanitizer.bypassSecurityTrustHtml(overviewHtmls)],
          methods: parsedMethods,
        } as BuilderMethods<SafeHtml>,
      }))
    );
  }

  private parseStringOrArrayValue(
    value: string | string[],
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<string> | Observable<string[]> {
    return value && Array.isArray(value)
      ? combineLatest(value.map((desc) => markdownParser(desc, options)))
      : value && !Array.isArray(value)
        ? markdownParser(value, options)
        : of([]);
  }

  private parseSingleMethodSection(
    section: AdkParsedContentSection<BuilderMethod<string>>,
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<AdkParsedContentSection<BuilderMethod<SafeHtml>>> {
    const mainDescriptions$ = this.parseStringOrArrayValue(
      section.content.description,
      options,
      markdownParser
    );

    const paramDescriptions$ = section.content.params?.map((param) =>
      this.parseStringOrArrayValue(param.description, options, markdownParser)
    );

    return combineLatest([
      mainDescriptions$,
      ...(paramDescriptions$ || []),
    ]).pipe(
      map(([mainDescriptionHtmls, ...paramDescriptionHtmls]) => ({
        ...section,
        content: {
          name: section.content.name,
          type: 'method',
          description: Array.isArray(mainDescriptionHtmls)
            ? mainDescriptionHtmls.map((html) =>
              this.sanitizer.bypassSecurityTrustHtml(html)
            )
            : [this.sanitizer.bypassSecurityTrustHtml(mainDescriptionHtmls)],
          params: section.content.params.map((param, index) => {
            const description = paramDescriptionHtmls[index];
            return {
              ...param,
              description: Array.isArray(description)
                ? description.map((html) =>
                  this.sanitizer.bypassSecurityTrustHtml(html)
                )
                : [this.sanitizer.bypassSecurityTrustHtml(description)],
            };
          }),
        } as BuilderMethod<SafeHtml>,
      }))
    );
  }

  private isMultipleMethods(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any
  ): obj is AdkParsedContentSection<BuilderMethods> {
    return obj && obj.content.type === 'methods';
  }
}

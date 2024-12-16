import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AdkMarkdownParsingOptions,
  AdkParsedContentSection,
} from '@hsi/app-dev-kit';
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
  constructor(private sanitizer: DomSanitizer) {}

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
    if (this.isBuilderMethodsSection(section)) {
      return this.parseBuilderMethodsSection(section, options, markdownParser);
    } else {
      return this.parseSingleBuilderMethodSection(
        section,
        options,
        markdownParser
      );
    }
  }

  private parseBuilderMethodsSection(
    section: AdkParsedContentSection<BuilderMethods<string>>,
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<AdkParsedContentSection<BuilderMethods<SafeHtml>>> {
    const descriptions = this.collectDescriptionsForParsing(section.content);

    return this.parseMarkdownDescriptions(
      descriptions,
      options,
      markdownParser
    ).pipe(
      map((parsedDescriptions) =>
        this.reconstructBuilderMethodsSection(section, parsedDescriptions)
      )
    );
  }

  private collectDescriptionsForParsing(
    content: BuilderMethods<string>
  ): string[] {
    const overview = Array.isArray(content.overview)
      ? content.overview
      : [content.overview];
    return [
      ...overview,
      ...content.methods.flatMap((method) => method.description),
      ...content.methods.flatMap((method) =>
        method.params.flatMap((param) => param.description)
      ),
    ];
  }

  private reconstructBuilderMethodsSection(
    section: AdkParsedContentSection<BuilderMethods<string>>,
    parsedDescriptions: string[]
  ): AdkParsedContentSection<BuilderMethods<SafeHtml>> {
    // Split parsed descriptions
    console.log('parsed descriptions', parsedDescriptions);
    const overviewLength = Array.isArray(section.content.overview)
      ? section.content.overview.length
      : 1;
    const overviewHtmls = parsedDescriptions.slice(0, overviewLength);
    const remainingDescriptions = parsedDescriptions.slice(overviewLength);

    const methodDescriptionHtmls = remainingDescriptions.slice(
      0,
      section.content.methods.reduce(
        (sum, method) => sum + method.description.length,
        0
      )
    );
    const paramDescriptionHtmls = remainingDescriptions.slice(
      methodDescriptionHtmls.length
    );

    // Reconstruct methods with sanitized descriptions
    const parsedMethods = this.sanitizeMethodDescriptions(
      section.content.methods,
      methodDescriptionHtmls,
      paramDescriptionHtmls
    );

    // Sanitize overview descriptions
    const sanitizedOverview = overviewHtmls.map((overview) =>
      this.sanitizer.bypassSecurityTrustHtml(overview)
    );

    // Return parsed section
    return {
      ...section,
      content: {
        type: 'methods',
        overview: sanitizedOverview,
        methods: parsedMethods,
      } as BuilderMethods<SafeHtml>,
    };
  }

  private sanitizeMethodDescriptions(
    methods: BuilderMethod<string>[],
    methodDescriptionHtmls: string[],
    paramDescriptionHtmls: string[]
  ): BuilderMethod<SafeHtml>[] {
    let methodDescriptionIndex = 0;
    let paramDescriptionIndex = 0;

    return methods.map((method) => {
      const methodDescriptions = Array.isArray(method.description)
        ? method.description.map((_, index) =>
            this.sanitizer.bypassSecurityTrustHtml(
              methodDescriptionHtmls[methodDescriptionIndex + index]
            )
          )
        : [
            this.sanitizer.bypassSecurityTrustHtml(
              methodDescriptionHtmls[methodDescriptionIndex]
            ),
          ];
      methodDescriptionIndex += method.description.length;

      const parsedParams = method.params.map((param) => {
        const paramDescriptions = Array.isArray(param.description)
          ? param.description.map((_, index) =>
              this.sanitizer.bypassSecurityTrustHtml(
                paramDescriptionHtmls[paramDescriptionIndex + index]
              )
            )
          : [
              this.sanitizer.bypassSecurityTrustHtml(
                paramDescriptionHtmls[paramDescriptionIndex]
              ),
            ];
        paramDescriptionIndex += param.description.length;

        return {
          name: param.name,
          type: param.type,
          description: paramDescriptions,
        };
      });

      return {
        name: method.name,
        description: methodDescriptions,
        params: parsedParams,
      } as BuilderMethod<SafeHtml>;
    });
  }

  private parseSingleBuilderMethodSection(
    section: AdkParsedContentSection<BuilderMethod<string>>,
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<AdkParsedContentSection<BuilderMethod<SafeHtml>>> {
    const mainDescriptions$ =
      section.content.description && Array.isArray(section.content.description)
        ? combineLatest(
            section.content.description.map((desc) =>
              markdownParser(desc, options)
            )
          )
        : section.content.description &&
            !Array.isArray(section.content.description)
          ? markdownParser(section.content.description, options)
          : of([]);

    const paramDescriptions$ = section.content.params?.map((param) =>
      param.description && Array.isArray(param.description)
        ? combineLatest(
            param.description.map((desc) => markdownParser(desc, options))
          )
        : param.description && !Array.isArray(param.description)
          ? markdownParser(param.description, options)
          : of([])
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

  private parseMarkdownDescriptions(
    descriptions: string[],
    options: AdkMarkdownParsingOptions,
    markdownParser: (
      content: string,
      options: AdkMarkdownParsingOptions
    ) => Observable<string>
  ): Observable<string[]> {
    return combineLatest(
      descriptions.map((description) => markdownParser(description, options))
    );
  }

  private isBuilderMethodsSection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any
  ): obj is AdkParsedContentSection<BuilderMethods> {
    return obj && obj.content.type === 'methods';
  }
}

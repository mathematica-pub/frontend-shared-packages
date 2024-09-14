import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Observable, forkJoin, from, map } from 'rxjs';

export interface AngularMarkdownMarkdownSection {
  type: 'markdown';
  content: string;
  html: SafeHtml;
  headers: { id: string; text: string; level: number }[];
}

export interface AngularMarkdownComponentSection {
  type: 'component';
  content: string;
}

export type AngularMarkdownSection =
  | AngularMarkdownMarkdownSection
  | AngularMarkdownComponentSection;

@Injectable({
  providedIn: 'root',
})
export class AdkAngularMarkdownParser {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;

  constructor(private sanitizer: DomSanitizer) {}

  parseMarkdown(
    markdown: string,
    customMarked?: typeof marked
  ): Observable<AngularMarkdownSection[]> {
    const sections: AngularMarkdownSection[] = [];
    let currentMarkdown = '';

    // Split the content by lines
    const lines = markdown.split('\n');

    for (const line of lines) {
      if (line.trim().startsWith('{{') && line.trim().endsWith('}}')) {
        // If we have accumulated any markdown, add it as a section
        if (currentMarkdown.trim()) {
          sections.push({
            type: 'markdown',
            content: currentMarkdown,
            html: undefined,
            headers: this.getHeaders(currentMarkdown),
          });
          currentMarkdown = '';
        }
        // Add the component placeholder as a section
        sections.push({ type: 'component', content: line.trim().slice(2, -2) });
      } else {
        // Accumulate markdown content
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

    const parsedSections$ = sections.map((section) => {
      return this.parseSection(section, customMarked);
    });

    return forkJoin(parsedSections$);
  }

  private parseSection(
    section: AngularMarkdownSection,
    customMarked: typeof marked
  ): Observable<AngularMarkdownSection> {
    if (section.type === 'markdown') {
      let parsedContent$: Observable<string>;
      if (customMarked) {
        // If marked has extensions, return will be Promise<string>, else string
        parsedContent$ = from(customMarked.parse(section.content));
      } else {
        parsedContent$ = from(Promise.resolve(marked.parse(section.content)));
      }
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
    // For 'component' type, return the section as is
    return from(Promise.resolve(section));
  }

  private getHeaders(
    markdown: string
  ): { id: string; text: string; level: number }[] {
    const headerRegex = /^(#{1,6})\s*(.+)$/gm;
    const headers: { id: string; text: string; level: number }[] = [];
    let match;

    while ((match = headerRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      headers.push({ id, text, level });
    }

    return headers;
  }
}

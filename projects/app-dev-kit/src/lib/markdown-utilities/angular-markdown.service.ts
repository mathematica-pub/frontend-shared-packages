import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AdkAssetsService } from '../assets/assets.service';

export interface ContentSection {
  type: 'markdown' | 'component';
  content: string;
}

@Injectable()
export class AdkAngularMarkdownParserService {
  // just here so we can use as a type, copied from Analog.js
  private readonly marked: typeof marked;
  constructor(private assetsService: AdkAssetsService) {}

  loadAndParseMarkdown(
    filePath: string,
    customMarked: typeof marked
  ): Observable<ContentSection[]> {
    return this.assetsService
      .loadAsset(filePath, 'text')
      .pipe(
        mergeMap((markdown) =>
          from(this.parseMarkdown(markdown as string, customMarked))
        )
      );
  }

  private async parseMarkdown(
    markdown: string,
    customMarked: typeof marked
  ): Promise<ContentSection[]> {
    const sections: ContentSection[] = [];
    let currentMarkdown = '';

    // Split the content by lines
    const lines = markdown.split('\n');

    for (const line of lines) {
      if (line.trim().startsWith('{{') && line.trim().endsWith('}}')) {
        // If we have accumulated any markdown, add it as a section
        if (currentMarkdown.trim()) {
          sections.push({
            type: 'markdown',
            content: await customMarked.parse(currentMarkdown),
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
        content: await customMarked(currentMarkdown),
      });
    }

    return sections;
  }
}

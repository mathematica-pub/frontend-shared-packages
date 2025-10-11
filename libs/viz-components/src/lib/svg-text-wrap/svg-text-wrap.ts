import { safeAssign } from '@hsi/app-dev-kit';
import { select, Selection } from 'd3';
import { SvgTextWrapOptions } from './svg-text-wrap-options';

export class SvgTextWrap implements SvgTextWrapOptions {
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;
  breakOnChars: string[];
  spaceAroundBreakChars: boolean;

  constructor(options: SvgTextWrapOptions) {
    safeAssign(this, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrap(textSelection: Selection<SVGTextElement, any, any, any>): void {
    textSelection.each((d, i, nodes) => {
      const text = select(nodes[i]);
      const tokens = this.buildTokens(
        text,
        this.breakOnChars ?? [],
        this.spaceAroundBreakChars ?? false
      ).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const y = parseFloat(text.attr('y')) || 0;
      const x = this.maintainXPosition ? parseFloat(text.attr('x')) : 0;
      const maxWidth = this.width;
      const dy = parseFloat(text.attr('dy')) || 0;
      let isFirstTspan = true;
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');
      while ((word = tokens.pop())) {
        line.push(word);
        tspan.text(line.join('').trimEnd());

        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          if (line.length > 0) {
            tspan.text(line.join('').trimEnd());
            isFirstTspan = false;
          } else {
            // Remove the empty tspan since it has no content
            // This happens if a single word is longer than the maxWidth
            tspan.remove();
          }
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr(
              'dy',
              isFirstTspan
                ? dy + 'em'
                : ++lineNumber * this.lineHeight + dy + 'em'
            )
            .text(word);
          isFirstTspan = false;
        }
      }
      if (this.maintainYPosition && lineNumber > 0) {
        const fontSize = parseFloat(text.style('font-size')) || 16;
        const totalLines = lineNumber + 1;
        const totalHeight = (totalLines - 1) * this.lineHeight; // in em units

        // Convert to pixels and center
        const offsetY = (totalHeight / 2) * fontSize;
        text.selectAll('tspan').attr('y', y - offsetY);
      }
    });
  }

  private buildTokens(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textSel: Selection<SVGTextElement, unknown, any, any>,
    breakOnChars: string[] = [],
    spaceAroundBreakChars = false
  ): string[] {
    const allTspans = textSel.selectAll<SVGTSpanElement, unknown>('tspan');
    const chunks: string[] =
      allTspans.size() > 0
        ? Array.from(allTspans, (t) => t.textContent ?? '')
        : [textSel.text() ?? ''];

    const escaped = breakOnChars.map((c) =>
      c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const delimRe = escaped.length
      ? new RegExp(`(${escaped.join('|')})`, 'g')
      : null;

    const tokens: string[] = [];

    const splitByDelims = (s: string): string[] => {
      if (!delimRe) return [s];
      return s.split(delimRe).filter(Boolean); // keeps delimiters as their own elements
    };

    chunks.forEach((chunk, chunkIdx) => {
      const wordsInChunk = chunk.trim().split(/\s+/).filter(Boolean);

      wordsInChunk.forEach((w, wIdx) => {
        // Split the "word" on delimiter characters, preserving them as tokens
        const parts = splitByDelims(w);
        for (const p of parts) {
          if (breakOnChars.includes(p)) {
            // Delimiter token
            if (spaceAroundBreakChars) {
              tokens.push(' ', p, ' ');
            } else {
              tokens.push(p);
            }
          } else {
            // Normal text segment
            tokens.push(p);
          }
        }
        // Add a single space between words that came from the same chunk
        if (wIdx < wordsInChunk.length - 1) tokens.push(' ');
      });

      // Add a single space between tspans
      if (allTspans.size() > 0 && chunkIdx < chunks.length - 1)
        tokens.push(' ');
    });

    return tokens;
  }
}

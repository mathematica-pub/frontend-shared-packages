import { safeAssign } from '@hsi/app-dev-kit';
import { select, Selection } from 'd3';
import { SvgTextWrapOptions } from './svg-text-wrap-options';

export class SvgTextWrap {
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;

  constructor(options: SvgTextWrapOptions) {
    safeAssign(this, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrap(textSelection: Selection<SVGTextElement, any, any, any>): void {
    textSelection.each((d, i, nodes) => {
      const text = select(nodes[i]);
      const allTspans = text.selectAll<SVGTSpanElement, unknown>('tspan');
      const words =
        allTspans.size() > 0
          ? Array.from(allTspans)
              .map((tspan) => tspan.textContent.trim().split(/\s+/))
              .flat()
              .reverse()
          : text.text().trim().split(/\s+/).reverse();
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
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));

        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          if (line.length > 0) {
            tspan.text(line.join(' '));
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
}

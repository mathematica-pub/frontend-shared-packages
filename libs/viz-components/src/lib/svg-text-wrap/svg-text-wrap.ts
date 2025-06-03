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
              .map((tspan) => tspan.textContent.split(/\s+/))
              .flat()
              .reverse()
          : text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const y = parseFloat(text.attr('y')) || 0;
      const x = this.maintainXPosition ? parseFloat(text.attr('x')) : 0;
      const maxWidth = this.width + x;
      const dy = parseFloat(text.attr('dy')) || 0;
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
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('dy', ++lineNumber * this.lineHeight + dy + 'em')
            .text(word);
        }
      }
      if (this.maintainYPosition && lineNumber > 0) {
        text.attr('dominant-baseline', 'text-after-edge');
        const lastText = text
          .selectAll('tspan')
          .filter((d, i, nodes) => i === nodes.length - 1);
        const lastDy = lastText.attr('dy')
          ? lastText.attr('dy').slice(0, -2)
          : '0';
        const firstDy = text.attr('dy') ? text.attr('dy').slice(0, -2) : '0';
        const offsetY =
          ((parseFloat(lastDy) - parseFloat(firstDy) - 0.5) / 2) * 16;
        text.selectAll('tspan').attr('y', y - offsetY);
      } else {
        text.attr('dominant-baseline', null);
      }
    });
  }
}

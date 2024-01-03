import { select } from 'd3';
import { VicSvgTextWrapConfig } from './svg-wrap.config';

export function svgTextWrap(textSelection, options: VicSvgTextWrapConfig) {
  const { width, maintainXPosition, maintainYPosition, lineHeight } = options;

  textSelection.each((d, i, nodes) => {
    const text = select(nodes[i]);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const y = parseFloat(text.attr('y')) || 0;
    const x = maintainXPosition ? parseFloat(text.attr('x')) : 0;
    const maxWidth = width + x;
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
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
    if (maintainYPosition && lineNumber > 0) {
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

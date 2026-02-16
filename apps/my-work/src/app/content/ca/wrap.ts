/* eslint-disable @typescript-eslint/no-explicit-any */
import { select } from 'd3';

export function wrapText(
  selection: any,
  width: number,
  options?: {
    lineHeight?: number; // in ems
    maxLines?: number;
    ellipsis?: string | null;
  }
): void {
  const lineHeight = options?.lineHeight ?? 1.1;
  const maxLines = options?.maxLines ?? Infinity;
  const ellipsis = options?.ellipsis ?? null;

  selection.each(function (this: SVGTextElement) {
    const text = select<SVGTextElement, unknown>(this);

    const x = text.attr('x') ?? '0';
    const y = text.attr('y') ?? '0';

    // Preserve any existing dy (D3 axes often use something like "0.32em")
    const baseDy = parseFloat(text.attr('dy') ?? '0');

    const content = text.text()?.trim();
    if (!content) return;

    const words = content.split(/\s+/);

    // --- Pass 1: compute wrapped lines (measuring with a temp tspan) ---
    text.text(null);

    const measurer = text
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', `${baseDy}em`);

    const lines: string[] = [];
    let line: string[] = [];

    for (const word of words) {
      line.push(word);
      measurer.text(line.join(' '));

      const node = measurer.node();
      if (!node) continue;

      if (node.getComputedTextLength() > width && line.length > 1) {
        line.pop();
        lines.push(line.join(' '));
        line = [word];

        if (lines.length >= maxLines) {
          // truncate remaining
          if (ellipsis) {
            const last = lines[lines.length - 1];
            lines[lines.length - 1] = last + ellipsis;
          }
          break;
        }
      }
    }

    if (lines.length < maxLines && line.length) {
      lines.push(line.join(' '));
    }

    // --- Pass 2: render centered tspans ---
    text.text(null);

    const n = lines.length;
    const firstDy = baseDy - ((n - 1) * lineHeight) / 2;

    lines.forEach((ln, i) => {
      const t = text.append('tspan').attr('x', x);

      if (i === 0) {
        // anchor to the tick's y baseline once
        t.attr('y', y).attr('dy', `${firstDy}em`);
      } else {
        // subsequent lines: dy is relative to previous tspan
        t.attr('dy', `${lineHeight}em`);
      }

      t.text(ln);
    });
  });
}

import {
  LinesComponent,
  LinesInputEffect,
} from 'projects/viz-components/src/public-api';

export class HighlightLineForLabel implements LinesInputEffect {
  applyEffect(lines: LinesComponent, label: string): void {
    lines.lines
      .style('stroke', ([category]): string =>
        label === category ? null : '#ddd'
      )
      .filter(([category]): boolean => label === category)
      .raise();

    lines.markers
      .style('fill', (d): string =>
        label === lines.values.category[d.index] ? null : 'transparent'
      )
      .filter((d): boolean => label === lines.values.category[d.index])
      .raise();
  }

  removeEffect(lines: LinesComponent): void {
    lines.lines.style('stroke', null);
    lines.markers.style('fill', null);
  }
}

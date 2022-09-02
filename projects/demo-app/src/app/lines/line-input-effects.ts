import { LinesInputEventDirective } from 'projects/viz-components/src/lib/lines/lines-input-event.directive';
import { LinesInputEffect } from 'projects/viz-components/src/public-api';

export class HighlightLineForLabel implements LinesInputEffect {
  applyEffect(event: LinesInputEventDirective, label: string): void {
    event.lines.lines
      .style('stroke', ([category]): string =>
        label === category ? null : '#ddd'
      )
      .filter(([category]): boolean => label === category)
      .raise();

    event.lines.markers
      .style('fill', (d): string =>
        label === event.lines.values.category[d.index] ? null : 'transparent'
      )
      .filter((d): boolean => label === event.lines.values.category[d.index])
      .raise();
  }

  removeEffect(event: LinesInputEventDirective): void {
    event.lines.lines.style('stroke', null);
    event.lines.markers.style('fill', null);
  }
}

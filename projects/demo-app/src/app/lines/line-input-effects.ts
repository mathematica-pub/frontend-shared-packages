import { InputEventEffect } from 'projects/viz-components/src/lib/events/effect';
import { LinesInputEventDirective } from 'projects/viz-components/src/lib/lines/lines-input-event.directive';

export class HighlightLineForLabel
  implements InputEventEffect<LinesInputEventDirective>
{
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

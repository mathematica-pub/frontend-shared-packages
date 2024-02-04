import { InputEventEffect } from 'projects/viz-components/src/lib/events/effect';
import { LinesInputEventDirective } from 'projects/viz-components/src/lib/lines/lines-input-event.directive';
import { LinesComponent } from 'projects/viz-components/src/public-api';

export class HighlightLineForLabel<
  T,
  U extends LinesComponent<T> = LinesComponent<T>
> implements InputEventEffect<LinesInputEventDirective<T, U>>
{
  applyEffect(event: LinesInputEventDirective<T, U>, label: string): void {
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

  removeEffect(event: LinesInputEventDirective<T, U>): void {
    event.lines.lines.style('stroke', null);
    event.lines.markers.style('fill', null);
  }
}

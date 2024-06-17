import { InputEventEffect } from 'projects/viz-components/src/lib/events/effect';
import { LinesInputEventDirective } from 'projects/viz-components/src/lib/lines/lines-input-event.directive';
import {
  LinesComponent,
  LinesGroupSelectionDatum,
} from 'projects/viz-components/src/lib/lines/lines.component';
import { LinesMarkerDatum } from 'projects/viz-components/src/public-api';

export class HighlightLineForLabel<
  Datum,
  ExtendedLineComponent extends LinesComponent<Datum> = LinesComponent<Datum>
> implements
    InputEventEffect<LinesInputEventDirective<Datum, ExtendedLineComponent>>
{
  applyEffect(
    event: LinesInputEventDirective<Datum, ExtendedLineComponent>,
    label: string
  ): void {
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', ([category]): string =>
        label === category ? null : '#ddd'
      )
      .filter(([category]): boolean => label === category)
      .raise();

    event.lines.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('fill', (d): string =>
        label === event.lines.config.categorical.values[d.index]
          ? null
          : 'transparent'
      )
      .filter(
        (d): boolean => label === event.lines.config.categorical.values[d.index]
      )
      .raise();
  }

  removeEffect(
    event: LinesInputEventDirective<Datum, ExtendedLineComponent>
  ): void {
    event.lines.lineGroups.selectAll('path').style('stroke', null);
    event.lines.lineGroups.selectAll('circle').style('fill', null);
  }
}

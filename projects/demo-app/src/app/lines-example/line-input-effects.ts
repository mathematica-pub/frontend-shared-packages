import { InputEventEffect } from 'projects/viz-components/src/lib/events/effect';
import { LinesMarkerDatum } from 'projects/viz-components/src/lib/lines/config/lines-config';
import { LinesInputEventDirective } from 'projects/viz-components/src/lib/lines/events/lines-input-event.directive';
import {
  LinesComponent,
  LinesGroupSelectionDatum,
} from 'projects/viz-components/src/lib/lines/lines.component';

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
      .filter(([category]): boolean => label === category)
      .raise()
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);

    event.lines.lineGroups
      .filter(([category]): boolean => label !== category)
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', '#ddd');

    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
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
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
      .style('fill', null);
  }
}

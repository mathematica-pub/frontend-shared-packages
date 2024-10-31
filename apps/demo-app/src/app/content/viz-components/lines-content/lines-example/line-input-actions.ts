import {
  InputEventAction,
  LinesComponent,
  LinesGroupSelectionDatum,
  LinesInputEventDirective,
  LinesMarkerDatum,
} from '@hsi/viz-components';

export class HighlightLineForLabel<
  Datum,
  ExtendedLineComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements
    InputEventAction<LinesInputEventDirective<Datum, ExtendedLineComponent>>
{
  onStart(
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
        label === event.lines.config.stroke.color.values[d.index]
          ? null
          : 'transparent'
      )
      .filter(
        (d): boolean =>
          label === event.lines.config.stroke.color.values[d.index]
      )
      .raise();
  }

  onEnd(event: LinesInputEventDirective<Datum, ExtendedLineComponent>): void {
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
      .style('fill', null);
  }
}

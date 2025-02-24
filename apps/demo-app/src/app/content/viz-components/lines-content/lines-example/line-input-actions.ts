import {
  DataValue,
  InputEventAction,
  LinesComponent,
  LinesGroupSelectionDatum,
  LinesInputEventDirective,
  LinesMarkerDatum,
} from '@hsi/viz-components';

export class HighlightLineForLabel<
  Datum,
  ChartMultipleDomain extends DataValue = string,
  TLineComponent extends LinesComponent<
    Datum,
    ChartMultipleDomain
  > = LinesComponent<Datum, ChartMultipleDomain>,
> implements
    InputEventAction<
      LinesInputEventDirective<Datum, ChartMultipleDomain, TLineComponent>
    >
{
  onStart(
    event: LinesInputEventDirective<Datum, ChartMultipleDomain, TLineComponent>,
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

  onEnd(
    event: LinesInputEventDirective<Datum, ChartMultipleDomain, TLineComponent>
  ): void {
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);
    event.lines.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
      .style('fill', null);
  }
}

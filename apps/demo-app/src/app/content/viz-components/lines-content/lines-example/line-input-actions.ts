import {
  InputEventAction,
  LinesGroupSelectionDatum,
  LinesHost,
  LinesMarkerDatum,
} from '@mathstack/viz';

export class HighlightLineForLabel<Datum>
  implements InputEventAction<LinesHost<Datum>> {
  onStart(host: LinesHost<Datum>, label: string): void {
    host.marks.lineGroups
      .filter(([category]): boolean => label === category)
      .raise()
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);

    host.marks.lineGroups
      .filter(([category]): boolean => label !== category)
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', '#ddd');

    host.marks.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
      .style('fill', (d): string =>
        label === host.marks.config.stroke.color.values[d.index]
          ? null
          : 'transparent'
      )
      .filter(
        (d): boolean => label === host.marks.config.stroke.color.values[d.index]
      )
      .raise();
  }

  onEnd(event: LinesHost<Datum>): void {
    event.marks.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);
    event.marks.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
      .style('fill', null);
  }
}

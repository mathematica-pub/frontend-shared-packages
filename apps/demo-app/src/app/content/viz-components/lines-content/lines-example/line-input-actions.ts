import {
  InputEventAction,
  LinesGroupSelectionDatum,
  LinesHost,
  LinesMarkerDatum,
} from '@hsi/viz-components';

export class HighlightLineForLabel<Datum>
  implements InputEventAction<LinesHost<Datum>>
{
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

    host.marks.areaFills
      .filter(([category]) => label === category)
      .style('display', ([category]) =>
        host.marks.config.areaFills.display(category) ? null : 'none'
      );
    host.marks.areaFills
      .filter(([category]) => label !== category)
      .style('display', 'none');
  }

  onEnd(host: LinesHost<Datum>): void {
    host.marks.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);
    host.marks.lineGroups
      .selectAll<SVGPathElement, LinesMarkerDatum>('circle')
      .style('fill', null);
    host.marks.areaFills.style('display', ([category]) =>
      host.marks.config.areaFills.display(category) ? null : 'none'
    );
  }
}

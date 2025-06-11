/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  format,
  max,
  min,
  ScaleOrdinal,
  scaleOrdinal,
  select,
  Selection,
} from 'd3';
import {
  MlbDatum,
  MlbStackedBarsComponent,
} from '../../../mlb-stacked-bars.component';
import { lobNames, mlbColorRange } from '../../../mlb.constants';
import { MlbCsaDatum } from '../../mlb-county-plot.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-mlb-county-plot-stacked-bars]',
  standalone: true,
  templateUrl: '',
  imports: [CommonModule],
})
export class MlbCountyPlotStackedBarsComponent
  extends MlbStackedBarsComponent
  implements OnInit
{
  stratGroup: Selection<SVGGElement, unknown, null, undefined>;
  barsGroup: Selection<SVGGElement, unknown, null, undefined>;
  labelsGroup: Selection<SVGGElement, unknown, null, undefined>;
  override additionalYAxisOffset = `${this.yAxisOffset - 2.8}em`;
  goalThickness = 6;
  stratPadding = 3;
  override percentOffset = '0.07em';
  colorScale: ScaleOrdinal<string, unknown>;
  barHeight = 3;

  override ngOnInit(): void {
    this.createGroups();
    this.setColorScale();
    super.ngOnInit();
  }

  override drawMarks(): void {
    super.drawMarks();
    this.updateBars();
    this.updateStratLabels();
    this.updateRangeLabels();
  }

  createGroups(): void {
    this.barsGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'bars');

    this.stratGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'strat-labels');

    this.labelsGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'range-labels');
  }

  setColorScale(): void {
    const domain = [
      ...new Set(this.config.data.map((d) => d.lob).filter((d) => d !== null)),
    ];
    this.colorScale = scaleOrdinal().domain(domain).range(mlbColorRange);
  }

  override getCategory(lob: MlbCsaDatum): string {
    return lob.county;
  }

  override getColor(lob: MlbDatum): string {
    return this.colorScale(lob.lob) as string;
  }

  updateBars(): void {
    const data = this.config.data.filter((d) => this.isState(d));
    this.barsGroup
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.getRangeX(d))
      .attr('y', (d) => this.getRangeY(d))
      .attr('width', (d) => this.getRangeWidth(d))
      .attr('height', this.barHeight);
  }

  updateStratLabels(): void {
    let data = [...new Set(this.config.data.map((d) => d.strat))];
    data = data.length > 1 ? data : [];
    const reverseData = [...this.config.data].reverse();
    const strats = this.stratGroup
      .selectAll('.strat-label')
      .data(data)
      .join('g')
      .attr('class', 'strat-label');
    const offset = -this.labelWidth - 30;
    strats
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .text((d) => d)
      .attr('x', offset)
      .attr('y', (d) => this.getAverageY(d, reverseData))
      .attr('transform', (d) => {
        const y = this.getAverageY(d, reverseData);
        return `rotate(-90, ${offset}, ${y})`;
      });
    strats
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('x1', offset + 8)
      .attr('x2', offset + 8)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY2(d, reverseData));
  }

  getY1(d: any): number {
    const strat = this.config.data.find((x) => x.strat === d);
    return this.scales.y(strat.stratVal) + this.stratPadding;
  }

  getY2(d: any, reverseData: MlbCsaDatum[]): number {
    const county = reverseData.find((x) => x.county === d);
    return (
      this.scales.y(county.stratVal) +
      (this.scales.y as any).bandwidth() -
      this.stratPadding
    );
  }

  getAverageY(d: any, reverseData: MlbCsaDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  getRangeX(datum: MlbCsaDatum): number {
    const range = datum.range > 0 ? datum.range : 0;
    return this.scales.x(datum.average - range);
  }

  getRangeY(datum: MlbCsaDatum): number {
    return (
      this.scales.y(datum.county) +
      (this.scales.y as any).bandwidth() / 2 -
      this.barHeight / 2
    );
  }

  getRangeWidth(datum: MlbCsaDatum): number {
    return this.scales.x(Math.abs(datum.range));
  }

  updateRangeLabels(): void {
    const minAverage = min(this.config.data, (d) => d.average);
    const isDataLow = minAverage < 0.1 * this.scales.x.domain()[1];
    const x = isDataLow ? this.chart.config.width : 5;
    const data = this.config.data.filter((d) => this.isState(d));
    const maxAverage = max(data.map((d) => d.average));
    this.labelsGroup
      .attr('transform', `translate(${x}, 0)`)
      .selectAll('.range-label')
      .data(data)
      .join('text')
      .attr('class', 'range-label')
      .attr('y', (d) => this.getRangeY(d))
      .attr('dy', '0.35em')
      .text((d) => {
        const decimals = maxAverage > 1 || d.units === 'Percentage' ? '1' : '2';
        const units = d.units === 'Percentage' ? '%' : 'f';
        return format(`+.${decimals}${units}`)(d.range);
      });
  }

  isState(d: any): boolean {
    return (
      (d.lob === lobNames.mock || d.lob === lobNames.real) &&
      d.series !== 'invisible'
    );
  }

  override createAverageHeaderGroup(): void {
    const labels = this.headerGroup
      .append('g')
      .attr('class', 'average-header')
      .attr('transform', `translate(${20}, 26)`)
      .selectAll('.label')
      .data(this.colorScale.domain())
      .join('g')
      .attr('class', 'average-label')
      .attr('transform', (d, i) => `translate(${i * 270}, 0)`);
    labels
      .append('text')
      .attr('dx', (lob: string) => this.getR(lob) + 5)
      .text((d) => d);
    labels
      .append('circle')
      .attr('class', 'average')
      .attr('r', (lob: string) => this.getR(lob))
      .style('fill', (d) => this.colorScale(d) as string);
  }

  override getR(lob: string): number {
    return this.isHighlighted(lob)
      ? this.radius + this.highlightedRadius
      : this.radius;
  }
}

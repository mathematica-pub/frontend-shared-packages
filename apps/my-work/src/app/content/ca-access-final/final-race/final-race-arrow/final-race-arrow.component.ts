/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnChanges } from '@angular/core';
import { axisLeft, Selection } from 'd3';
import { raceCategories, stratLinePadding } from '../../../ca/ca.constants';
import { DotPlotService } from '../../../ca/dot-plot.service';
import { wrapText } from '../../../ca/wrap';
import { FinalArrowComponent } from '../../final-county/final-arrow/final-arrow.component';
import { FinalRaceDatum } from '../final-race.component';

@Component({
  selector: 'app-final-race-arrow',
  standalone: true,
  providers: [DotPlotService],
  templateUrl: '../../final-county/final-arrow/final-arrow.component.html',
})
export class FinalRaceArrowComponent
  extends FinalArrowComponent
  implements OnChanges
{
  noDataGroup!: Selection<SVGGElement, unknown, null, undefined>;
  stratGroup!: Selection<SVGGElement, unknown, null, undefined>;
  override bandwidth = 44;
  labelWidth = 150;
  stratPadding = 3;

  constructor(private caDotPlotService: DotPlotService) {
    super();
  }

  override ngOnChanges(): void {
    super.ngOnChanges();
    if (this.data[0]) {
      this.updateStratLabels();
      this.updateNoDataLabels();
    }
  }

  override setSvg(): void {
    super.setSvg();
    this.stratGroup = this.createGroup('strat-labels');
    this.noDataGroup = this.createGroup('no-data-labels');
  }

  override setRollupData(): void {
    this.rollupData = this.data
      .filter((d) => d.value !== null)
      .map((d) =>
        this.data.filter(
          (x) => x.strat === d.strat && x.stratVal === d.stratVal
        )
      )
      .filter(
        (row, i, self) =>
          i ===
          self.findIndex(
            (o) =>
              o[0].strat === row[0].strat && o[0].stratVal === row[0].stratVal
          )
      );
    console.log('rollupData', this.rollupData);
  }

  override sortData(): void {
    const order = structuredClone(raceCategories);
    this.caDotPlotService.setRaceEthnicityMockCategories(order);

    this.rollupData = this.rollupData
      .filter(
        (row) =>
          row.length > 1 ||
          row.some(
            (d) => d.year !== this.extents[0] && d.year !== this.extents[1]
          )
      )
      .sort((a, b) => {
        const stratA =
          a[0].strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
        const stratB =
          b[0].strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
        return order[stratA][a[0].stratVal] - order[stratB][b[0].stratVal];
      });
  }

  override updateYScale(): void {
    const domain = this.rollupData.map((d) => d[0].strat + d[0].stratVal);
    const chartRange = [0, this.height];
    this.yScale.domain(domain).range(chartRange);
  }

  override updateYAxis(): void {
    this.yAxisGroup
      .call(
        axisLeft(this.yScale)
          .tickSizeOuter(0)
          .tickFormat((d, i) => this.rollupData[i][0].stratVal)
      )
      .selectAll('.tick text')
      .call(wrapText, this.labelWidth, { lineHeight: 1 });
  }

  override getY(d: FinalRaceDatum[]): number {
    return this.yScale(d[0].strat + d[0].stratVal) + this.bandwidth / 2;
  }

  override getDiamondY(d: FinalRaceDatum): number {
    return this.yScale(d.strat + d.stratVal) + this.bandwidth / 2;
  }

  override getLegendLineY(i: number): number {
    return (i * -this.bandwidth) / 2;
  }

  override getLegendPointerY1(): number {
    return (2.5 * -this.bandwidth) / 2;
  }

  override getLegendPointerY2(pointerLengthRatio: number): number {
    return (pointerLengthRatio * -this.bandwidth) / 2;
  }

  updateStratLabels(): void {
    let data = [...new Set(this.data.map((d) => d.strat))].sort((a) =>
      a.toLowerCase() === 'ethnicity' ? 1 : -1
    );
    data = data.length > 1 ? data : [];
    const reverseData = [...this.data].reverse();
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
      .selectAll('.strat-line')
      .data((d) => [d])
      .join('line')
      .attr('class', 'strat-line')
      .attr('x1', offset + stratLinePadding)
      .attr('x2', offset + stratLinePadding)
      .attr('y1', (d) => this.getY1(d) + this.stratPadding)
      .attr('y2', (d) => this.getY2(d, reverseData) - this.stratPadding);

    strats
      .filter((_, i) => i > 0)
      .selectAll('.strat-separator')
      .data((d) => [d])
      .join('line')
      .attr('class', 'strat-separator')
      .attr('x1', offset + stratLinePadding * 2)
      .attr('x2', -this.stratPadding * 2)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY1(d));
  }

  getY1(d: string): number {
    const strat = this.data.find((x) => x.strat === d);
    return this.yScale(strat.strat + strat.stratVal);
  }

  getY2(d: string, reverseData: FinalRaceDatum[]): number {
    const strat = reverseData.find((x) => x.strat === d);
    return (
      this.yScale(strat.strat + strat.stratVal) +
      (this.yScale as any).bandwidth()
    );
  }

  getAverageY(d: string, reverseData: FinalRaceDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  updateNoDataLabels(): void {
    const data = this.rollupData.filter(
      (row) =>
        row.length === 1 &&
        row.some(
          (d) => d.year === this.extents[0] || d.year === this.extents[1]
        )
    );

    this.noDataGroup
      .selectAll('.no-data-label')
      .data(data)
      .join('text')
      .attr('class', 'no-data-label')
      .text('no data available')
      .attr('dx', '0.8em')
      .attr('y', (d) => this.getY(d));
  }
}

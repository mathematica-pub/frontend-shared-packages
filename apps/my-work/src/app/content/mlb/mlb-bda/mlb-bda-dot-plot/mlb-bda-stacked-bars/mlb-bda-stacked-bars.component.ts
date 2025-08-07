/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StackDatum } from '@hsi/viz-components';
import { ScaleOrdinal, select, Selection } from 'd3';
import { barbellStackElementHeight } from '../../../../ca/ca-stacked-bars.service';
import { stratLinePadding } from '../../../../ca/ca.constants';
import {
  MlbDatum,
  MlbStackedBarsComponent,
} from '../../../mlb-stacked-bars.component';
import { MlbBdaDatum } from '../../mlb-bda.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-mlb-bda-stacked-bars]',
  standalone: true,
  templateUrl: '',
  imports: [CommonModule],
})
export class MlbBdaStackedBarsComponent
  extends MlbStackedBarsComponent
  implements OnInit
{
  stratGroup: Selection<SVGGElement, unknown, null, undefined>;
  override additionalYAxisOffset = `${this.yAxisOffset - 2.8}em`;
  stratPadding = 3;
  override percentOffset = '0.07em';
  colorScale: ScaleOrdinal<string, unknown>;

  override ngOnInit(): void {
    this.createStratGroup();
    this.colorScale = this.stackedBarsService.getMlbColorScale(this.config);
    super.ngOnInit();
  }

  override drawMarks(): void {
    super.drawMarks();
    this.updateStratLabels();
  }

  createStratGroup(): void {
    this.stratGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'strat-labels');
  }

  override getCategory(lob: MlbBdaDatum): string {
    return lob.stratVal;
  }

  override getColor(lob: MlbDatum): string {
    return this.colorScale(lob.lob) as string;
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
      .selectAll('.strat-line')
      .data((d) => [d])
      .join('line')
      .attr('class', 'strat-line')
      .attr('x1', offset + stratLinePadding)
      .attr('x2', offset + stratLinePadding)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY2(d, reverseData));

    strats
      .filter((_, i) => i > 0)
      .selectAll('.strat-separator')
      .data((d) => [d])
      .join('line')
      .attr('class', 'strat-separator')
      .attr('x1', offset + stratLinePadding * 2)
      .attr('x2', this.chart.config.width - this.stratPadding * 2)
      .attr('y1', (d) => this.getY1(d) - this.stratPadding * 2)
      .attr('y2', (d) => this.getY1(d) - this.stratPadding * 2);
  }

  getY1(d: any): number {
    const strat = this.config.data.find((x) => x.strat === d);
    return this.scales.y(strat.stratVal) + this.stratPadding;
  }

  getY2(d: any, reverseData: MlbBdaDatum[]): number {
    const strat = reverseData.find((x) => x.strat === d);
    return (
      this.scales.y(strat.stratVal) +
      (this.scales.y as any).bandwidth() -
      this.stratPadding
    );
  }

  getAverageY(d: any, reverseData: MlbBdaDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  override getStackElementX(datum: StackDatum): number {
    return Math.min(this.scales.x(datum[0]), this.scales.x(datum[1]));
  }

  override getStackElementY(datum: StackDatum): number {
    return this.stackedBarsService.getBarbellStackElementY(
      datum,
      this.scales,
      this.config
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getStackElementHeight(datum: StackDatum): number {
    return barbellStackElementHeight;
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

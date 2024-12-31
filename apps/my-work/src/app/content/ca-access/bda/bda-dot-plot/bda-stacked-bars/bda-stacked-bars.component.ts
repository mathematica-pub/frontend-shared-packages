/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StackDatum } from '@hsi/viz-components';
import { select, Selection } from 'd3';
import { CaAccessStackedBarsComponent } from '../../../ca-access-stacked-bars.component';
import { BdaDatum } from '../../bda.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-bda-stacked-bars]',
  standalone: true,
  templateUrl: './bda-stacked-bars.component.html',
  styleUrl: './bda-stacked-bars.component.scss',
  imports: [CommonModule],
})
export class BdaStackedBarsComponent
  extends CaAccessStackedBarsComponent
  implements OnInit
{
  stratGroup: Selection<SVGGElement, unknown, null, undefined>;
  override additionalYAxisOffset = `${this.yAxisOffset - 2.8}em`;
  goalThickness = 6;
  stratPadding = 3;
  override percentOffset = '0.07em';

  override ngOnInit(): void {
    this.createStratGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    super.drawMarks();
    this.updateStratLabels();
    this.updateGoalGroup();
  }

  createStratGroup(): void {
    this.stratGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'strat-labels');
  }

  override getCategory(category: BdaDatum): string {
    return category.stratVal;
  }

  override getComparisonDescription(): string {
    return 'goal';
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
    const offset = -this.labelWidth - 80;
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

  getY2(d: any, reverseData: BdaDatum[]): number {
    const strat = reverseData.find((x) => x.strat === d);
    return (
      this.scales.y(strat.stratVal) +
      (this.scales.y as any).bandwidth() -
      this.stratPadding
    );
  }

  getAverageY(d: any, reverseData: BdaDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  updateGoalGroup(): void {
    let x = this.chart.width * 0.4;
    if (this.compPosition > 0.3 && this.compPosition < 0.66) {
      x = this.chart.width - 60;
    } else if (this.compPosition > 0.1 && this.compPosition < 0.66) {
      x = this.chart.width * 0.6;
    }
    const group = this.headerGroup
      .selectAll('.goal')
      .data([this.config.data[0].goal].filter((d) => d !== null))
      .join('g')
      .attr('class', 'goal')
      .attr(
        'transform',
        `translate(${x}, ${-(this.scales.y as any).bandwidth() / 2 - 4})`
      );
    group
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('width', this.goalThickness)
      .attr('height', (this.scales.y as any).bandwidth());
    group
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('dx', '0.5em')
      .attr('y', (this.scales.y as any).bandwidth() / 2)
      .attr('dy', '0.3em')
      .text('Goal');
  }

  override getStackElementX(datum: StackDatum): number {
    return (
      Math.min(this.scales.x(datum[0]), this.scales.x(datum[1])) -
      this.goalThickness / 2
    );
  }

  override getStackElementWidth(): number {
    return this.goalThickness;
  }
}

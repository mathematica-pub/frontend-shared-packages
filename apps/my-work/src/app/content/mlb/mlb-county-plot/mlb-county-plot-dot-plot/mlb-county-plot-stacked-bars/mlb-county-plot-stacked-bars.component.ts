/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScaleOrdinal, scaleOrdinal, select, Selection } from 'd3';
import { MlbStackedBarsComponent } from '../../../mlb-stacked-bars.component';
import { mlbColorRange, stateName } from '../../../mlb.constants';
import { MlbCountyDatum } from '../../mlb-county-plot.component';

interface StratLabelDatum {
  text: string;
  county: { first: string; last: string };
}

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
  stratPadding = 3;
  colorScale: ScaleOrdinal<string, unknown>;
  barHeight = 3;

  override ngOnInit(): void {
    this.createStratGroup();
    this.setColorScale();
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

  setColorScale(): void {
    const domain = [
      ...new Set(this.config.data.map((d) => d.lob).filter((d) => d !== null)),
    ].sort((a) => {
      return a === stateName.mock || a === stateName.real ? 1 : -1;
    });
    this.colorScale = scaleOrdinal().domain(domain).range(mlbColorRange);
  }

  override getCategory(lob: MlbCountyDatum): string {
    return lob.county;
  }

  override getColor(lob: MlbCountyDatum): string {
    return this.colorScale(lob.lob) as string;
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

  updateStratLabels(): void {
    const reverseData = [...this.config.data].reverse();

    const firstIsHighest = this.config.data.find(
      (x) => x.isStateHighest
    )?.county;
    const lastIsHighest = reverseData.find((x) => x.isStateHighest)?.county;
    const firstIsLowest = this.config.data.find((x) => x.isStateLowest)?.county;
    const lastIsLowest = reverseData.find((x) => x.isStateLowest)?.county;
    const firstIsBetween = this.config.data.find(
      (x) => !x.isStateLowest && !x.isStateHighest
    )?.county;
    const lastIsBetween = reverseData.find(
      (x) => !x.isStateLowest && !x.isStateHighest
    )?.county;

    const data: StratLabelDatum[] = [
      {
        text: 'highest',
        county: { first: firstIsHighest, last: lastIsHighest },
      },
      {
        text: 'between',
        county: { first: firstIsBetween, last: lastIsBetween },
      },
      {
        text: 'lowest',
        county: { first: firstIsLowest, last: lastIsLowest },
      },
    ].filter((d) => d.county.first && d.county.last);

    const strats = this.stratGroup
      .selectAll('.strat-label')
      .data(data)
      .join('g')
      .attr('class', 'strat-label');
    const offset = -this.labelWidth - 30;
    const lineHeight = 20;
    const text = strats
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('y', (d) => this.getAverageY(d) - lineHeight)
      .attr('transform', (d) => {
        const y = this.getAverageY(d);
        return `rotate(-90, ${offset}, ${y})`;
      });
    text
      .selectAll('tspan')
      .data((d) => [`${stateName.abbreviation} is `, d.text])
      .join('tspan')
      .text((d) => d)
      .attr('x', offset)
      .attr('dy', (d, i) => (i === 0 ? 0 : lineHeight));
    strats
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('x1', offset + 8)
      .attr('x2', offset + 8)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY2(d));
  }

  getY1(d: StratLabelDatum): number {
    return this.scales.y(d.county.first) + this.stratPadding;
  }

  getY2(d: StratLabelDatum): number {
    return (
      this.scales.y(d.county.last) +
      (this.scales.y as any).bandwidth() -
      this.stratPadding
    );
  }

  getAverageY(d: StratLabelDatum): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d);
    const average = (y1 + y2) / 2;
    return average;
  }
}

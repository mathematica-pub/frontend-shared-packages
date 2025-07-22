/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScaleOrdinal, scaleOrdinal, select, Selection } from 'd3';
import {
  MlbDatum,
  MlbStackedBarsComponent,
} from '../../../mlb-stacked-bars.component';
import { lobNames, mlbColorRange } from '../../../mlb.constants';
import { MlbCountyDatum } from '../../mlb-county-plot.component';

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
  stratPadding = 3;
  colorScale: ScaleOrdinal<string, unknown>;
  barHeight = 3;

  override ngOnInit(): void {
    this.createGroups();
    this.setColorScale();
    super.ngOnInit();
  }

  override drawMarks(): void {
    super.drawMarks();
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
    ].sort((a) => {
      return a === lobNames.mock || a === lobNames.real ? 1 : -1;
    });
    this.colorScale = scaleOrdinal().domain(domain).range(mlbColorRange);
  }

  override getCategory(lob: MlbCountyDatum): string {
    return lob.county;
  }

  override getColor(lob: MlbDatum): string {
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
}

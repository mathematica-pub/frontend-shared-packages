/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@hsi/viz-components';
import { select, Selection } from 'd3';
import {
  barbellStackElementHeight,
  CaStackedBarsService,
} from '../ca/ca-stacked-bars.service';
import { stateName } from './mlb.constants';

export interface MlbDatum {
  lob: string;
  comparison: boolean;
  average: number;
  series: string;
  measureCode: string;
  value: number;
  units: string;
  directionality: string;
  stratVal: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-mlb-stacked-bars]',
  standalone: true,
  templateUrl: 'mlb-stacked-bars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [CaStackedBarsService],
})
export class MlbStackedBarsComponent
  extends StackedBarsComponent<any, string>
  implements OnInit
{
  @Input() labelWidth: number;
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  xLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  headerOffset = -50;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2.5}em`;
  radius = 7;
  highlightedRadius = 3;
  percentOffset: string;

  constructor(public stackedBarsService: CaStackedBarsService) {
    super();
  }

  override ngOnInit(): void {
    this.circleGroup = this.stackedBarsService.createCircleGroup(this.chart);
    this.directionLabel = this.stackedBarsService.createDirectionLabel(
      this.chart
    );
    this.xLabel = this.stackedBarsService.createXLabel(this.chart);
    this.headerGroup = this.stackedBarsService.createHeaderGroup(
      this.chart,
      this.headerOffset
    );
    this.createAverageHeaderGroup();
    this.createNoDataGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawLabels(transitionDuration);
    }
    this.updateBarElements();
    this.updateCircleElements();
    this.updateNoDataLabels();
    this.stackedBarsService.updateDirectionLabel(
      this.directionLabel,
      this.config,
      this.chart
    );
    this.stackedBarsService.updateXLabel(this.xLabel, this.config, this.chart);
    this.updateAverageHeaderGroup();
  }

  createAverageHeaderGroup(): void {
    const group = this.headerGroup
      .append('g')
      .attr('class', 'average-header')
      .attr('transform', `translate(${400}, 26)`);
    group.append('text').attr('dy', -40);
    group
      .append('line')
      .attr('y1', this.radius - 13)
      .attr('y2', -35);
    group
      .append('circle')
      .attr('class', 'average')
      .attr('r', this.radius)
      .attr('cy', this.radius - 13);
  }

  updateAverageHeaderGroup(): void {
    this.headerGroup
      .select('.average-header text')
      .text(this.config.data[0].type);
  }

  createNoDataGroup(): void {
    select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'no-data-labels');
  }

  updateCircleElements(): void {
    this.circleGroup
      .selectAll('.average')
      .data(
        this.config.data.filter(
          (lob: MlbDatum) => lob.series !== 'invisible' && lob.average !== null
        )
      )
      .join('circle')
      .attr('r', (lob: MlbDatum) => this.getR(lob.lob))
      .attr('cx', (lob: MlbDatum) => this.scales.x(lob.average))
      .attr(
        'cy',
        (lob: MlbDatum) =>
          this.scales.y(this.getCategory(lob)) +
          (this.scales.y as any).bandwidth() / 2
      )
      .attr('class', 'average')
      .style('fill', (lob: MlbDatum) => this.getColor(lob))
      .filter((lob: MlbDatum) => this.isHighlighted(lob.lob))
      .lower();
  }

  updateNoDataLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .select('.no-data-labels')
      .selectAll('.no-data-label')
      .data(
        this.config.data.filter(
          (lob: MlbDatum) => lob.lob === null && lob.series === 'percentile'
        )
      )
      .join('text')
      .attr('class', 'no-data-label')
      .text('no data available')
      .attr('dx', `${-this.yAxisOffset}em`)
      .attr('dy', this.percentOffset)
      .attr(
        'y',
        (category: MlbDatum) =>
          this.scales.y(this.getCategory(category)) +
          (this.scales.y as any).bandwidth() / 2
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getR(lob: string): number {
    return this.radius;
  }

  isHighlighted(lob: string): boolean {
    return lob === stateName.mock || lob === stateName.real;
  }

  getCategory(lob: MlbDatum): string {
    console.warn('override getCategory');
    return lob.stratVal;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColor(lob: MlbDatum): string {
    return null;
  }

  override getStackElementY(datum: StackDatum): number {
    if ('percentile25' in this.config.data[0]) {
      return this.stackedBarsService.getStackElementY(
        datum,
        this.scales,
        this.config
      );
    } else {
      return this.stackedBarsService.getBarbellStackElementY(
        datum,
        this.scales,
        this.config
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getStackElementHeight(datum: StackDatum): number {
    if ('percentile25' in this.config.data[0]) {
      return this.stackedBarsService.getStackElementHeight(this.scales);
    } else {
      return barbellStackElementHeight;
    }
  }
}

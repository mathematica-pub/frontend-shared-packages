/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@mathstack/viz';
import { select, Selection } from 'd3';
import {
  barbellStackElementHeight,
  CaStackedBarsService,
} from '../ca/ca-stacked-bars.service';

export interface FinalDatum {
  year: string;
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
  selector: '[app-final-vertical-stacked-bars]',
  standalone: true,
  templateUrl: 'final-vertical-stacked-bars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [CaStackedBarsService],
})
export class FinalVerticalStackedBarsComponent
  extends StackedBarsComponent<any, string>
  implements OnInit
{
  @Input() labelWidth: number;
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  xLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  headerOffset = -110;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2.5}em`;
  radius = 7;
  highlightedRadius = 3;
  percentOffset: string;
  averageOffset = -this.headerOffset / 2 - 10;
  circleY = this.radius - 13;

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
      .attr('transform', `translate(13, ${this.averageOffset})`);
    group.append('text').attr('class', 'average-header-label').attr('dy', -40);
    group
      .append('line')
      .attr('x1', this.radius)
      .attr('x2', 35)
      .attr('y1', -this.radius)
      .attr('y2', -this.radius);
    group
      .append('circle')
      .attr('class', 'average')
      .attr('r', this.radius)
      .attr('cy', this.circleY);
  }

  updateAverageHeaderGroup(): void {
    this.headerGroup
      .select('.average-header-label')
      .attr('x', 35)
      .attr('y', this.averageOffset + this.circleY)
      .attr('dx', '0.5em')
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
          (lob: FinalDatum) =>
            lob.series !== 'invisible' && lob.average !== null
        )
      )
      .join('circle')
      .attr('r', this.radius)
      .attr('cy', (year: FinalDatum) => this.scales.y(year.average))
      .attr(
        'cx',
        (year: FinalDatum) =>
          this.scales.x(this.getCategory(year)) +
          (this.scales.x as any).bandwidth() / 2
      )
      .attr('class', 'average')
      .style('fill', (year: FinalDatum) => this.getColor(year));
  }

  updateNoDataLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .select('.no-data-labels')
      .selectAll('.no-data-label')
      .data(
        this.config.data.filter(
          (year: FinalDatum) =>
            year.year === null && year.series === 'percentile'
        )
      )
      .join('text')
      .attr('class', 'no-data-label')
      .text('no data available')
      .attr('dx', `${-this.yAxisOffset}em`)
      .attr('dy', this.percentOffset)
      .attr(
        'x',
        (category: FinalDatum) =>
          this.scales.x(this.getCategory(category)) +
          (this.scales.x as any).bandwidth() / 2
      );
  }

  getR(): number {
    return this.radius;
  }

  getCategory(year: FinalDatum): string {
    console.warn('override getCategory');
    return year.stratVal;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColor(year: FinalDatum): string {
    return null;
  }

  override getStackElementX(datum: StackDatum): number {
    if ('percentile25' in this.config.data[0]) {
      return this.stackedBarsService.getStackElementX(
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
  override getStackElementWidth(datum: StackDatum): number {
    if ('percentile25' in this.config.data[0]) {
      return this.stackedBarsService.getStackElementWidth(this.scales);
    } else {
      return barbellStackElementHeight;
    }
  }
}

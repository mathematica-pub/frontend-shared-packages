/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@mathstack/viz';
import { format, select, Selection } from 'd3';
import {
  barbellStackElementHeight,
  CaStackedBarsService,
} from '../ca/ca-stacked-bars.service';
import { FinalPercentilesDatum } from './final-percentiles/final-percentiles.component';

export interface FinalDatum {
  year: string;
  series: string;
  measureCode: string;
  value: number;
  units: string;
  directionality: string;
  strat: string;
  stratVal: string;
  delivSys: string;
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
  dataLabelGroup: Selection<SVGGElement, unknown, null, undefined>;
  headerOffset = -150;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2.5}em`;
  radius = 7;
  highlightedRadius = 3;
  percentOffset: string;
  averageOffset = -this.headerOffset - 106;
  legendOffset = 35;
  circleY = this.radius - 13;
  isPercent: boolean;

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
    this.createLegendLabel();
    this.createDataLabelGroup();
    this.createNoDataGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    this.updateIsPercent();
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
    this.updateDataLabelGroup();
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
      .attr('x2', this.legendOffset)
      .attr('y1', -this.radius)
      .attr('y2', -this.radius);
    group
      .append('circle')
      .attr('class', 'average')
      .attr('r', this.radius)
      .attr('cy', this.circleY);
  }

  createLegendLabel(): void {
    this.headerGroup
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', this.legendOffset)
      .attr('y', -26)
      .text('legend');
  }

  createDataLabelGroup(): void {
    this.dataLabelGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'data-labels')
      .attr('text-anchor', 'middle');
  }

  updateAverageHeaderGroup(): void {
    this.headerGroup
      .select('.average-header-label')
      .attr('x', this.legendOffset)
      .attr('y', this.averageOffset + this.circleY)
      .attr('dx', '0.5em')
      .text(this.config.data[0].type);
  }

  updateDataLabelGroup(): void {
    const data = this.config.data.filter(
      (lob: FinalPercentilesDatum) =>
        lob.series !== 'invisible' && lob.average !== null
    );

    const formatString = this.isPercent
      ? '.1%'
      : this.scales.y.domain()[1] > 10
        ? ','
        : '.1f';

    const overlapThreshold = 0.05;

    this.dataLabelGroup
      .selectAll('.data-label-25')
      .data(data)
      .join('text')
      .attr('class', 'data-label data-label-25')
      .attr('x', (d) => this.getX(d))
      .attr('y', (d: FinalPercentilesDatum) => {
        const isLabelOverlap =
          d.percentile25 - d.average <
            overlapThreshold * this.scales.y.domain()[1] &&
          d.percentile25 > d.average;
        return isLabelOverlap
          ? this.scales.y(d.average) + this.radius / 2
          : this.scales.y(d.percentile25);
      })
      .attr('dy', (d) =>
        d.percentile25 > d.percentile75 ? '-0.25em' : '0.25em'
      )
      .text((d: FinalPercentilesDatum) => format(formatString)(d.percentile25))
      .style('alignment-baseline', (d) =>
        d.percentile25 < d.percentile75 ? 'hanging' : 'baseline'
      );

    this.dataLabelGroup
      .selectAll('.data-label-75')
      .data(data)
      .join('text')
      .attr('class', 'data-label data-label-75')
      .attr('x', (d) => this.getX(d))
      .attr('y', (d: FinalPercentilesDatum) => {
        const isLabelOverlap =
          d.average - d.percentile75 <
            overlapThreshold * this.scales.y.domain()[1] &&
          d.average > d.percentile75;
        return isLabelOverlap
          ? this.scales.y(d.average) - this.radius
          : this.scales.y(d.percentile75);
      })
      .attr('dy', (d) =>
        d.percentile25 < d.percentile75 ? '-0.25em' : '0.25em'
      )
      .text((d: FinalPercentilesDatum) => format(formatString)(d.percentile75))
      .style('alignment-baseline', (d) =>
        d.percentile25 > d.percentile75 ? 'hanging' : 'baseline'
      );
  }

  getX(d: FinalPercentilesDatum): number {
    return (
      this.scales.x(this.getCategory(d)) +
      (this.scales.x as any).bandwidth() / 2
    );
  }

  updateIsPercent(): void {
    this.isPercent = this.config.data[0].units
      .toLowerCase()
      .includes('percent');
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
          (lob: FinalPercentilesDatum) =>
            lob.series !== 'invisible' && lob.average !== null
        )
      )
      .join('circle')
      .attr('r', this.radius)
      .attr('cy', (year: FinalPercentilesDatum) => this.scales.y(year.average))
      .attr(
        'cx',
        (year: FinalPercentilesDatum) =>
          this.scales.x(this.getCategory(year)) +
          (this.scales.x as any).bandwidth() / 2
      )
      .attr('class', 'average')
      .style('fill', (year: FinalPercentilesDatum) => this.getColor(year));
  }

  updateNoDataLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .select('.no-data-labels')
      .selectAll('.no-data-label')
      .data(
        this.config.data.filter(
          (year: FinalPercentilesDatum) =>
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
        (category: FinalPercentilesDatum) =>
          this.scales.x(this.getCategory(category)) +
          (this.scales.x as any).bandwidth() / 2
      );
  }

  getR(): number {
    return this.radius;
  }

  getCategory(year: FinalPercentilesDatum): string {
    console.warn('override getCategory');
    return year.stratVal;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColor(year: FinalPercentilesDatum): string {
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@hsi/viz-components';
import { format, select, Selection } from 'd3';
import { CaStackedBarsService } from '../ca/ca-stacked-bars.service';

export interface CaDatum {
  series: string;
  plans: number[];
  measureCode: string;
  delivSys: string;
  value: number;
  planValue: number;
  units: string;
  compVal: number;
  compValDesc: string;
  directionality: string;
  pctBelowComp: number;
  stratVal: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-ca-access-stacked-bars]',
  standalone: true,
  templateUrl: 'ca-access-stacked-bars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [CaStackedBarsService],
})
export class CaAccessStackedBarsComponent
  extends StackedBarsComponent<any, string>
  implements OnInit
{
  @Input() labelWidth: number;
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  comparisonGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  xLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  compVal: number;
  compIsBig: boolean;
  compPosition: number;
  planLabelPosition: number;
  percentileLabelPosition: number;
  headerOffset = -50;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2.5}em`;
  radius = 5;
  percentOffset: string;

  constructor(private stackedBarsService: CaStackedBarsService) {
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
    this.createSizeHeaderGroup();
    this.createPlanHeaderGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawLabels(transitionDuration);
    }
    this.setCompValues();
    this.setLabelPositions();
    this.updateBarElements();
    this.updateCircleElements();
    this.updateComparison();
    this.updatePercentLabels();
    this.stackedBarsService.updateDirectionLabel(
      this.directionLabel,
      this.config,
      this.chart
    );
    this.stackedBarsService.updateXLabel(this.xLabel, this.config, this.chart);
    this.updatePlanHeader();
  }

  createSizeHeaderGroup(): void {
    const group = this.headerGroup.append('g').attr('class', 'size-headers');
    group
      .append('text')
      .attr('dy', '-0.6em')
      .attr('dx', this.additionalYAxisOffset)
      .text('County Categories');
    group
      .append('text')
      .attr('dy', '0.6em')
      .attr('dx', this.additionalYAxisOffset)
      .text('by Population');
  }

  createPlanHeaderGroup(): void {
    const group = this.headerGroup.append('g').attr('class', 'plan-header');
    group
      .append('text')
      .attr('x', this.radius * 2 + 20)
      .text('Plans');
    group
      .append('circle')
      .attr('r', this.radius)
      .attr('cx', '1em')
      .attr('cy', -this.radius - 2);
  }

  setCompValues(): void {
    this.compVal = this.config.data.find(
      (category) => category.compVal !== null
    )?.compVal;
    this.compPosition = this.compVal / this.scales.x.domain()[1];
  }

  setLabelPositions(): void {
    const breakpoint = 0.7;
    this.compIsBig =
      this.scales.x(this.compVal) > this.chart.config.width * breakpoint;
    const planEnd = this.chart.config.width - 80;
    const percentileFront = 100;
    if (this.compPosition < 0.15) {
      this.planLabelPosition = planEnd;
      this.percentileLabelPosition = this.chart.config.width - 320;
    } else if (this.compPosition < 0.35) {
      this.planLabelPosition = 0;
      this.percentileLabelPosition = this.chart.config.width - 220;
    } else if (this.compPosition < 0.55) {
      this.planLabelPosition = planEnd;
      this.percentileLabelPosition = 0;
    } else if (this.compPosition < breakpoint) {
      this.planLabelPosition = 0;
      this.percentileLabelPosition = percentileFront;
    } else if (this.compPosition < 0.85) {
      this.planLabelPosition = planEnd;
      this.percentileLabelPosition = 0;
    } else {
      this.planLabelPosition = 0;
      this.percentileLabelPosition = percentileFront;
    }
  }

  updateCircleElements(): void {
    this.circleGroup
      .selectAll('.category')
      .data(
        this.config.data.filter(
          (category: CaDatum) => category.series !== 'invisible'
        )
      )
      .join('g')
      .attr('class', 'category')
      .attr(
        'transform',
        (category: CaDatum) =>
          `translate(0, ${this.scales.y(this.getCategory(category)) + (this.scales.y as any).bandwidth() / 2})`
      )
      .selectAll('.plan')
      .data((category: CaDatum) => category.plans)
      .join('circle')
      .attr('r', this.radius)
      .attr('cx', (plan) => this.scales.x(plan))
      .attr('class', 'plan');
  }

  getCategory(category: CaDatum): string {
    console.warn('override getCategory');
    return category.stratVal;
  }

  updateComparison(): void {
    const comparisonGroup = select(this.chart.svgRef.nativeElement)
      .selectAll('.comparison')
      .data([this.compVal].filter((d) => d !== null && d !== undefined))
      .join('g')
      .attr('class', 'comparison')
      .attr('transform', `translate(${this.scales.x(this.compVal)}, 0)`);

    comparisonGroup
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('y1', this.chart.config.height)
      .attr('y2', this.headerOffset - 16);

    comparisonGroup
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('y', this.headerOffset)
      .attr('dx', this.compIsBig ? '-0.4em' : '0.4em')
      .attr('text-anchor', this.compIsBig ? 'end' : null)
      .text(
        this.config.data.find((category) => category.compVal !== null)
          ?.compValDesc
      );
  }

  updatePercentLabels(): void {
    const percentGroup = select(this.chart.svgRef.nativeElement)
      .selectAll('.percent-labels')
      .data([this.compVal].filter((d) => d !== null))
      .join('g')
      .attr('class', 'percent-labels');

    percentGroup
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('x1', `${this.yAxisOffset - 0.8}em`)
      .attr('x2', `${this.yAxisOffset - 0.8}em`)
      .attr('y1', '0.1em')
      .attr('y2', '-0.5em');
    percentGroup
      .selectAll('.comparison-label')
      .data((d) => [d])
      .join('text')
      .attr('class', 'comparison-label')
      .attr('dx', `${this.yAxisOffset - 1.7}em`)
      .attr('dy', '-0.8em');

    percentGroup
      .selectAll('.percent-label')
      .data(
        this.config.data.filter(
          (category: CaDatum) => category.series !== 'invisible'
        )
      )
      .join('text')
      .attr('class', 'percent-label')
      .attr('dx', (category: CaDatum) =>
        category.plans.length > 0
          ? `${this.yAxisOffset}em`
          : `${-this.yAxisOffset}em`
      )
      .attr('dy', this.percentOffset)
      .attr(
        'y',
        (category: CaDatum) =>
          this.scales.y(this.getCategory(category)) +
          (this.scales.y as any).bandwidth() / 2
      )
      .text((category: CaDatum) =>
        category.plans.length > 0
          ? format('.0%')(category.pctBelowComp)
          : 'no plans available'
      )
      .style('text-anchor', (category: CaDatum) =>
        category.plans.length > 0 ? 'end' : null
      );

    percentGroup
      .selectAll('.comparison-label')
      .data((d) => [d])
      .join('text')
      .text(
        `% of plans ${this.getDirection()} the ${this.getComparisonDescription()}`
      );
  }

  getComparisonDescription(): string {
    console.warn('override getComparisonDescription');
    return 'comparison value';
  }

  getDirection(): string {
    return this.config.data
      .find((category) => category.directionality !== null)
      .directionality.toLowerCase()
      .includes('higher')
      ? 'below'
      : 'above';
  }

  updatePlanHeader(): void {
    this.headerGroup.select('.plan-header').attr('transform', () => {
      return `translate(${this.planLabelPosition}, 0)`;
    });
  }

  override getStackElementY(datum: StackDatum): number {
    return this.stackedBarsService.getStackElementY(
      datum,
      this.scales,
      this.config
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getStackElementHeight(datum: StackDatum): number {
    return this.stackedBarsService.getStackElementHeight(this.scales);
  }
}

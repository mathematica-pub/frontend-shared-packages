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
  headerOffset = -50;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2.5}em`;
  radius = 5;
  percentOffset: string;

  override ngOnInit(): void {
    this.createCircleGroup();
    this.createDirectionLabel();
    this.createXLabel();
    this.createHeaderGroup();
    this.createSizeHeaderGroup();
    this.createPlanHeaderGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawBarLabels(transitionDuration);
    }
    this.setCompValues();
    this.updateBarElements();
    this.updateGridlines();
    this.updateCircleElements();
    this.updateComparison();
    this.updatePercentLabels();
    this.updateDirectionLabel();
    this.updateXLabel();
    this.updatePlanHeader();
    this.updateYLabels();
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createDirectionLabel(): void {
    this.directionLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label');
  }

  createXLabel(): void {
    this.xLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'x-label')
      .attr('x', this.chart.width);
  }

  createHeaderGroup(): void {
    this.headerGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'headers')
      .attr('transform', `translate(0, ${this.headerOffset})`);
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
    this.compVal = this.config.data[0].compVal;
    this.compIsBig = this.scales.x(this.compVal) > this.chart.width / 2;
    this.compPosition = this.compVal / this.scales.x.domain()[1];
  }

  updateGridlines(): void {
    this.updateGridline('horizontal');
    this.updateGridline('vertical');
  }

  updateGridline(orientation: string): void {
    select(this.chart.svgRef.nativeElement)
      .selectAll(orientation === 'horizontal' ? '.vic-y .tick' : '.vic-x .tick')
      .selectAll(`.${orientation}.gridline`)
      .data((d) => [d])
      .join('line')
      .attr('class', `${orientation} gridline`)
      .attr('x2', orientation === 'horizontal' ? this.chart.width : 0)
      .attr('y2', orientation === 'vertical' ? -this.chart.height : 0);
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
      .data([this.compVal].filter((d) => d !== null))
      .join('g')
      .attr('class', 'comparison')
      .attr('transform', `translate(${this.scales.x(this.compVal)}, 0)`);

    comparisonGroup
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('y1', this.chart.height)
      .attr('y2', this.headerOffset - (this.scales.y as any).bandwidth() / 2);

    comparisonGroup
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('y', this.headerOffset)
      .attr('dx', this.compIsBig ? '-0.4em' : '0.4em')
      .attr('text-anchor', this.compIsBig ? 'end' : null)
      .text(this.config.data[0].compValDesc);
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
      .attr('dx', `${this.yAxisOffset}em`)
      .attr('dy', this.percentOffset)
      .attr(
        'y',
        (category: CaDatum) =>
          this.scales.y(this.getCategory(category)) +
          (this.scales.y as any).bandwidth() / 2
      )
      .text((category: CaDatum) => format('.0%')(category.pctBelowComp));

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
    return this.config.data[0].directionality === 'Higher is better'
      ? 'below'
      : 'above';
  }

  updateDirectionLabel(): void {
    this.directionLabel
      .text(this.config.data[0].directionality)
      .attr('y', this.chart.height + 40);
  }

  updateXLabel(): void {
    this.xLabel
      .text(
        this.config.data[0].units === 'Percentage'
          ? null
          : this.config.data[0].units
      )
      .attr('y', this.chart.height + 40);
  }

  updatePlanHeader(): void {
    this.headerGroup.select('.plan-header').attr('transform', () => {
      const x = this.compPosition < 0.15 ? this.chart.width - 80 : 0;
      return `translate(${x}, 0)`;
    });
  }

  updateYLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .selectAll('.vic-y text')
      .style('transform', `translate(${this.additionalYAxisOffset}, 0)`);
  }

  override getStackElementY(datum: StackDatum): number {
    return (
      this.scales.y(this.config[this.config.dimensions.y].values[datum.i]) +
      (this.scales.y as any).bandwidth() / 4
    );
  }

  override getStackElementHeight(datum: StackDatum): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.scales.y as any).bandwidth() / 2;
  }
}

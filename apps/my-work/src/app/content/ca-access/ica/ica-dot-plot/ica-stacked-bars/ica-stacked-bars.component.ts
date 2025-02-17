/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@hsi/viz-components';
import { select, Selection } from 'd3';
import { IcaDatum } from '../ica-dot-plot.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-ica-stacked-bars]',
  standalone: true,
  templateUrl: './ica-stacked-bars.component.html',
  styleUrl: './ica-stacked-bars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class IcaStackedBarsComponent
  extends StackedBarsComponent<IcaDatum, string>
  implements OnInit
{
  sizeGroup: Selection<SVGGElement, unknown, null, undefined>;
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  comparisonGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  labelWidth = 60;
  sizePadding = 3;
  headerOffset = -50;
  yAxisOffset = -0.8;
  radius = 4;
  barThickness = 3;

  override ngOnInit(): void {
    this.createSizeGroup();
    this.createSizeTitle();
    this.createCircleGroup();
    this.createDirectionLabel();
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
    this.updateBarElements();
    this.updateGridlines();
    this.updateCircleElements();
    this.updateDirectionLabel();
    this.updatePlanHeader();
    this.updateYLabels();
    this.updateSizeTitle();
    this.updateSizeLabels();
  }

  createSizeGroup(): void {
    this.sizeGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'size-labels');
  }

  createSizeTitle(): void {
    this.sizeGroup
      .append('text')
      .attr('class', 'size-title')
      .text('County Categories by Population');
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createDirectionLabel(): void {
    this.directionLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label')
      .attr('y', '-1em');
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
      .attr('x', -9)
      .attr('dx', this.yAxisOffset)
      .text('County Categories');
    group
      .append('text')
      .attr('dy', '0.6em')
      .attr('x', -9)
      .attr('dx', this.yAxisOffset)
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
      .selectAll('.county')
      .data(
        this.config.data.filter((plan: IcaDatum) => plan.series !== 'invisible')
      )
      .join('g')
      .attr('class', (county) => county.county + ' county')
      .attr(
        'transform',
        (plan: IcaDatum) =>
          `translate(0, ${this.scales.y(plan.county) + (this.scales.y as any).bandwidth() / 2})`
      )
      .selectAll('.plan')
      .data((plan: IcaDatum) => plan.plans)
      .join('circle')
      .attr('r', this.radius)
      .attr('cx', (plan) => this.scales.x(plan))
      .attr('class', 'plan');
  }

  getDirection(): string {
    return this.config.data[0].directionality === 'Higher is better'
      ? 'below'
      : 'above';
  }

  updateDirectionLabel(): void {
    this.directionLabel
      .text(this.config.data[0].directionality)
      .attr('y', this.chart.height + 40)
      .attr(
        'x',
        this.config.data[0].directionality.includes('Higher')
          ? this.chart.width
          : 0
      )
      .attr(
        'text-anchor',
        this.config.data[0].directionality.includes('Higher') ? 'end' : 'start'
      );
  }

  updatePlanHeader(): void {
    this.headerGroup.select('.plan-header').attr('transform', () => {
      // const x = this.compPosition < 0.15 ? this.chart.width - 80 : 0;
      // TODO: position based on percentiles
      const x = 0;
      return `translate(${x}, 0)`;
    });
  }

  updateYLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .selectAll('.vic-y text')
      .attr('dx', this.yAxisOffset);
  }

  updateSizeTitle(): void {
    const x = -this.labelWidth - 120;
    const y = this.chart.height / 2;
    this.sizeGroup
      .select('.size-title')
      .attr('x', x)
      .attr('y', y)
      .attr('transform', `rotate(-90, ${x}, ${y})`);
  }

  updateSizeLabels(): void {
    let data = [...new Set(this.config.data.map((d) => d.size))];
    data = data.length > 1 ? data : [];
    const reverseData = [...this.config.data].reverse();
    const sizes = this.sizeGroup
      .selectAll('.size-label')
      .data(data)
      .join('g')
      .attr('class', 'size-label');
    const offset = -this.labelWidth - 80;
    sizes
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
    sizes
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('x1', offset + 8)
      .attr('x2', offset + 8)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY2(d, reverseData));
  }

  getY1(d: any): number {
    const size = this.config.data.find((x) => x.size === d);
    return this.scales.y(size.county) + this.sizePadding;
  }

  getY2(d: any, reverseData: IcaDatum[]): number {
    const size = reverseData.find((x) => x.size === d);
    return (
      this.scales.y(size.county) +
      (this.scales.y as any).bandwidth() -
      this.sizePadding
    );
  }

  getAverageY(d: any, reverseData: IcaDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  override getStackElementY(datum: StackDatum): number {
    return (
      this.scales.y(this.config[this.config.dimensions.y].values[datum.i]) +
      (this.scales.y as any).bandwidth() / 2 -
      this.barThickness / 2
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getStackElementHeight(datum: StackDatum): number {
    return this.barThickness;
  }
}

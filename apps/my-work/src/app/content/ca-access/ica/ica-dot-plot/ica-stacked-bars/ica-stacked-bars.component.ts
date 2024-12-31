/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StackedBarsComponent } from '@hsi/viz-components';
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
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  comparisonGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  headerOffset = -50;
  yAxisOffset = -0.8;
  radius = 4;

  override ngOnInit(): void {
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
    this.updateBarThickness();
    this.updateDirectionLabel();
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

  updateBarThickness(): void {
    select(this.chart.svgRef.nativeElement)
      .select('.vic-bars-g')
      .style(
        'transform',
        `translateY(${(this.scales.y as any).bandwidth() / 2 - 1}px)`
      )
      .selectAll('rect')
      .attr('height', 3);
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
}

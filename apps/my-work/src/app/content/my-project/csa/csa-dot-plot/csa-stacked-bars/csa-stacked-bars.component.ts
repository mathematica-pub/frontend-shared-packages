/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StackedBarsComponent } from '@hsi/viz-components';
import { format, select, Selection } from 'd3';
import { CsaDatum } from '../csa-dot-plot.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-csa-stacked-bars]',
  standalone: true,
  templateUrl: './csa-stacked-bars.component.html',
  styleUrl: './csa-stacked-bars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CsaStackedBarsComponent
  extends StackedBarsComponent<CsaDatum, string>
  implements OnInit
{
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  comparisonGroup: Selection<SVGGElement, unknown, null, undefined>;
  percentGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  compVal: number;
  compIsBig: boolean;
  headerOffset = -40;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2}em`;
  radius = 4;

  override ngOnInit(): void {
    this.createCircleGroup();
    this.createPercentGroup();
    this.createDirectionLabel();
    this.createHeaderGroup();
    this.createSizeHeaderGroup();
    this.createPlanHeaderGroup();
    this.createPercentileGroup();
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
    this.updatePlanHeader();
    this.updateYLabels();
    this.updatePercentileGroup();
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createPercentGroup(): void {
    this.percentGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'percent-labels');

    this.percentGroup
      .append('line')
      .attr('x1', `${this.yAxisOffset - 0.8}em`)
      .attr('x2', `${this.yAxisOffset - 0.8}em`)
      .attr('y1', '0.3em')
      .attr('y2', '-0.5em');
    this.percentGroup
      .append('text')
      .attr('class', 'comparison-label')
      .attr('dx', `${this.yAxisOffset - 1.4}em`)
      .attr('dy', '-0.8em');
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
      .attr('x', this.additionalYAxisOffset)
      .text('County Categories');
    group
      .append('text')
      .attr('dy', '0.6em')
      .attr('x', this.additionalYAxisOffset)
      .text('by Population');
  }

  createPlanHeaderGroup(): void {
    const group = this.headerGroup.append('g').attr('class', 'plan-header');
    group
      .append('text')
      .attr('x', this.radius * 2 + 15)
      .text('Plans');
    group
      .append('circle')
      .attr('r', this.radius)
      .attr('cx', '1em')
      .attr('cy', -this.radius);
  }

  createPercentileGroup(): void {
    const group = this.headerGroup.append('g').attr('class', 'percentile');
    group.append('rect').attr('width', '11em');
    group.append('text').attr('dx', '0.5em').text('25th—75th Percentiles');
  }

  setCompValues(): void {
    this.compVal = this.config.data[0].CSA_CompVal;
    this.compIsBig = this.scales.x(this.compVal) > this.chart.width / 2;
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
          (category: CsaDatum) => category.series !== 'invisible'
        )
      )
      .join('g')
      .attr('class', 'category')
      .attr(
        'transform',
        (category: CsaDatum) =>
          `translate(0, ${this.scales.y(category.size) + (this.scales.y as any).bandwidth() / 2})`
      )
      .selectAll('.plan')
      .data((category: CsaDatum) => category.plans)
      .join('circle')
      .attr('r', this.radius)
      .attr('cx', (plan) => this.scales.x(plan))
      .attr('class', 'plan');
  }

  updateComparison(): void {
    const comparisonGroup = select(this.chart.svgRef.nativeElement)
      .selectAll('.comparison')
      .data([this.config.data[0].CSA_CompVal].filter((d) => d !== null))
      .join('g')
      .attr('class', 'comparison')
      .attr('transform', `translate(${this.scales.x(this.compVal)}, 0)`);

    comparisonGroup
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('y1', this.chart.height)
      .attr('y2', this.headerOffset - 10);

    comparisonGroup
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('y', this.headerOffset)
      .attr('dx', this.compIsBig ? '-0.5em' : '0.5em')
      .attr('text-anchor', this.compIsBig ? 'end' : null)
      .text(this.config.data[0].CSA_CompVal_Desc);
  }

  updatePercentLabels(): void {
    this.percentGroup
      .selectAll('.percent-label')
      .data(
        this.config.data.filter(
          (category: CsaDatum) => category.series !== 'invisible'
        )
      )
      .join('text')
      .attr('class', 'percent-label')
      .attr('dx', `${this.yAxisOffset}em`)
      .attr(
        'y',
        (category: CsaDatum) =>
          this.scales.y(category.size) + (this.scales.y as any).bandwidth() / 2
      )
      .text((category: CsaDatum) => format('.0%')(category.CSA_PctBelowComp));

    this.percentGroup
      .select('.comparison-label')
      .text(
        `% of plans ${this.getDirection()} the ${this.config.data[0].CSA_CompVal_Desc}`
      );
  }

  getDirection(): string {
    return this.config.data[0].directionality === 'Higher is better'
      ? 'below'
      : 'above';
  }

  updateDirectionLabel(): void {
    this.directionLabel
      .text(this.config.data[0].directionality)
      .attr('y', this.chart.height + 30)
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
      const x =
        this.config.data[0].CSA_CompVal < 0.33 * this.scales.x.domain()[1]
          ? this.chart.width - 60
          : 0;
      return `translate(${x}, 0)`;
    });
  }

  updateYLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .selectAll('.vic-y text')
      .attr('dx', this.additionalYAxisOffset);
  }

  updatePercentileGroup(): void {
    const compPosition =
      this.config.data[0].CSA_CompVal * this.scales.x.domain()[1];
    const x =
      compPosition > 0.33 && compPosition < 0.66
        ? this.chart.width - 150
        : this.chart.width * 0.2;
    this.headerGroup
      .select('.percentile')
      .attr(
        'transform',
        `translate(${x}, ${-(this.scales.y as any).bandwidth() / 2 - 4})`
      );
    this.headerGroup
      .select('.percentile rect')
      .attr('height', (this.scales.y as any).bandwidth());
    this.headerGroup
      .select('.percentile text')
      .attr('dy', (this.scales.y as any).bandwidth() / 2);
  }
}

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
  compVal: number;
  compIsBig: boolean;
  yAxisOffset = '-2.8em';

  override ngOnInit(): void {
    this.createCircleGroup();
    this.createComparisonGroup();
    this.createPercentGroup();
    this.createDirectionLabel();
    this.createSizeHeaderGroup();
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
    this.updateYLabels();
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createComparisonGroup(): void {
    this.comparisonGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'comparison');

    this.comparisonGroup.append('line');
    this.comparisonGroup.append('text').attr('dy', '-0.8em');
  }

  createPercentGroup(): void {
    this.percentGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'percent-labels');

    this.percentGroup
      .append('line')
      .attr('x1', '-1.1em')
      .attr('x2', '-1.1em')
      .attr('y1', '0.3em')
      .attr('y2', '-0.5em');
    this.percentGroup
      .append('text')
      .attr('class', 'comparison-label')
      .attr('dx', '-1.7em')
      .attr('dy', '-0.8em');
  }

  createDirectionLabel(): void {
    this.directionLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label')
      .attr('y', '-1em');
  }

  createSizeHeaderGroup(): void {
    const sizeHeaders = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'size-headers');
    sizeHeaders
      .append('text')
      .attr('y', '-3.5em')
      .attr('x', this.yAxisOffset)
      .text('County Categories');
    sizeHeaders
      .append('text')
      .attr('y', '-2.3em')
      .attr('x', this.yAxisOffset)
      .text('by Population');
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
      .attr('r', 4)
      .attr('cx', (plan) => this.scales.x(plan))
      .attr('class', 'plan');
  }

  updateComparison(): void {
    this.comparisonGroup
      .attr('transform', `translate(${this.scales.x(this.compVal)}, 0)`)
      .select('line')
      .attr('y1', this.chart.height)
      .attr('y2', -24);

    this.comparisonGroup
      .select('text')
      .attr('dx', this.compIsBig ? '-0.5em' : '0.5em')
      .attr('text-anchor', this.compIsBig ? 'end' : null)
      .text(this.getDescription(this.config.data[0].CSA_CompVal_Desc));
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
      .attr('dx', '-0.3em')
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
    const padding = 8;

    this.directionLabel
      .text(this.config.data[0].directionality)
      .attr('y', this.chart.height - padding)
      .attr('x', this.compIsBig ? padding : this.chart.width - padding)
      .attr('text-anchor', this.compIsBig ? 'start' : 'end');
  }

  updateYLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .selectAll('.vic-y text')
      .attr('dx', this.yAxisOffset);
  }

  getDescription(description: string): string {
    if (description === 'med') {
      description = 'Statewide median plan rate';
    }
    return description;
  }
}

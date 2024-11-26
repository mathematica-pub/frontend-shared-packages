/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StackedBarsComponent } from '@hsi/viz-components';
import { select, Selection } from 'd3';
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
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  compVal: number;
  compIsBig: boolean;

  override ngOnInit(): void {
    this.createCircleGroup();
    this.createComparisonGroup();
    this.createDirectionLabel();
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
    this.updateDirectionLabel();
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
    this.comparisonGroup.append('text').attr('dy', '-0.7em');
  }

  createDirectionLabel(): void {
    this.directionLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label')
      .attr('y', '-1em');
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
      .attr('y2', -20);

    this.comparisonGroup
      .select('text')
      .attr('dx', this.compIsBig ? '-0.5em' : '0.5em')
      .attr('text-anchor', this.compIsBig ? 'end' : null)
      .text(this.getDescription(this.config.data[0].CSA_CompVal_Desc));
  }

  updateDirectionLabel(): void {
    const padding = 8;

    this.directionLabel
      .text(this.config.data[0].directionality)
      .attr('y', this.chart.height - padding)
      .attr('x', this.compIsBig ? padding : this.chart.width - padding)
      .attr('text-anchor', this.compIsBig ? 'start' : 'end');
  }

  getDescription(description: string): string {
    if (description === 'med') {
      description = 'Statewide median plan rate';
    }
    return description;
  }
}

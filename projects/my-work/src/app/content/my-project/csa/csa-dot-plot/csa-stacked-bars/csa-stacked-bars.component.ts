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
  group: Selection<SVGGElement, unknown, null, undefined>;

  override ngOnInit(): void {
    this.createGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawBarLabels(transitionDuration);
    }
    this.updateBarElements();
    this.updateCircleElements();
  }

  createGroup(): void {
    this.group = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  updateCircleElements(): void {
    this.group
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
      .attr('r', 5)
      .attr('cx', (plan) => this.scales.x(plan))
      .attr('class', 'plan');
  }
}

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

  override ngOnInit(): void {
    this.createCircleGroup();
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
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
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
}

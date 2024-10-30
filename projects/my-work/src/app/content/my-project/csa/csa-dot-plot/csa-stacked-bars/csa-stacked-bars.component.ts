/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StackedBarsComponent } from '@hsi/viz-components';
import { select } from 'd3';
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
  override ngOnInit(): void {
    super.ngOnInit();
    this.drawCircles();
  }

  drawCircles(): void {
    select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans')
      .selectAll('category')
      .data(
        this.config.data.filter((category) => category.series !== 'invisible')
      )
      .join('g')
      .attr(
        'transform',
        (category) =>
          `translate(0, ${this.scales.y(category.size) + (this.scales.y as any).bandwidth() / 2})`
      )
      .selectAll('circle')
      .data((category) => category.plans)
      .join('circle')
      .attr('r', 5)
      .attr('cx', (plan) => this.scales.x(plan));
  }
}

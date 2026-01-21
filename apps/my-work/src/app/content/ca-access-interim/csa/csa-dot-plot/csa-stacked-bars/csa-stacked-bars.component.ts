/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaAccessStackedBarsComponent } from '../../../ca-access-stacked-bars.component';
import { CsaDatum } from '../../csa.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-csa-stacked-bars]',
  standalone: true,
  templateUrl: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CsaStackedBarsComponent extends CaAccessStackedBarsComponent {
  override drawMarks(): void {
    super.drawMarks();
    this.updatePercentileGroup();
  }

  override getCategory(category: CsaDatum): string {
    return category.size;
  }

  override getComparisonDescription(): string {
    return this.config.data
      .find((category) => category.compValDesc !== '')
      .compValDesc.toLowerCase();
  }

  updatePercentileGroup(): void {
    const percentile = this.config.data.some((d) => d.percentile25 !== null);
    const group = this.headerGroup
      .selectAll('.percentile')
      .data([percentile].filter((d) => d === true))
      .join('g')
      .attr('class', 'percentile')
      .attr(
        'transform',
        `translate(${this.percentileLabelPosition}, ${-(this.scales.y as any).bandwidth() / 4 - 4})`
      );
    group
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('width', '11em')
      .attr('height', (this.scales.y as any).bandwidth() / 2)
      .attr('transform', `translate(0, -2)`);
    group
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('dx', '0.5em')
      .attr('dy', (this.scales.y as any).bandwidth() / 4)
      .text('25th–75th Percentiles');
  }
}

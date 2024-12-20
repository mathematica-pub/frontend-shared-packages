/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaAccessStackedBarsComponent } from '../../../ca-access-stacked-bars.component';
import { CsaDatum } from '../../extended-csa.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-extended-csa-stacked-bars]',
  standalone: true,
  templateUrl: './extended-csa-stacked-bars.component.html',
  styleUrl: './csa-stacked-bars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ExtendedCsaStackedBarsComponent extends CaAccessStackedBarsComponent {
  override drawMarks(): void {
    super.drawMarks();
    this.updatePercentileGroup();
  }

  override getCategory(category: CsaDatum): string {
    return category.size;
  }

  override getComparisonDescription(): string {
    return this.config.data[0].compValDesc;
  }

  updatePercentileGroup(): void {
    let x = this.chart.width * 0.2;
    if (this.compPosition > 0.3 && this.compPosition < 0.66) {
      x = this.chart.width - 220;
    } else if (this.compPosition > 0.1 && this.compPosition < 0.66) {
      x = this.chart.width * 0.4;
    }
    const group = this.headerGroup
      .selectAll('.percentile')
      .data([this.config.data[0].csa_25].filter((d) => d !== null))
      .join('g')
      .attr('class', 'percentile')
      .attr(
        'transform',
        `translate(${x}, ${-(this.scales.y as any).bandwidth() / 2 - 4})`
      );
    group
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('width', '11em')
      .attr('height', (this.scales.y as any).bandwidth());
    group
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('dx', '0.5em')
      .attr('dy', (this.scales.y as any).bandwidth() / 2)
      .text('25th—75th Percentiles');
  }
}

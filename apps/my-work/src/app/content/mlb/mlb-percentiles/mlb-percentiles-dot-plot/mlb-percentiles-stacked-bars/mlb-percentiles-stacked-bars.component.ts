/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlbStackedBarsComponent } from '../../../mlb-stacked-bars.component';
import { MlbDatum } from '../../mlb-percentiles.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-mlb-percentiles-stacked-bars]',
  standalone: true,
  templateUrl: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class MlbPercentilesStackedBarsComponent extends MlbStackedBarsComponent {
  override radius = 7;

  override drawMarks(): void {
    super.drawMarks();
    this.updatePercentileGroup();
  }

  override getCategory(category: MlbDatum): string {
    return category.lob;
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
        `translate(300, ${-(this.scales.y as any).bandwidth() / 4 - 4 + 26})`
      )
      .lower();
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
      .attr('dx', '-0.5em')
      .attr('dy', (this.scales.y as any).bandwidth() / 4)
      .text('25th–75th Percentiles');
  }
}

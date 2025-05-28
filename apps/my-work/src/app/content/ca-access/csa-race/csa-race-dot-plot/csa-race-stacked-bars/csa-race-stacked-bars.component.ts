/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaAccessStackedBarsComponent } from '../../../ca-access-stacked-bars.component';
import { CsaRaceDatum } from '../../csa-race.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-csa-race-stacked-bars]',
  standalone: true,
  templateUrl: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CsaRaceStackedBarsComponent extends CaAccessStackedBarsComponent {
  override drawMarks(): void {
    super.drawMarks();
    this.updatePercentileGroup();
  }

  override getCategory(category: CsaRaceDatum): string {
    return category.size;
  }

  override setCompValues(): void {
    this.compVal = this.config.data.find(
      (category) => category.compVal !== null
    ).compVal;
    this.compIsBig = this.scales.x(this.compVal) > this.chart.config.width / 2;
    this.compPosition = this.compVal / this.scales.x.domain()[1];
  }

  override getComparisonDescription(): string {
    return 'goal';
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

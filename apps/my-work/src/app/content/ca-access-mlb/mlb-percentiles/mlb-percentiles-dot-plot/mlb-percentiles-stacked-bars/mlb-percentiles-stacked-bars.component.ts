/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlbStackedBarsComponent } from '../../../mlb-stacked-bars.component';
import { MlbPercentilesDatum } from '../../mlb-percentiles.component';

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
    this.updateHeader();
  }

  override getCategory(category: MlbPercentilesDatum): string {
    return category.lob;
  }

  updatePercentileGroup(): void {
    const percentile = this.config.data.some((d) => d.percentile25 !== null);
    const barWidth = 11;
    const group = this.headerGroup
      .selectAll('.percentile')
      .data([percentile].filter((d) => d === true))
      .join('g')
      .attr('class', 'percentile')
      .attr(
        'transform',
        `translate(113, ${-(this.scales.y as any).bandwidth() / 4 - 4 + 26})`
      )
      .lower();
    group
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('width', `${barWidth}em`)
      .attr('height', (this.scales.y as any).bandwidth() / 2)
      .attr('transform', `translate(0, -2)`);
    group
      .selectAll('text')
      .data(['25th Percentile', '75th Percentile'])
      .join('text')
      .attr('dx', (d) => (this.isOnLeft(d) ? '-0.5em' : `${barWidth}.5em`))
      .attr('dy', (this.scales.y as any).bandwidth() / 4)
      .style('text-anchor', (d) => (this.isOnLeft(d) ? 'end' : 'start'))
      .text((d) => d);
  }

  isOnLeft(d: string): boolean {
    const isHigher = this.config.data[0].directionality.includes('Higher');
    return (
      (isHigher && d.includes('25th')) || (!isHigher && d.includes('75th'))
    );
  }

  updateHeader(): void {
    const legendPadding = 10;
    this.headerGroup
      .attr(
        'transform',
        `translate(${legendPadding}, ${this.chart.config.height + 110})`
      )
      .selectAll('.legend-label')
      .data(['legend'])
      .join('text')
      .attr('class', 'legend-label')
      .attr('y', -12)
      .text((d) => d);
    this.headerGroup
      .selectAll('.legend-border')
      .data([1])
      .join('rect')
      .attr('class', 'legend-border')
      .attr('x', -legendPadding)
      .attr('y', -28 - legendPadding)
      .attr('width', 402 + legendPadding * 2)
      .attr('height', 65 + legendPadding * 2);
    this.headerGroup
      .select('.average-header')
      .attr('transform', `translate(230, 26)`);
  }
}

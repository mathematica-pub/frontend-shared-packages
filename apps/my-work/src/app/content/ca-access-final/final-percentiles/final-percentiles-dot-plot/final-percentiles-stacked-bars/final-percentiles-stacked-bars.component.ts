/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinalVerticalStackedBarsComponent } from '../../../final-vertical-stacked-bars.component';
import { FinalPercentilesDatum } from '../../final-percentiles.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-final-percentiles-stacked-bars]',
  standalone: true,
  templateUrl: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FinalPercentilesStackedBarsComponent extends FinalVerticalStackedBarsComponent {
  override radius = 7;

  override drawMarks(): void {
    super.drawMarks();
    this.updatePercentileGroup();
  }

  override getCategory(category: FinalPercentilesDatum): string {
    return category.year;
  }

  updatePercentileGroup(): void {
    const percentile = this.config.data.some((d) => d.percentile25 !== null);
    const group = this.headerGroup
      .selectAll('.percentile')
      .data([percentile].filter((d) => d === true))
      .join('g')
      .attr('class', 'percentile')
      .lower();
    const rectLength = 80;
    group
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('height', rectLength)
      .attr('width', (this.scales.x as any).bandwidth() / 2)
      .attr('transform', `translate(0, -2)`);
    group
      .selectAll('text')
      .data((d) => (d ? ['25th Percentile', '75th Percentile'] : []))
      .join('text')
      .attr('y', (d) => {
        const directionality = this.config.data[0].directionality.toLowerCase();
        const lowLabel = d === '25th Percentile';
        let y = 0;
        if (
          (directionality.includes('higher') && lowLabel) ||
          (directionality.includes('lower') && lowLabel)
        ) {
          y = rectLength;
        }
        return y;
      })
      .attr('x', (this.scales.x as any).bandwidth() / 2)
      .attr('dx', '0.5em')
      .text((d) => d);
  }
}

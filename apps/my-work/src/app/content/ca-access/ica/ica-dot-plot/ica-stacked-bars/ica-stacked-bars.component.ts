/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@hsi/viz-components';
import { extent, format, max, select, Selection } from 'd3';
import { IcaDatum } from '../ica-dot-plot.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-ica-stacked-bars]',
  standalone: true,
  templateUrl: './ica-stacked-bars.component.html',
  styleUrl: './ica-stacked-bars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class IcaStackedBarsComponent
  extends StackedBarsComponent<IcaDatum, string>
  implements OnInit
{
  sizeGroup: Selection<SVGGElement, unknown, null, undefined>;
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  comparisonGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  rangeGroup: Selection<SVGGElement, unknown, null, undefined>;
  percentileGroup: Selection<SVGGElement, unknown, null, undefined>;
  labelWidth = 60;
  sizePadding = 3;
  headerOffset = -50;
  yAxisOffset = -0.8;
  radius = 4;
  barThickness = 3;
  rangeOffset = '3em';

  override ngOnInit(): void {
    this.createSizeGroup();
    this.createPercentileGroup();
    this.createCircleGroup();
    this.createDirectionLabel();
    this.createHeaderGroup();
    this.createPlanHeaderGroup();
    this.createRangeGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawBarLabels(transitionDuration);
    }
    this.updateBarElements();
    this.updatePercentiles();
    this.updateCircleElements();
    this.updateDirectionLabel();
    this.updatePlanHeader();
    this.updateRange();
    this.updateYLabels();
    this.updateSizeTitle();
    this.updateSizeLabels();
  }

  createSizeGroup(): void {
    this.sizeGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'size-labels');
  }

  createPercentileGroup(): void {
    this.percentileGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'percentiles');
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createDirectionLabel(): void {
    this.directionLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label')
      .attr('y', '-1em');
  }

  createHeaderGroup(): void {
    this.headerGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'headers');
  }

  createPlanHeaderGroup(): void {
    const group = this.headerGroup.append('g').attr('class', 'plan-header');
    group
      .append('text')
      .attr('x', this.radius * 2 + 20)
      .attr('dy', '-0.5em')
      .text('Plans');
    group
      .append('circle')
      .attr('r', this.radius)
      .attr('cx', '1em')
      .attr('cy', -this.radius - 9);
  }

  createRangeGroup(): void {
    this.rangeGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'ranges');
    this.rangeGroup
      .append('text')
      .attr('class', 'range-title')
      .attr('dx', this.rangeOffset)
      .attr('y', '-0.5em')
      .text('Range');
  }

  updatePercentiles(): void {
    const data = [
      this.config.data[0].ica_25,
      this.config.data[0].ica_75,
    ].filter((d) => d !== null);
    this.percentileGroup
      .selectAll('.percentile-label')
      .data(data)
      .join('text')
      .attr('class', 'percentile-label')
      .text((d, i) => (i === 0 ? '25th' : '75th percentile'))
      .attr('x', (d) => this.getPercentileX(d))
      .attr('y', '-0.5em')
      .attr('dx', '-1em');
    this.percentileGroup
      .selectAll('.percentile-line')
      .data(data)
      .join('line')
      .attr('class', 'percentile-line')
      .text((d) => d)
      .attr('x1', (d) => this.scales.x(d))
      .attr('x2', (d) => this.scales.x(d))
      .attr('y2', this.chart.height);
  }

  getPercentileX(percentile: number): number {
    let x = this.scales.x(percentile);
    const gap = this.scales.x(
      this.config.data[0].ica_75 - this.config.data[0].ica_25
    );
    const minGap = 50;
    const adjustment = 15;
    if (gap < minGap && percentile < this.config.data[0].ica_75) {
      x -= adjustment;
    } else if (gap < minGap) {
      x += adjustment;
    }
    return x;
  }

  updateCircleElements(): void {
    this.circleGroup
      .selectAll('.county')
      .data(
        this.config.data.filter(
          (county: IcaDatum) => county.series !== 'invisible'
        )
      )
      .join('g')
      .attr('class', (county) => county.county + ' county')
      .attr(
        'transform',
        (county: IcaDatum) =>
          `translate(0, ${this.scales.y(county.county) + (this.scales.y as any).bandwidth() / 2})`
      )
      .selectAll('.plan')
      .data((county: IcaDatum) => county.plans)
      .join('circle')
      .attr('r', this.radius)
      .attr('cx', (plan) => this.scales.x(plan))
      .attr('class', 'plan');
  }

  getDirection(): string {
    return this.config.data[0].directionality === 'Higher is better'
      ? 'below'
      : 'above';
  }

  updateDirectionLabel(): void {
    this.directionLabel
      .text(this.config.data[0].directionality)
      .attr('y', this.chart.height + 40)
      .attr(
        'x',
        this.config.data[0].directionality.includes('Higher')
          ? this.chart.width
          : 0
      )
      .attr(
        'text-anchor',
        this.config.data[0].directionality.includes('Higher') ? 'end' : 'start'
      );
  }

  updatePlanHeader(): void {
    this.headerGroup.select('.plan-header').attr('transform', () => {
      const isIca25Low = this.scales.x(this.config.data[0].ica_25) < 100;
      let x = 0;
      if (isIca25Low) {
        x = this.chart.width - 160;
        const isIca75High =
          this.scales.x(this.config.data[0].ica_75) > this.chart.width * 0.7;
        if (isIca75High) x = this.chart.width * 0.4;
      } else {
        if (this.isIca75VeryHigh()) x = this.chart.width * 0.4;
      }
      return `translate(${x}, 0)`;
    });
  }

  isIca75VeryHigh(): boolean {
    return this.scales.x(this.config.data[0].ica_75) > this.chart.width - 100;
  }

  updateRange(): void {
    const data = this.config.data.filter((d) => d.series !== 'invisible');
    const maxValue = max(data.map((d) => d.value));
    const x = this.isIca75VeryHigh() ? 5 : this.chart.width;
    this.rangeGroup.attr('transform', `translate(${x}, 0)`);
    this.rangeGroup
      .selectAll('.range-label')
      .data(data)
      .join('text')
      .attr('class', 'range-label')
      .text((d) => {
        const extents = extent(d.plans);
        const range = extents[1] - extents[0];
        const decimals = maxValue > 1 || d.units === 'Percentage' ? '1' : '2';
        const units = d.units === 'Percentage' ? '%' : 'f';
        return format(`.${decimals}${units}`)(range);
      })
      .attr('y', (d) => this.scales.y(d.county))
      .attr('dy', (this.scales.y as any).bandwidth() / 2)
      .attr('dx', this.rangeOffset);
  }

  updateYLabels(): void {
    select(this.chart.svgRef.nativeElement)
      .selectAll('.vic-y text')
      .attr('dx', this.yAxisOffset);
  }

  updateSizeTitle(): void {
    const x = -this.labelWidth - 120;
    const y = this.chart.height / 2;
    const data = this.getSizeLabelData();
    this.sizeGroup
      .selectAll('.size-title')
      .data(data.length ? ['County Categories by Population'] : [])
      .join('text')
      .attr('class', 'size-title')
      .text((d) => d)
      .attr('x', x)
      .attr('y', y)
      .attr('transform', `rotate(-90, ${x}, ${y})`);
  }

  getSizeLabelData(): string[] {
    const data = [...new Set(this.config.data.map((d) => d.size))];
    return data.length > 1 ? data : [];
  }

  updateSizeLabels(): void {
    const reverseData = [...this.config.data].reverse();
    const sizes = this.sizeGroup
      .selectAll('.size-label')
      .data(this.getSizeLabelData())
      .join('g')
      .attr('class', 'size-label');
    const offset = -this.labelWidth - 80;
    sizes
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .text((d) => d)
      .attr('x', offset)
      .attr('y', (d) => this.getAverageY(d, reverseData))
      .attr('transform', (d) => {
        const y = this.getAverageY(d, reverseData);
        return `rotate(-90, ${offset}, ${y})`;
      });
    sizes
      .selectAll('line')
      .data((d) => [d])
      .join('line')
      .attr('x1', offset + 8)
      .attr('x2', offset + 8)
      .attr('y1', (d) => this.getY1(d))
      .attr('y2', (d) => this.getY2(d, reverseData));
  }

  getY1(d: any): number {
    const size = this.config.data.find((x) => x.size === d);
    return this.scales.y(size.county) + this.sizePadding;
  }

  getY2(d: any, reverseData: IcaDatum[]): number {
    const size = reverseData.find((x) => x.size === d);
    return (
      this.scales.y(size.county) +
      (this.scales.y as any).bandwidth() -
      this.sizePadding
    );
  }

  getAverageY(d: any, reverseData: IcaDatum[]): number {
    const y1 = this.getY1(d);
    const y2 = this.getY2(d, reverseData);
    const average = (y1 + y2) / 2;
    return average;
  }

  override getStackElementY(datum: StackDatum): number {
    return (
      this.scales.y(this.config[this.config.dimensions.y].values[datum.i]) +
      (this.scales.y as any).bandwidth() / 2 -
      this.barThickness / 2
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getStackElementHeight(datum: StackDatum): number {
    return this.barThickness;
  }
}

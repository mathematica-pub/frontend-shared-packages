/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StackDatum, StackedBarsComponent } from '@hsi/viz-components';
import { select, Selection } from 'd3';

export interface MlbDatum {
  lob: string;
  average: number;
  series: string;
  measureCode: string;
  delivSys: string;
  value: number;
  units: string;
  directionality: string;
  stratVal: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-mlb-stacked-bars]',
  standalone: true,
  templateUrl: 'mlb-stacked-bars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class MlbStackedBarsComponent
  extends StackedBarsComponent<any, string>
  implements OnInit
{
  @Input() labelWidth: number;
  circleGroup: Selection<SVGGElement, unknown, null, undefined>;
  directionLabel: Selection<SVGTextElement, unknown, null, undefined>;
  xLabel: Selection<SVGTextElement, unknown, null, undefined>;
  headerGroup: Selection<SVGGElement, unknown, null, undefined>;
  headerOffset = -50;
  yAxisOffset = -0.8;
  additionalYAxisOffset = `${this.yAxisOffset - 2.5}em`;
  radius = 5;
  percentOffset: string;

  override ngOnInit(): void {
    this.createCircleGroup();
    this.createDirectionLabel();
    this.createXLabel();
    this.createHeaderGroup();
    this.createAverageHeaderGroup();
    super.ngOnInit();
  }

  override drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawLabels(transitionDuration);
    }
    this.updateBarElements();
    this.updateCircleElements();
    this.updateDirectionLabel();
    this.updateXLabel();
  }

  createCircleGroup(): void {
    this.circleGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'plans');
  }

  createDirectionLabel(): void {
    this.directionLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'direction-label');
  }

  createXLabel(): void {
    this.xLabel = select(this.chart.svgRef.nativeElement)
      .append('text')
      .attr('class', 'x-label')
      .attr('x', this.chart.config.width);
  }

  createHeaderGroup(): void {
    this.headerGroup = select(this.chart.svgRef.nativeElement)
      .append('g')
      .attr('class', 'headers')
      .attr('transform', `translate(0, ${this.headerOffset})`);
  }

  createAverageHeaderGroup(): void {
    const group = this.headerGroup
      .append('g')
      .attr('class', 'average-header')
      .attr('transform', `translate(${400}, 26)`);
    group.append('text').attr('dy', -40).text('Average');
    group
      .append('line')
      .attr('y1', this.radius - 13)
      .attr('y2', -35)
      .text('Average');
    group
      .append('circle')
      .attr('class', 'average')
      .attr('r', this.radius)
      .attr('cy', this.radius - 13);
  }

  updateCircleElements(): void {
    this.circleGroup
      .selectAll('.average')
      .data(
        this.config.data.filter(
          (category: MlbDatum) => category.series !== 'invisible'
        )
      )
      .join('circle')
      .attr('r', this.radius)
      .attr('cx', (lob: MlbDatum) => this.scales.x(lob.average))
      .attr(
        'cy',
        (lob: MlbDatum) =>
          this.scales.y(this.getCategory(lob)) +
          (this.scales.y as any).bandwidth() / 2
      )
      .attr('class', 'average');
  }

  getCategory(category: MlbDatum): string {
    console.warn('override getCategory');
    return category.stratVal;
  }

  getDirection(): string {
    return this.config.data
      .find((category) => category.directionality !== null)
      .directionality.toLowerCase()
      .includes('higher')
      ? 'below'
      : 'above';
  }

  updateDirectionLabel(): void {
    this.directionLabel
      .text(
        this.config.data.find((category) => category.directionality !== null)
          .directionality
      )
      .attr('y', this.chart.config.height + 40);
  }

  updateXLabel(): void {
    this.xLabel
      .text(() => {
        const units = this.config.data.find(
          (category) => category.units !== null
        ).units;
        return units === 'Percentage' ? null : units;
      })
      .attr('y', this.chart.config.height + 40);
  }

  override getStackElementY(datum: StackDatum): number {
    return (
      this.scales.y(this.config[this.config.dimensions.y].values[datum.i]) +
      (this.scales.y as any).bandwidth() / 4
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getStackElementHeight(datum: StackDatum): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.scales.y as any).bandwidth() / 2;
  }
}

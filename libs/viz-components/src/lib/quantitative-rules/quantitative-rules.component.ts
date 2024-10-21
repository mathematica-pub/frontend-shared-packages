import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
} from '@angular/core';
import { select, Selection, Transition } from 'd3';
import { ChartComponent } from '../charts/chart/chart.component';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { XyAuxMarks } from '../marks/xy-marks/xy-aux-marks/xy-aux-marks';
import { QuantitativeRulesConfig } from './config/quantitative-rules-config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-quantitative-rules]',
  templateUrl: './quantitative-rules.component.html',
  styleUrl: './quantitative-rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ChartComponent, useExisting: XyChartComponent }],
})
export class QuantitativeRulesComponent<
  Datum extends number | Date,
> extends XyAuxMarks<Datum, QuantitativeRulesConfig<Datum>> {
  rulesGroups: Selection<SVGGElement, Datum, SVGGElement, unknown>;

  constructor(
    private elRef: ElementRef<SVGGElement>,
    destroyRef: DestroyRef
  ) {
    super(destroyRef);
  }

  drawMarks(): void {
    if (this.chartScalesMatchConfigOrientation()) {
      const transitionDuration = this.getTransitionDuration();
      this.drawRules(transitionDuration);
      if (this.config.labels) {
        this.drawLabels(transitionDuration);
      }
    }
  }

  drawRules(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.rulesGroups = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, Datum>('.vic-quantitative-rule-group')
      .data<Datum>(this.config.data, (d) => d.toString())
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', 'vic-quantitative-rule-group')
            .attr('transform', (d) => this.getRuleTransform(d)),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('transform', (d) => this.getRuleTransform(d)),
        (exit) => exit.remove()
      );

    this.rulesGroups
      .selectAll<SVGLineElement, Datum>('.vic-quantitative-rule')
      .data<Datum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('class', (d) => `vic-quantitative-rule ${d}`)
            .attr('stroke', (d) => this.config.color(d))
            .attr('stroke-width', this.config.stroke.width)
            .attr('stroke-dasharray', this.config.stroke.dasharray)
            .attr('stroke-linecap', this.config.stroke.linecap)
            .attr('stroke-linejoin', this.config.stroke.linejoin)
            .attr('stroke-opacity', this.config.stroke.opacity)
            .attr('x1', 0)
            .attr('x2', this.getWidth())
            .attr('y1', 0)
            .attr('y2', this.getHeight()),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('x1', 0)
            .attr('x2', this.getWidth())
            .attr('y1', 0)
            .attr('y2', this.getHeight()),
        (exit) => exit.remove()
      );
  }

  drawLabels(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.rulesGroups
      .selectAll<SVGTextElement, Datum>('.vic-quantitative-rule-label')
      .data<Datum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', (d) => `vic-quantitative-rule-label ${d}`)
            .style('display', (d) => this.config.labels.display(d))
            .attr('fill', (d) => this.config.labels.color(d))
            .attr('text-anchor', this.config.labels.textAnchor)
            .attr('dominant-baseline', this.config.labels.dominantBaseline)
            .attr('x', (d) => this.getLabelX(d))
            .attr('y', (d) => this.getLabelY(d))
            .text((d) => this.config.labels.value(d)),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('class', (d) => `vic-quantitative-rule-label ${d}`)
            .style('display', (d) => this.config.labels.display(d))
            .attr('fill', (d) => this.config.labels.color(d))
            .attr('text-anchor', this.config.labels.textAnchor)
            .attr('dominant-baseline', this.config.labels.dominantBaseline)
            .attr('x', (d) => this.getLabelX(d))
            .attr('y', (d) => this.getLabelY(d)),
        (exit) => exit.remove()
      );
  }

  // Intended to flag situations where both chart scales and the config are both updated
  // and one goes before the other.
  chartScalesMatchConfigOrientation(): boolean {
    if (this.config.dimensions.isHorizontal) {
      return this.config.data.every((d) => this.scales.y(d) !== undefined);
    } else {
      return this.config.data.every((d) => this.scales.x(d) !== undefined);
    }
  }

  getRuleTransform(d: Datum): string {
    let x;
    let y;
    if (this.config.dimensions.isHorizontal) {
      x = this.scales.x.range()[0];
      y = this.getYStart(d);
    } else {
      x = this.getXStart(d);
      y = this.scales.y.range()[0];
    }
    return `translate(${x}, ${y})`;
  }

  getXStart(d: Datum): number {
    if (this.config.dimensions.isHorizontal) {
      return this.scales.x.range()[0];
    }
    return this.scales.x(d);
  }

  getYStart(d: Datum): number {
    if (this.config.dimensions.isHorizontal) {
      return this.scales.y(d);
    }
    return this.scales.y.range()[1] - this.scales.y.range()[0];
  }

  getWidth(): number {
    if (this.config.dimensions.isHorizontal) {
      return this.scales.x.range()[1] - this.scales.x.range()[0];
    } else {
      return 0;
    }
  }

  getHeight(): number {
    if (this.config.dimensions.isHorizontal) {
      return 0;
    } else {
      return this.scales.y.range()[1] - this.scales.y.range()[0];
    }
  }

  getLabelX(d: Datum): number {
    if (this.config.dimensions.isHorizontal) {
      return this.config.labels.position(this.getXStart(d), this.getXEnd(d), d);
    }
    return this.config.labels.offset;
  }

  getLabelY(d: Datum): number {
    if (this.config.dimensions.isHorizontal) {
      return this.config.labels.offset;
    }
    return this.config.labels.position(this.getYStart(d), this.getYEnd(d), d);
  }

  getXEnd(d: Datum): number {
    if (this.config.dimensions.isHorizontal) {
      return this.scales.x.range()[1] - this.scales.x.range()[0];
    }
    return this.scales.x(d);
  }

  getYEnd(d: Datum): number {
    if (this.config.dimensions.isHorizontal) {
      return this.scales.y(d);
    }
    return this.scales.y.range()[1];
  }
}

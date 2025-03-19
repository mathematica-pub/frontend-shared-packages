import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { select, Selection, Transition } from 'd3';
import { ChartComponent } from '../charts/chart/chart.component';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { XyAuxMarks } from '../marks';
import { QuantitativeRulesConfig } from './config/quantitative-rules-config';

type RulesSvgElements = 'g' | 'rule' | 'label';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-quantitative-rules]',
  template: '',
  styleUrl: './quantitative-rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ChartComponent, useExisting: XyChartComponent }],
  host: {
    '[class]': 'config.marksClass',
  },
  standalone: false,
})
export class QuantitativeRulesComponent<
  Datum extends number | Date,
> extends XyAuxMarks<Datum, QuantitativeRulesConfig<Datum>> {
  rulesGroups: Selection<SVGGElement, Datum, SVGGElement, unknown>;
  protected elRef = inject<ElementRef<SVGGElement>>(ElementRef);

  get class(): Record<RulesSvgElements, string> {
    return {
      g: this.config.marksClass + '-group',
      rule: this.config.marksClass + '-rule',
      label: this.config.marksClass + '-label',
    };
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
      .selectAll<SVGGElement, Datum>(`.${this.class.g}`)
      .data<Datum>(this.config.data, (d) => d.toString())
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', (d, i) =>
              `${this.class.g} ${this.config.datumClass(d, i)}`.trim()
            )
            .attr('transform', (d) => this.getRuleTransform(d)),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('transform', (d) => this.getRuleTransform(d)),
        (exit) => exit.remove()
      );

    this.rulesGroups
      .selectAll<SVGLineElement, Datum>(`.${this.class.rule}`)
      .data<Datum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('class', this.class.rule)
            .attr('stroke', (d) => this.config.color(d))
            .attr('stroke-width', this.config.stroke.width)
            .attr('opacity', this.config.stroke.opacity)
            .attr('stroke-dasharray', this.config.stroke.dasharray)
            .attr('stroke-linecap', this.config.stroke.linecap)
            .attr('stroke-linejoin', this.config.stroke.linejoin)
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
      .selectAll<SVGTextElement, Datum>(`.${this.class.label}`)
      .data<Datum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', this.class.label)
            .style('display', (d) =>
              this.config.labels.display(d) ? null : 'none'
            )
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
            .style('display', (d) =>
              this.config.labels.display(d) ? null : 'none'
            )
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

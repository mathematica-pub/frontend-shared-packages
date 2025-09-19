import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  NgZone,
} from '@angular/core';
import { select } from 'd3';
import { Selection } from 'd3-selection';
import { BehaviorSubject, filter } from 'rxjs';
import { ChartComponent } from '../charts/chart/chart.component';
import {
  XyChartComponent,
  XyChartScales,
} from '../charts/xy-chart/xy-chart.component';
import { DataValue, GenericScale } from '../core';
import { ValueUtilities } from '../core/utilities/values';
import { NumberDimension } from '../data-dimensions/continuous-quantitative/number-dimension/number-dimension';
import { DataDimension } from '../data-dimensions/dimension';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { DotsConfig } from './config/dots-config';

export const DOTS = new InjectionToken<DotsComponent<unknown>>('DotsComponent');

export type DotGroupSelection = Selection<
  SVGGElement,
  DotDatum,
  SVGGElement,
  unknown
>;
export type DotSelection = Selection<
  SVGCircleElement,
  DotDatum,
  SVGGElement,
  DotDatum
>;
export type DotLabelSelection = Selection<
  SVGTextElement,
  DotDatum,
  SVGGElement,
  DotDatum
>;

export type DotDatum = {
  index: number;
  x: DataValue;
  y: DataValue;
  fill: string | number;
  radius: string | number;
};

export interface DotsTooltipDatum<Datum> {
  datum: Datum;
  values: {
    x: string;
    y: string;
    fill: string | number;
    radius: string | number;
  };
  color: string;
}

type DotsSvgElement = 'g' | 'dot';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-dots]',
  template: '',
  styleUrl: './dots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: DotsComponent },
    { provide: DOTS, useExisting: DotsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
  host: {
    '[class]': 'config.marksClass',
    '[style.mixed-blend-mode]': 'config.mixBlendMode',
  },
})
export class DotsComponent<Datum> extends VicXyPrimaryMarks<
  Datum,
  DotsConfig<Datum>
> {
  dotGroups: DotGroupSelection;
  dots: BehaviorSubject<DotSelection> = new BehaviorSubject(null);
  dots$ = this.dots.asObservable().pipe(filter((s) => !!s));
  override scales: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fill: GenericScale<any, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    radius: GenericScale<any, any>;
  } & XyChartScales = {
    fill: undefined,
    radius: undefined,
    x: undefined,
    y: undefined,
    useTransition: undefined,
  };
  private elRef = inject<ElementRef<SVGGElement>>(ElementRef);
  private zone = inject(NgZone);

  get class(): Record<DotsSvgElement, string> {
    return {
      g: this.config.marksClass + '-group',
      dot: this.config.marksClass + '-dot',
    };
  }

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    this.scales.fill = this.config.fill.getScale();
    this.scales.radius = this.config.radius.getScale();
    this.zone.run(() => {
      this.chart.updateScales({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        x: x as unknown as GenericScale<any, any>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y: y as unknown as GenericScale<any, any>,
        useTransition,
      });
    });
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawDots(transitionDuration);
    this.updateDotElements();
  }

  drawDots(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration);

    this.dotGroups = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, DotDatum>(`.${this.class.g}`)
      .data<DotDatum>(
        this.config.valueIndices.map((i) => this.getDotDatumFromIndex(i))
      )
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', (d) =>
              `${this.class.g} ${this.config.datumClass(this.config.data[d.index], d.index)}`.trim()
            )
            .attr(
              'transform',
              (d) => `translate(${this.scales.x(d.x)}, ${this.scales.y(d.y)})`
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr(
              'transform',
              (d) => `translate(${this.scales.x(d.x)}, ${this.scales.y(d.y)})`
            ),
        (exit) => exit.remove()
      );

    this.dotGroups
      .selectAll<SVGCircleElement, DotDatum>(`.${this.class.dot}`)
      .data<DotDatum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', this.class.dot)
            .attr('r', (d) => this.scales.radius(d.radius))
            .attr('fill', (d) => this.scales.fill(d.fill))
            .attr('fill-opacity', this.config.opacity)
            .attr(
              'stroke',
              this.config.stroke ? this.config.stroke.color : 'none'
            )
            .attr(
              'stroke-dasharray',
              this.config.stroke ? this.config.stroke.dasharray : null
            )
            .attr(
              'stroke-linecap',
              this.config.stroke ? this.config.stroke.linecap : null
            )
            .attr(
              'stroke-linejoin',
              this.config.stroke ? this.config.stroke.linejoin : null
            )
            .attr(
              'stroke-opacity',
              this.config.stroke ? this.config.stroke.opacity : null
            )
            .attr(
              'stroke-width',
              this.config.stroke ? this.config.stroke.width : null
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('r', (d) => this.scales.radius(d.radius))
            .attr('fill', (d) => this.scales.fill(d.fill))
            .attr(
              'stroke',
              this.config.stroke ? this.config.stroke.color : 'none'
            )
            .attr(
              'stroke-dasharray',
              this.config.stroke ? this.config.stroke.dasharray : null
            )
            .attr(
              'stroke-linecap',
              this.config.stroke ? this.config.stroke.linecap : null
            )
            .attr(
              'stroke-linejoin',
              this.config.stroke ? this.config.stroke.linejoin : null
            )
            .attr(
              'stroke-opacity',
              this.config.stroke ? this.config.stroke.opacity : null
            )
            .attr(
              'stroke-width',
              this.config.stroke ? this.config.stroke.width : null
            ),
        (exit) => exit.remove()
      );
  }

  getDotDatumFromIndex(index: number): DotDatum {
    return {
      index,
      x: this.config.x.values[index],
      y: this.config.y.values[index],
      fill: this.config.fill.values[index],
      radius: this.config.radius.values[index],
    };
  }

  updateDotElements(): void {
    const dots = select(this.elRef.nativeElement).selectAll<
      SVGCircleElement,
      DotDatum
    >(`.${this.class.dot}`);
    this.dots.next(dots);
  }

  getTooltipData(dotDatum: DotDatum): DotsTooltipDatum<Datum> {
    const datum = this.config.data[dotDatum.index];
    const valueFill = this.config.fill.valueAccessor(datum);
    const tooltipData: DotsTooltipDatum<Datum> = {
      datum,
      values: {
        fill: valueFill,
        radius: this.config.radius.valueAccessor(datum),
        x: this.getFormattedValue('x', datum),
        y: this.getFormattedValue('y', datum),
      },
      color: this.scales.fill(valueFill),
    };
    return tooltipData;
  }

  getFormattedValue(dimension: 'x' | 'y', datum: Datum): string {
    const config = this.config[dimension];
    if (config.formatFunction) {
      return ValueUtilities.customFormat(datum, config.formatFunction);
    } else if (this.isContinuousNumericDimension(config)) {
      return ValueUtilities.d3Format(
        config.valueAccessor(datum) as number,
        config.formatSpecifier
      );
    } else {
      return config.valueAccessor(datum).toString();
    }
  }

  isContinuousNumericDimension(
    dimension: DataDimension<Datum, DataValue>
  ): dimension is NumberDimension<Datum> {
    return (
      'formatSpecifier' in dimension &&
      typeof dimension.formatSpecifier === 'string'
    );
  }
}

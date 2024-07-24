import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Observable } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { NgOnChangesUtilities } from '../../core/utilities/ng-on-changes';
import { SvgTextWrap } from '../../svg-text-wrap/svg-text-wrap';
import {
  GenericScale,
  XyChartComponent,
} from '../../xy-chart/xy-chart.component';
import { XyAxisBaseConfig } from './config/xy-axis-config';

export type XyAxisScale = {
  useTransition: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: GenericScale<any, any>;
};

/**
 * A base directive for all axes.
 */
@Directive()
export abstract class XyAxis<TickValue extends DataValue>
  implements OnInit, OnChanges
{
  /**
   * The configuration for the axis.
   */
  @Input() config: XyAxisBaseConfig<TickValue>;
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisFunction: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axis: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: any;

  constructor(public chart: XyChartComponent, public destroyRef: DestroyRef) {}

  abstract getScale(): Observable<XyAxisScale>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setAxisFunction(): any;
  abstract setTranslate(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setAxis(axisFunction: any): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.updateAxis(this.chart.transitionDuration);
    }
  }

  ngOnInit(): void {
    this.setAxisFunction();
    this.setTranslate();
    this.subscribeToScale();
  }

  subscribeToScale(): void {
    this.getScale()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((scale) => {
        this.onScaleUpdate(scale.scale, scale.useTransition);
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScaleUpdate(scale: GenericScale<any, any>, useTransition: boolean): void {
    const transitionDuration = useTransition
      ? this.chart.transitionDuration
      : 0;
    this.scale = scale;
    this.updateAxis(transitionDuration);
  }

  updateAxis(transitionDuration: number): void {
    this.setAxis(this.axisFunction);
    this.drawAxis(transitionDuration);
    this.processAxisFeatures();
  }

  drawAxis(transitionDuration: number): void {
    const t = select(this.axisRef.nativeElement)
      .transition()
      .duration(transitionDuration);

    select(this.axisRef.nativeElement)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .transition(t as any)
      .call(this.axis)
      .on('end', (d, i, nodes) => {
        const tickText = select(nodes[i]).selectAll('.tick text');
        if (this.config.tickLabelFontSize) {
          this.setTickFontSize(tickText);
        }
        if (this.config.wrap) {
          this.wrapAxisTickText(tickText);
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTickFontSize(tickTextSelection: any): void {
    tickTextSelection.attr('font-size', this.config.tickLabelFontSize);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapAxisTickText(tickTextSelection: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { wrapWidth, ...properties } = this.config.wrap;

    let width: number;
    if (this.config.wrap.wrapWidth === 'bandwidth') {
      width = this.scale.bandwidth();
    } else if (typeof this.config.wrap.wrapWidth === 'function') {
      const chartWidth = this.scale.range()[1] - this.scale.range()[0];
      const numOfTicks = select(this.axisRef.nativeElement)
        .selectAll('.tick')
        .size();
      width = this.config.wrap.wrapWidth(chartWidth, numOfTicks);
    } else {
      width = this.config.wrap.wrapWidth;
    }
    const config = new SvgTextWrap({ ...properties, width });
    tickTextSelection.call(config.wrap);
  }

  processAxisFeatures(): void {
    if (this.config.removeDomain) {
      select(this.axisRef.nativeElement).call((g) =>
        g.select('.domain').remove()
      );
    }
    if (this.config.removeTicks) {
      select(this.axisRef.nativeElement).call((g) =>
        g.selectAll('.tick').remove()
      );
    }
    if (this.config.removeTickMarks) {
      select(this.axisRef.nativeElement).call((g) =>
        g.selectAll('.tick line').remove()
      );
    }
  }
}

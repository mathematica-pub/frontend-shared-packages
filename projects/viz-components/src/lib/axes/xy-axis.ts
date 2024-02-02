import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Observable } from 'rxjs';
import { svgTextWrap } from '../svg-text-wrap/svg-text-wrap';
import { VicSvgTextWrapConfig } from '../svg-text-wrap/svg-wrap.config';
import { GenericScale, XyChartComponent } from '../xy-chart/xy-chart.component';
import { VicAxisConfig } from './axis.config';

export type XyAxisScale = {
  useTransition: boolean;
  scale: GenericScale<any, any>;
};

/**
 * A base directive for all axes.
 */
@Directive()
export abstract class XyAxis implements OnInit {
  /**
   * The configuration for the axis.
   */
  @Input() config: VicAxisConfig;
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
  axisFunction: any;
  axis: any;
  scale: any;

  constructor(public chart: XyChartComponent, public destroyRef: DestroyRef) {}

  abstract getScale(): Observable<XyAxisScale>;
  abstract setAxisFunction(): any;
  abstract initNumTicks(): number;
  abstract setTranslate(): void;
  abstract setAxis(axisFunction: any): void;

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

  setTickFontSize(tickTextSelection: any): void {
    tickTextSelection.attr('font-size', this.config.tickLabelFontSize);
  }

  wrapAxisTickText(tickTextSelection: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { wrapWidth, ...properties } = this.config.wrap;
    const config = Object.assign(
      new VicSvgTextWrapConfig(),
      properties
    ) as VicSvgTextWrapConfig;
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
    config.width = width;
    tickTextSelection.call(svgTextWrap, config);
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

import { Directive, ElementRef, ViewChild } from '@angular/core';
import { select } from 'd3';
import { Observable } from 'rxjs';
import { GenericScale } from '../../core';
import { DataValue } from '../../core/types/values';
import { XyAuxMarks } from '../../marks';
import { SvgTextWrap } from '../../svg-text-wrap/svg-text-wrap';
import { XyAxisConfig } from './config/xy-axis-config';

export type XyAxisScale = {
  useTransition: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: GenericScale<any, any>;
};

/**
 * A base directive for all axes.
 */
@Directive()
export abstract class XyAxis<TickValue extends DataValue> extends XyAuxMarks<
  never,
  XyAxisConfig<TickValue>
> {
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisFunction: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axis: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: any;

  abstract getScale(): Observable<XyAxisScale>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setAxisFunction(): any;
  abstract setTranslate(): void;
  abstract setTicks(tickFormat: string | ((value: TickValue) => string)): void;
  abstract setScale(): void;
  abstract createLabel(): void;

  override initFromConfig(): void {
    this.drawMarks();
  }

  setAxisFromScaleAndConfig(): void {
    this.axis = this.axisFunction(this.scale);
    if (this.config.tickSizeOuter !== undefined) {
      this.axis.tickSizeOuter(this.config.tickSizeOuter);
    }
    if (this.config.tickFormat) {
      this.setTicks(this.config.tickFormat);
    }
  }

  drawMarks(): void {
    this.setAxisFunction();
    this.setTranslate();
    this.setScale();
    const transitionDuration = this.getTransitionDuration();
    this.setAxisFromScaleAndConfig();
    this.drawAxis(transitionDuration);
    this.postProcessAxisFeatures();
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
    const wrap = new SvgTextWrap({ ...properties, width });
    wrap.wrap(tickTextSelection);
  }

  postProcessAxisFeatures(): void {
    if (this.config.removeDomainLine) {
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
    if (this.config.label) {
      this.createLabel();
    }
  }
}

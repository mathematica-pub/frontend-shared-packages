import { Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { format, select, timeFormat, TimeInterval } from 'd3';
import { SvgUtilities } from '../shared/svg-utilities.class';
import { SvgWrapOptions } from '../shared/svg-utilities.model';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { AxisConfig, TickWrap } from './axis-config.model';

@Directive()
export abstract class XyAxisElement extends Unsubscribe implements OnInit {
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
  @Input() config: AxisConfig;
  axisFunction: any;
  axis: any;
  scale: any;

  abstract subscribeToScale(): void;
  abstract setAxisFunction(): any;
  abstract initNumTicks(): number;
  abstract setTranslate(): void;

  ngOnInit(): void {
    this.setTranslate();
    this.subscribeToScale();
    this.setAxisFunction();
  }

  updateAxis(): void {
    this.setAxis(this.axisFunction);
    this.drawAxis();
    this.processAxisFeatures();
  }

  setAxis(axisFunction: any): void {
    if (this.config.dimensionType === 'ordinal') {
      this.axis = axisFunction(this.scale).tickSizeOuter(
        this.config.tickSizeOuter
      );
    } else {
      let numTicks = this.config.numTicks || this.initNumTicks();
      this.axis = axisFunction(this.scale);
      if (this.config.tickValues) {
        this.axis.tickValues(this.config.tickValues).tickFormat((d) => {
          const formatter = d instanceof Date ? timeFormat : format;
          return formatter(this.config.tickFormat)(d);
        });
      } else {
        numTicks = this.getValidatedNumTicks();
        this.axis.ticks(numTicks, this.config.tickFormat);
      }
    }
  }

  getValidatedNumTicks(): number | TimeInterval {
    let numTicks = this.config.numTicks;
    if (!this.config.numTicks) {
      numTicks = this.initNumTicks();
    }
    if (typeof numTicks === 'number' && this.ticksAreIntegers()) {
      const [start, end] = this.scale.domain();
      if (numTicks > end - start) {
        numTicks = end - start;
      }
    }
    return numTicks;
  }

  ticksAreIntegers(): boolean {
    return this.config.tickFormat.includes('0f');
  }

  drawAxis(): void {
    select(this.axisRef.nativeElement).call(this.axis);

    if (this.config.tickLabelFontSize) {
      select(this.axisRef.nativeElement)
        .selectAll('.tick text')
        .attr('font-size', this.config.tickLabelFontSize);
    }

    if (this.config.wrap) {
      this.wrapAxisTickText(this.config.wrap);
    }
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

  wrapAxisTickText(options: TickWrap): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { wrapWidth, ...properties } = options;
    const config = Object.assign(
      new SvgWrapOptions(),
      properties
    ) as SvgWrapOptions;
    config.width =
      options.wrapWidth === 'bandwidth'
        ? this.scale.bandwidth()
        : options.wrapWidth;
    select(this.axisRef.nativeElement)
      .selectAll('.tick text')
      .call(SvgUtilities.textWrap, config);
  }
}

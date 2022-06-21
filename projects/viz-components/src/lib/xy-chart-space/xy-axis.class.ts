import { Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { format, select, timeFormat, TimeInterval } from 'd3';
import { ChartComponent } from '../chart/chart.component';
import { SvgUtilities } from '../shared/svg-utilities.class';
import { SvgWrapOptions } from '../shared/svg-utilities.model';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { AxisConfig } from './axis-config.model';
import { XyChartSpaceComponent } from './xy-chart-space.component';

@Directive()
export abstract class XyAxisElement extends Unsubscribe implements OnInit {
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
  @Input() config: AxisConfig;
  axisFunction: any;
  axis: any;
  scale: any;

  constructor(
    public chart: ChartComponent,
    public xySpace: XyChartSpaceComponent
  ) {
    super();
  }

  abstract subscribeToScale(): void;
  abstract setAxisFunction(): any;
  abstract initNumTicks(): number;
  abstract setTranslate(): void;

  ngOnInit(): void {
    this.setAxisFunction();
    this.setTranslate();
    this.subscribeToScale();
  }

  onScaleUpdate(prev: any, curr: any): void {
    if (curr) {
      let transitionDuration;
      if (prev) {
        const currRange = curr.range();
        const prevRange = prev.range();
        transitionDuration =
          currRange[0] === prevRange[0] && currRange[1] === prevRange[1]
            ? this.chart.transitionDuration
            : 0;
      } else {
        transitionDuration = 0;
      }
      this.scale = curr;
      this.updateAxis(transitionDuration);
    }
  }

  updateAxis(transitionDuration: number): void {
    this.setAxis(this.axisFunction);
    this.drawAxis(transitionDuration);
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
      new SvgWrapOptions(),
      properties
    ) as SvgWrapOptions;
    config.width =
      this.config.wrap.wrapWidth === 'bandwidth'
        ? this.scale.bandwidth()
        : this.config.wrap.wrapWidth;
    tickTextSelection.call(SvgUtilities.textWrap, config);
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

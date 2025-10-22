import { Directive, ElementRef, inject } from '@angular/core';
import { select, Selection } from 'd3';
import { GenericScale } from '../../core';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { XyAuxMarks } from '../../marks';
import { SvgTextWrap } from '../../svg-text-wrap/svg-text-wrap';
import { Ticks } from '../ticks/ticks';
import { XyAxisConfig } from './config/xy-axis-config';

export type XyAxisScale = {
  useTransition: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: GenericScale<any, any>;
};

type AxisSvgElements = 'gridGroup' | 'gridLine' | 'label' | 'axisGroup';

/**
 * A base directive for all axes.
 */
@Directive()
export abstract class XyAxis<
  Tick extends DataValue | ContinuousValue,
  TicksConfig extends Ticks<Tick>,
> extends XyAuxMarks<unknown, XyAxisConfig<Tick, TicksConfig>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axis: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisFunction: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axisGroup: Selection<SVGGElement, any, SVGGElement, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridGroup: Selection<SVGGElement, any, SVGGElement, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: any;
  elRef = inject<ElementRef<SVGGElement>>(ElementRef);
  // used to ensure that a zero axis does not transition in position from baseline on first draw
  isFirstDraw = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setAxisFunction(): any;
  abstract setTranslate(): void;
  abstract setTicks(tickFormat: string | ((value: Tick) => string)): void;
  abstract setScale(): void;
  abstract createLabel(): void;
  abstract getBaselineTranslate(): string | null;

  get class(): Record<AxisSvgElements, string> {
    return {
      gridGroup: 'vic-grid-group',
      gridLine: 'vic-grid-line',
      axisGroup: 'vic-axis-group',
      label: 'vic-axis-label',
    };
  }

  override initFromConfig(): void {
    this.drawMarks();
  }

  setAxisFromScaleAndConfig(): void {
    this.axis = this.axisFunction(this.scale);

    this.setTickSize();
    if (this.config.ticks.format) {
      this.setTicks(this.config.ticks.format);
    }
  }

  setTickSize(): void {
    if (this.config.ticks.size !== undefined) {
      this.axis.tickSize(this.config.ticks.size);
    } else {
      if (this.config.ticks.sizeInner !== undefined) {
        this.axis.tickSizeInner(this.config.ticks.sizeInner);
      }
      if (this.config.ticks.sizeOuter !== undefined) {
        this.axis.tickSizeOuter(this.config.ticks.sizeOuter);
      }
    }
    const baselineTranslate = this.getBaselineTranslate();
    if (baselineTranslate) {
      this.axis.tickSizeOuter(0);
    }
  }

  drawMarks(): void {
    this.setAxisFunction();
    this.setTranslate();
    this.setScale();
    this.setAxisFromScaleAndConfig();
    this.drawAxis();
    this.doNothing();
    this.isFirstDraw = false;
  }

  doNothing(): void {
    console.log('');
    // Intentionally empty
  }

  drawAxis(): void {
    if (!this.axisGroup) {
      this.axisGroup = select(this.elRef.nativeElement)
        .append('g')
        .attr('class', this.class.axisGroup);
    }

    // Avoid odd animations of ticks or domain lines when those things move between draws
    this.axisGroup.select('.domain').remove();
    this.axisGroup.selectAll('.tick').remove();

    this.axisGroup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .transition(this.getTransition(this.axisGroup))
      .call(this.axis)
      .on('end', () => {
        this.processTicks();
        this.processDomain();
        this.drawGrid();
      });

    this.processTickLabels();
    if (this.config.label) {
      this.createLabel();
    }
  }

  processTicks(): void {
    const tickText = select(this.elRef.nativeElement).selectAll('.tick text');
    if (this.config.ticks.class) {
      select(this.elRef.nativeElement)
        .selectAll<SVGGElement, Tick>('.tick')
        .each((d, i, nodes) => {
          const labelClass = this.config.ticks.class(d);
          if (labelClass) {
            select(nodes[i]).classed(labelClass, true);
          } else {
            ///remove any previous class
            select(nodes[i]).attr('class', 'tick');
          }
        });
    }
    if (this.config.ticks.fontSize) {
      this.setTickFontSize(tickText);
    }
    // TODO: Determine if this needs to be called from the on('end') of the axisGroup transition
    // or if if should be moved to processTickLabels. I think there is a reason it is here. (?)
    if (this.config.ticks.wrap && this.config.ticks.wrap.width !== undefined) {
      this.wrapAxisTickText(tickText);
    }
    if (this.config.ticks.marksDisplay === false) {
      const marks = select(this.elRef.nativeElement).selectAll('.tick line');
      marks.remove();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTickFontSize(tickTextSelection: any): void {
    tickTextSelection.attr('font-size', this.config.ticks.fontSize);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapAxisTickText(tickTextSelection: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { width, ...properties } = this.config.ticks.wrap;

    let wrapWidth: number;
    if (this.config.ticks.wrap.width === 'bandwidth') {
      wrapWidth = this.scale.bandwidth();
    } else if (typeof this.config.ticks.wrap.width === 'function') {
      const chartWidth = this.scale.range()[1] - this.scale.range()[0];
      const numOfTicks = select(this.elRef.nativeElement)
        .selectAll('.tick')
        .size();
      wrapWidth = this.config.ticks.wrap.width(chartWidth, numOfTicks);
    } else {
      wrapWidth = this.config.ticks.wrap.width;
    }
    const wrap = new SvgTextWrap({ ...properties, width: wrapWidth });
    wrap.wrap(tickTextSelection);
  }

  processDomain(): void {
    const zeroAxisTranslate = this.getBaselineTranslate();

    if (
      this.config.baseline.zeroBaseline.display &&
      zeroAxisTranslate !== null
    ) {
      this.axisGroup.call((g) =>
        g
          .select('.domain')
          .attr('transform', zeroAxisTranslate)
          .attr('class', 'domain baseline zero-axis-baseline')
          .attr('stroke-dasharray', this.config.baseline.zeroBaseline.dasharray)
      );
    }

    if (zeroAxisTranslate === null) {
      this.axisGroup.call((g) =>
        g
          .select('.domain')
          .attr('class', 'domain baseline')
          .attr('transform', null)
          .attr('stroke-dasharray', null)
      );
    }

    if (!this.config.baseline.display && zeroAxisTranslate === null) {
      this.axisGroup.call((g) => g.select('.domain').remove());
    }
  }

  processTickLabels(): void {
    if (this.config.ticks.labelsDisplay === false) {
      this.axisGroup.call((g) => g.selectAll('.tick text').remove());
    }

    if (this.config.ticks.rotate) {
      this.axisGroup.call((g) =>
        g
          .selectAll('.tick text')
          .style('transform', `rotate(-${this.config.ticks.rotate}deg)`)
          .attr('text-anchor', 'end')
          .attr('alignment-baseline', 'start')
      );
    }

    if (
      this.config.ticks.labelsStroke ||
      this.config.ticks.labelsStrokeOpacity ||
      this.config.ticks.labelsStrokeWidth
    ) {
      this.axisGroup.call((g) =>
        g
          .selectAll('.tick text')
          .attr('stroke', this.config.ticks.labelsStroke)
          .attr('stroke-opacity', this.config.ticks.labelsStrokeOpacity)
          .attr('stroke-width', this.config.ticks.labelsStrokeWidth)
      );
    }
  }

  otherAxisHasPosAndNegValues(dimension: 'x' | 'y'): boolean {
    const otherDimension = dimension === 'x' ? 'y' : 'x';
    const domain = this.scales[otherDimension].domain();
    if (domain.length > 2 || isNaN(domain[0]) || isNaN(domain[1])) {
      return false;
    }
    return domain[0] < 0 && domain[1] > 0;
  }

  drawGrid(): void {
    if (this.config.grid) {
      if (!this.gridGroup) {
        this.gridGroup = select(this.elRef.nativeElement)
          .append('g')
          .attr('class', this.class.gridGroup);
      }

      this.gridGroup
        .transition(this.getTransition(this.gridGroup))
        .call(this.axis.tickSizeInner(this.getGridLineLength()))
        .selectAll('.tick')
        .attr('class', `tick ${this.class.gridLine}`)
        .style('display', (_, i) =>
          this.config.grid.filter(i) ? null : 'none'
        )
        .select('line')
        .attr('stroke', this.config.grid.stroke.color)
        .attr('stroke-dasharray', this.config.grid.stroke.dasharray)
        .attr('stroke-width', this.config.grid.stroke.width)
        .attr('opacity', this.config.grid.stroke.opacity)
        .attr('stroke-linecap', this.config.grid.stroke.linecap)
        .attr('stroke-linejoin', this.config.grid.stroke.linejoin);

      this.gridGroup.call((g) => {
        g.selectAll('text').remove();
        g.selectAll('.domain').remove();
      });
    } else {
      select(this.elRef.nativeElement)
        .select(`.${this.class.gridGroup}`)
        .remove();

      this.gridGroup = undefined;
    }
  }

  getGridLineLength(): number {
    const gridLineScale =
      this.config.grid.axis === 'x' ? this.scales.y : this.scales.x;
    return -1 * Math.abs(gridLineScale.range()[1] - gridLineScale.range()[0]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTransition(selection: any): any {
    const transitionDuration = this.isFirstDraw
      ? 0
      : this.getTransitionDuration();
    return selection.transition().duration(transitionDuration);
  }
}

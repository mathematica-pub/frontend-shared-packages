import { Directive, ElementRef, inject } from '@angular/core';
import { select, Selection } from 'd3';
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

type AxisSvgElements = 'gridGroup' | 'gridLine' | 'label' | 'axisGroup';

/**
 * A base directive for all axes.
 */
@Directive()
export abstract class XyAxis<TickValue extends DataValue> extends XyAuxMarks<
  unknown,
  XyAxisConfig<TickValue>
> {
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

  abstract getScale(): Observable<XyAxisScale>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setAxisFunction(): any;
  abstract setTranslate(): void;
  abstract setTicks(tickFormat: string | ((value: TickValue) => string)): void;
  abstract setScale(): void;
  abstract createLabel(): void;
  abstract getDomainTranslate(): string | null;

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
    this.setAxisFromScaleAndConfig();
    this.drawAxis();
    this.drawGrid();
  }

  drawAxis(): void {
    if (!this.axisGroup) {
      this.axisGroup = select(this.elRef.nativeElement)
        .append('g')
        .attr('class', this.class.axisGroup);
    }

    this.axisGroup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .transition(this.getTransition(this.axisGroup))
      .call(this.axis)
      .on('end', () => {
        this.processTicks();
      });

    this.processDomain();
    this.processTickLabels();
    this.processTickMarks();
    if (this.config.label) {
      this.createLabel();
    }
  }

  processTicks(): void {
    const tickText = select(this.elRef.nativeElement).selectAll('.tick text');
    if (this.config.tickLabelFontSize) {
      this.setTickFontSize(tickText);
    }
    if (this.config.wrap) {
      this.wrapAxisTickText(tickText);
    }
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
      const numOfTicks = select(this.elRef.nativeElement)
        .selectAll('.tick')
        .size();
      width = this.config.wrap.wrapWidth(chartWidth, numOfTicks);
    } else {
      width = this.config.wrap.wrapWidth;
    }
    const wrap = new SvgTextWrap({ ...properties, width });
    wrap.wrap(tickTextSelection);
  }

  processDomain(): void {
    const zeroAxisTranslate = this.getDomainTranslate();

    if (this.config.zeroAxis.useZeroAxis && zeroAxisTranslate !== null) {
      this.axisGroup.call((g) =>
        g
          .select('.domain')
          .transition(this.getTransition(this.axisGroup))
          .attr('transform', zeroAxisTranslate)
          .attr('class', 'domain zero-axis-domain')
          .attr('stroke-dasharray', this.config.zeroAxis.strokeDasharray)
      );
    }

    if (zeroAxisTranslate === null) {
      this.axisGroup.call((g) => g.select('.domain').attr('class', 'domain'));
    }

    if (this.config.removeDomainLine && zeroAxisTranslate === null) {
      this.axisGroup.call((g) => g.select('.domain').remove());
    }
  }

  processTickLabels(): void {
    if (this.config.removeTickLabels) {
      this.axisGroup.call((g) => g.selectAll('.tick text').remove());
    }
  }

  processTickMarks(): void {
    if (this.config.removeTickMarks) {
      this.axisGroup.call((g) => g.selectAll('.tick line').remove());
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
    const transitionDuration = this.getTransitionDuration();
    return selection.transition().duration(transitionDuration);
  }
}

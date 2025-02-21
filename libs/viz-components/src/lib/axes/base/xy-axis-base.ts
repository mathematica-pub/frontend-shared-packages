import { Directive, ElementRef, inject, ViewChild } from '@angular/core';
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

type AxisSvgElements = 'grid' | 'label';

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
  scale: any;
  elRef = inject<ElementRef<SVGGElement>>(ElementRef);
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;

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
      grid: 'vic-grid',
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
    this.postProcessAxisFeatures();
  }

  drawAxis(): void {
    const axisGroup = select(this.axisRef.nativeElement);

    axisGroup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .transition(this.getTransition(axisGroup))
      .call(this.axis)
      .on('end', () => {
        this.styleTicks();
      });

    select(this.elRef.nativeElement).select(`.${this.class.grid}`).remove();

    if (this.config.grid) {
      this.drawGrid();
    }
  }

  getGridLineLength(): number {
    const gridLineScale =
      this.config.grid.axis === 'x' ? this.scales.y : this.scales.x;
    return -1 * Math.abs(gridLineScale.range()[1] - gridLineScale.range()[0]);
  }

  drawGrid(): void {
    const gridGroup = select(this.elRef.nativeElement)
      .append('g')
      .attr('class', this.class.grid);

    gridGroup
      .transition(this.getTransition(gridGroup))
      .call(this.axis.tickSizeInner(this.getGridLineLength()))
      .selectAll('.tick')
      .attr('class', `${this.class.grid}-line`)
      .style('display', (_, i) => (this.config.grid.filter(i) ? null : 'none'))
      .select('line')
      .attr('stroke', this.config.grid.stroke.color)
      .attr('stroke-dasharray', this.config.grid.stroke.dasharray)
      .attr('stroke-width', this.config.grid.stroke.width)
      .attr('opacity', this.config.grid.stroke.opacity)
      .attr('stroke-linecap', this.config.grid.stroke.linecap)
      .attr('stroke-linejoin', this.config.grid.stroke.linejoin);

    gridGroup.call((g) => {
      g.selectAll('text').remove();
      g.selectAll('.domain').remove();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTransition(selection: any): any {
    const transitionDuration = this.getTransitionDuration();
    return selection.transition().duration(transitionDuration);
  }

  styleTicks(): void {
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

  postProcessAxisFeatures(): void {
    const axisGroup = select(this.axisRef.nativeElement);
    const zeroAxisTranslate = this.getDomainTranslate();

    if (
      this.config.removeDomainLine !== 'always' &&
      zeroAxisTranslate !== null
    ) {
      axisGroup.call((g) =>
        g
          .select('.domain')
          .attr('transform', zeroAxisTranslate)
          .attr('class', 'domain zero-axis-domain')
          .attr(
            'stroke-dasharray',
            this.config.zeroAxisStroke === 'solid'
              ? null
              : this.config.zeroAxisStroke
          )
      );
    }

    if (zeroAxisTranslate === null) {
      axisGroup.call((g) => g.select('.domain').attr('class', 'domain'));
    }

    if (
      this.config.removeDomainLine === 'always' ||
      (this.config.removeDomainLine === 'unlessZeroAxis' &&
        zeroAxisTranslate === null)
    ) {
      axisGroup.call((g) => g.select('.domain').remove());
    }

    if (this.config.removeTickLabels) {
      axisGroup.call((g) => g.selectAll('.tick text').remove());
    }

    if (this.config.removeTickMarks) {
      axisGroup.call((g) => g.selectAll('.tick line').remove());
    }

    if (this.config.label) {
      this.createLabel();
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
}

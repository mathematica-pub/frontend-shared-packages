import { Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { select } from 'd3';
import { Observable, pairwise, takeUntil } from 'rxjs';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { svgTextWrap } from '../svg-text-wrap/svg-text-wrap';
import { SvgTextWrapConfig } from '../svg-text-wrap/svg-wrap.config';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { AxisConfig } from './axis.config';

/**
 * @internal
 */
@Directive()
export abstract class XyAxis extends Unsubscribe implements OnInit {
  @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
  @Input() config: AxisConfig;
  axisFunction: any;
  axis: any;
  scale: any;

  constructor(public chart: XyChartComponent) {
    super();
  }

  abstract setScale(): void;
  abstract setAxisFunction(): any;
  abstract initNumTicks(): number;
  abstract setTranslate(): void;
  abstract setAxis(axisFunction: any): void;

  ngOnInit(): void {
    this.setAxisFunction();
    this.setTranslate();
    this.setScale();
  }

  subscribeToScale(scale$: Observable<any>): void {
    scale$
      .pipe(takeUntil(this.unsubscribe), pairwise())
      .subscribe(([prev, curr]) => this.onScaleUpdate(prev, curr));
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
      new SvgTextWrapConfig(),
      properties
    ) as SvgTextWrapConfig;
    config.width =
      this.config.wrap.wrapWidth === 'bandwidth'
        ? this.scale.bandwidth()
        : this.config.wrap.wrapWidth;
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

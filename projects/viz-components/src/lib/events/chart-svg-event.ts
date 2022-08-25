import { AfterViewInit, Directive, inject, Renderer2 } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';

@Directive()
export abstract class ChartSvgEvent implements AfterViewInit {
  el: SVGSVGElement;
  protected renderer = inject(Renderer2);
  protected chart = inject(ChartComponent);

  abstract setListeners(): void;

  ngAfterViewInit(): void {
    this.el = this.chart.svgRef.nativeElement;
    this.setListeners();
  }
}

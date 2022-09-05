import {
  AfterViewInit,
  Directive,
  Inject,
  inject,
  Renderer2,
} from '@angular/core';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';

@Directive()
export abstract class ChartSvgEventDirective implements AfterViewInit {
  el: SVGSVGElement;
  protected renderer = inject(Renderer2);

  constructor(@Inject(DATA_MARKS) private dataMarks: DataMarks) {}

  abstract setListeners(): void;

  ngAfterViewInit(): void {
    this.setEl();
    this.setListeners();
  }

  setEl(): void {
    this.el = this.dataMarks.chart.svgRef.nativeElement;
  }
}

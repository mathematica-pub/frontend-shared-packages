import { Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { scaleLinear } from 'd3';
import { Orientation } from '../../core/types/layout';
import { NoBinsAttributeDataDimension } from '../../geographies/config/layers/attribute-data-layer/dimensions/no-bins/no-bins';
import { MapLegend } from '../map-legend-base';

/**
 * @internal
 */
@Component({
  selector: 'vic-continuous-legend',
  templateUrl: './continuous-legend.component.html',
  styleUrls: ['./continuous-legend.component.scss'],
})
export class ContinuousLegendComponent<Datum>
  extends MapLegend<Datum, NoBinsAttributeDataDimension<Datum>>
  implements OnChanges
{
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;

  override ngOnChanges(): void {
    super.ngOnChanges();
    this.drawLinearGradient();
  }

  getValuesFromScale(): number[] {
    return this.scale.domain();
  }

  getLeftOffset(): number {
    if (this.orientation === Orientation.horizontal) {
      return (this.largerValueSpace - this.startValueSpace) * -1;
    } else {
      return 0;
    }
  }

  drawLinearGradient(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const ctx = canvas.getContext('2d');
    if (this.orientation === Orientation.horizontal) {
      this.drawHorizontalGradient(canvas, ctx);
    } else {
      this.drawVerticalGradient(canvas, ctx);
    }
  }

  drawHorizontalGradient(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    canvas.height = 1;
    canvas.width = this.width - this.startValueSpace - this.endValueSpace - 2;
    const rectScale = scaleLinear<string>()
      .domain([0, canvas.width])
      .range(this.colors);
    for (let i = 0; i < canvas.width; ++i) {
      ctx.fillStyle = rectScale(i);
      ctx.fillRect(i, 0, 1, 1);
    }
  }

  drawVerticalGradient(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    canvas.height = this.height - 16;
    canvas.width = 1;
    const rectScale = scaleLinear<string>()
      .domain([0, canvas.height])
      .range(this.colors);
    for (let i = 0; i < canvas.height; ++i) {
      ctx.fillStyle = rectScale(i);
      ctx.fillRect(0, i, 1, 1);
    }
  }
}

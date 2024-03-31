import { Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { scaleLinear } from 'd3';
import { VicOrientation } from '../../core/types/layout';
import { VicNoBinsQuantitativeAttributeDataDimensionConfig } from '../../geographies/geographies.config';
import { MapLegendContent } from '../map-legend-content';

/**
 * @internal
 */
@Component({
  selector: 'vic-continuous-legend',
  templateUrl: './continuous-legend.component.html',
  styleUrls: ['./continuous-legend.component.scss'],
})
export class ContinuousLegendComponent<Datum>
  extends MapLegendContent<
    Datum,
    VicNoBinsQuantitativeAttributeDataDimensionConfig<Datum>
  >
  implements OnChanges
{
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;

  override ngOnChanges(): void {
    super.ngOnChanges();
    this.drawLinearGradient();
  }

  getValuesFromScale(): any[] {
    return this.scale.domain();
  }

  getLeftOffset(): number {
    if (this.orientation === VicOrientation.horizontal) {
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
    if (this.orientation === VicOrientation.horizontal) {
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
    const rectScale = scaleLinear([0, canvas.width], this.colors);
    for (let i = 0; i < canvas.width; ++i) {
      ctx.fillStyle = this.scale(rectScale(i));
      ctx.fillRect(i, 0, 1, 1);
    }
  }

  drawVerticalGradient(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    canvas.height = this.height - 16;
    canvas.width = 1;
    const rectScale = scaleLinear([0, canvas.height], this.colors);
    for (let i = 0; i < canvas.height; ++i) {
      ctx.fillStyle = this.scale(rectScale(i));
      ctx.fillRect(0, i, 1, 1);
    }
  }
}

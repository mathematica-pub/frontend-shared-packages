import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { VicOrientation } from '../core/types/orientation';
import { VicSide } from '../core/types/side';
import { MapChartComponent } from '../map-chart/map-chart.component';

export enum VicLegendType {
  categorical = 'categorical',
  ordinal = 'ordinal',
  quantitative = 'quantitative',
}

@Component({
  selector: 'vic-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent<T> implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() valuesSide: keyof typeof VicSide;
  @Input() outlineColor: string;
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;
  legendType: keyof typeof VicLegendType;
  orientation: keyof typeof VicOrientation;
  chart = inject(MapChartComponent<T>);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setOrientation();
    this.setValuesSide();
  }

  setOrientation(): void {
    this.orientation =
      this.width > this.height
        ? VicOrientation.horizontal
        : VicOrientation.vertical;
  }

  setValuesSide(): void {
    if (this.orientation === VicOrientation.horizontal) {
      if (
        this.valuesSide === VicSide.left ||
        this.valuesSide === VicSide.right
      ) {
        this.valuesSide = undefined;
        console.warn(
          "valuesSide must be set to 'top' or 'bottom' for a map-legend with a horizontal aspect ratio"
        );
      }
      if (!this.valuesSide) {
        this.valuesSide = VicSide.bottom;
      }
    } else {
      if (
        this.valuesSide === VicSide.top ||
        this.valuesSide === VicSide.bottom
      ) {
        this.valuesSide = undefined;
        console.warn(
          "valuesSide must be set to 'left' or 'right' for a map-legend with a vertical aspect ratio"
        );
      }
      if (!this.valuesSide) {
        this.valuesSide = VicSide.left;
      }
    }
  }
}

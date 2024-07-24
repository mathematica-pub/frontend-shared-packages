import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Orientation, Side } from '../core/types/layout';
import { BinStrategy } from '../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-enums';
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
export class MapLegendComponent<Datum> implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() valuesSide: keyof typeof Side;
  @Input() outlineColor: string;
  @ViewChild('canvas', { static: true })
  VicValuesBin: typeof BinStrategy;
  canvasRef: ElementRef<HTMLCanvasElement>;
  legendType: keyof typeof VicLegendType;
  orientation: keyof typeof Orientation;
  chart = inject(MapChartComponent<Datum>);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.VicValuesBin = BinStrategy; // for some reason this doesn't get assigned if it's assigned in the class properties above
    this.setOrientation();
    this.setValuesSide();
  }

  setOrientation(): void {
    this.orientation =
      this.width > this.height ? Orientation.horizontal : Orientation.vertical;
  }

  setValuesSide(): void {
    if (this.orientation === Orientation.horizontal) {
      if (this.valuesSide === Side.left || this.valuesSide === Side.right) {
        this.valuesSide = undefined;
        console.warn(
          "valuesSide must be set to 'top' or 'bottom' for a map-legend with a horizontal aspect ratio"
        );
      }
      if (!this.valuesSide) {
        this.valuesSide = Side.bottom;
      }
    } else {
      if (this.valuesSide === Side.top || this.valuesSide === Side.bottom) {
        this.valuesSide = undefined;
        console.warn(
          "valuesSide must be set to 'left' or 'right' for a map-legend with a vertical aspect ratio"
        );
      }
      if (!this.valuesSide) {
        this.valuesSide = Side.left;
      }
    }
  }
}

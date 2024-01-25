import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MapChartComponent } from '../map-chart/map-chart.component';

@Component({
  selector: 'vic-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() valuesSide: 'left' | 'right' | 'top' | 'bottom';
  @Input() outlineColor: string;
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;
  legendType: 'categorical' | 'ordinal' | 'continuous';
  orientation: 'horizontal' | 'vertical';
  destroyRef = inject(DestroyRef);

  constructor(public chart: MapChartComponent) {}

  ngOnInit(): void {
    this.setOrientation();
    this.setValuesSide();
  }

  setOrientation(): void {
    this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
  }

  setValuesSide(): void {
    if (this.orientation === 'horizontal') {
      if (this.valuesSide === 'left' || this.valuesSide === 'right') {
        this.valuesSide = undefined;
        console.warn(
          "valuesSide must be set to 'top' or 'bottom' for a map-legend with a horizontal aspect ratio"
        );
      }
      if (!this.valuesSide) {
        this.valuesSide = 'bottom';
      }
    } else {
      if (this.valuesSide === 'top' || this.valuesSide === 'bottom') {
        this.valuesSide = undefined;
        console.warn(
          "valuesSide must be set to 'left' or 'right' for a map-legend with a vertical aspect ratio"
        );
      }
      if (!this.valuesSide) {
        this.valuesSide = 'left';
      }
    }
  }
}

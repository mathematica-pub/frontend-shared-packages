import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { MapChartComponent } from '../map-chart/map-chart.component';

@Component({
  selector: 'vic-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent<T> implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() valuesSide: 'left' | 'right' | 'top' | 'bottom';
  @Input() outlineColor: string;
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;
  legendType: 'categorical' | 'ordinal' | 'continuous';
  orientation: 'horizontal' | 'vertical';
  attributeDataConfig: VicAttributeDataDimensionConfig<T>;
  attributeDataScale: any;
  private chart = inject(MapChartComponent<T>);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.subscribeToAttributeScaleAndConfig();
    this.setOrientation();
    this.setValuesSide();
  }

  subscribeToAttributeScaleAndConfig(): void {
    combineLatest([
      this.chart.attributeDataScale$,
      this.chart.attributeDataConfig$,
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(([scale, config]) => !!scale && !!config)
      )
      .subscribe(([scale, config]) => {
        this.attributeDataConfig = config;
        this.attributeDataScale = scale;
        this.setLegendType();
      });
  }

  setLegendType(): void {
    if (this.attributeDataConfig.valueType === 'categorical') {
      this.legendType = 'categorical';
    } else if (this.attributeDataConfig.binType === 'none') {
      this.legendType = 'continuous';
    } else {
      this.legendType = 'ordinal';
    }
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

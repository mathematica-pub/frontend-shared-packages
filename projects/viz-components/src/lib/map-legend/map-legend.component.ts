import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest, filter, takeUntil } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { Unsubscribe } from '../shared/unsubscribe.class';

@Component({
  selector: 'vic-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent extends Unsubscribe implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() valuesSide: 'left' | 'right' | 'top' | 'bottom';
  @Input() outlineColor: string;
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;
  legendType: 'categorical' | 'ordinal' | 'continuous';
  orientation: 'horizontal' | 'vertical';
  attributeDataConfig: VicAttributeDataDimensionConfig;
  attributeDataScale: any;

  constructor(private chart: MapChartComponent) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToAttributeScaleAndConfig();
    this.setOrientation();
    this.setValuesSide();
  }

  subscribeToAttributeScaleAndConfig(): void {
    combineLatest(
      this.chart.attributeDataScale$,
      this.chart.attributeDataConfig$
    )
      .pipe(
        takeUntil(this.unsubscribe),
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

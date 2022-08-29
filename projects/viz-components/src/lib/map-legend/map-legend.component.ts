import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AttributeDataDimensionConfig } from '../geographies/geographies.config';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapContent } from '../map-chart/map-content';

@Component({
  selector: 'vzc-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent extends MapContent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() valuesSide: 'left' | 'right' | 'top' | 'bottom';
  @Input() outlineColor: string;
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;
  legendType: 'categorical' | 'ordinal' | 'continuous';
  orientation: 'horizontal' | 'vertical';

  constructor(chart: MapChartComponent) {
    super(chart);
  }

  ngOnInit(): void {
    this.setOrientation();
    this.setValuesSide();
    this.subscribeToScalesAndConfig();
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

  setScaleAndConfig(scale: any, config: AttributeDataDimensionConfig): void {
    if (scale && config) {
      this.attributeDataScale = scale;
      this.attributeDataConfig = config;
      if (scale && config) {
        this.setLegendType();
      }
    }
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
}

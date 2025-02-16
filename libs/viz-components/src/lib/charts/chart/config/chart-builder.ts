import { Injectable } from '@angular/core';
import { ElementSpacing } from '../../../core/types/layout';
import { ChartScaling } from '../chart.component';
import { ChartConfig } from './chart-config';

const DEFAULT = {
  height: 600,
  margin: { top: 36, right: 36, bottom: 36, left: 36 },
  scaleChartWithContainerWidth: { width: true, height: true },
  transitionDuration: 250,
  width: 800,
};

@Injectable()
export class VicChartConfigBuilder {
  private _height: number;
  private _margin: ElementSpacing;
  private _scaleChartWithContainerWidth: ChartScaling;
  private _transitionDuration: number;
  private _width: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. If chart size is dynamic, sets the maximum height of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing.
   *
   * If chart size is static, the fixed height of the chart.
   *
   * @default 600
   */
  height(height: number): this {
    this._height = height;
    return this;
  }

  /**
   * OPTIONAL. The margin that will be established between the edges of the svg and the svg's contents, in px.
   *
   * @default { top: 36, right: 36, bottom: 36, left: 36 }
   */
  margin(margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }): this {
    this._margin = margin;
    return this;
  }

  /**
   * OPTIONAL. Determines whether the chart size is fixed or will resize as the container width changes sizes.
   *
   * Width and height properties can be set separately. If both are true, the aspect ratio determined by width and height values will be maintained.
   *
   * Note that the chart does not respond to changes in container height.
   *
   * @default { width: true, height: true }
   */
  resize(resize: Partial<{ width: boolean; height: boolean }>): this {
    this._scaleChartWithContainerWidth = {
      width: resize.width || this._scaleChartWithContainerWidth.width,
      height: resize.height || this._scaleChartWithContainerWidth.height,
    };
    return this;
  }

  /**
   * OPTIONAL. A time duration for all transitions in the chart, in ms.
   *
   * @default 250
   */
  transitionDuration(transitionDuration: number): this {
    this._transitionDuration = transitionDuration;
    return this;
  }

  /**
   * If chart size is dynamic, the maximum width of the chart.
   *
   * In that case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing
   *
   * If chart size is static, the fixed width of the chart.
   */
  width(width: number): this {
    this._width = width;
    return this;
  }

  getConfig(): ChartConfig {
    return new ChartConfig({
      aspectRatio: this._width / this._height,
      height: this._height,
      margin: this._margin,
      scaleChartWithContainerWidth: this._scaleChartWithContainerWidth,
      transitionDuration: this._transitionDuration,
      width: this._width,
    });
  }
}

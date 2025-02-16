import { Injectable } from '@angular/core';
import { ElementSpacing } from '../../../core/types/layout';
import { ChartResizing } from '../chart.component';
import { ChartConfig } from './chart-config';

const DEFAULT = {
  _height: 600,
  _margin: { top: 36, right: 36, bottom: 36, left: 36 },
  _resize: { width: true, height: true, useViewbox: true },
  _transitionDuration: 250,
  _width: 800,
};

@Injectable()
export class VicChartConfigBuilder {
  private _height: number;
  private _margin: ElementSpacing;
  private _resize: ChartResizing;
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
   * OPTIONAL. Determines whether the chart size is fixed or will resize as the container width changes sizes, and how this resizing will be done.
   *
   * If `useViewbox` is true, the chart will resize via the viewbox attribute, scalling all contents of the chart at once. (For example, as the chart grows smaller, svg text in the chart will also grow proportionally smaller.) This is a more performant way to resize the chart.
   *
   * If `useViewbox` is false, the chart will resize by changing the width and height attributes of the svg element, recalculating scales and re-rendering the chart. This is a less performant way to resize the chart but may be necessary in some cases, particularly when the chart contains elements like text that should not be resized.
   *
   * If `useViewbox` is false, Width and height can be used to determine which dimensionss will resize when the chart's container changes width. If both are true, the chart will resize in both dimensions. If only one is true, the chart will resize in that dimension only.
   *
   * Note that the chart does not respond to changes in container height.
   *
   * @default { width: true, height: true; useViewbox: true }
   */
  resize(
    resize: Partial<{ width: boolean; height: boolean; useViewbox: boolean }>
  ): this {
    this._resize = {
      width: resize.width || this._resize.width,
      height: resize.height || this._resize.height,
      useViewbox: resize.useViewbox || this._resize.useViewbox,
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
      resize: this._resize,
      transitionDuration: this._transitionDuration,
      width: this._width,
    });
  }
}

import { Injectable } from '@angular/core';
import { ElementSpacing } from '../../../core/types/layout';
import { ChartResizing } from '../chart.component';
import { ChartConfig } from './chart-config';

const SCALES_DEFAULT = {
  height: 600,
  width: 800,
};

// use smaller values for viewbox so that the labels don't get so small
// downside to this is that this is the max chart size, even when in a flex container
const VIEWBOX_DEFAULT = {
  height: 450,
  width: 600,
};

const DEFAULT = {
  _height: 600,
  _margin: { top: 36, right: 36, bottom: 36, left: 36 },
  _resize: { width: true, height: true, useViewbox: false },
  _transitionDuration: 250,
  _width: 800,
};

/**
 * Builds a configuration object for a ChartComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicChartConfigBuilder]` in the component decorator)
 *
 */
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
   * OPTIONAL. If chart size is dynamic, determines the maximum height of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is not dynamic, sets the fixed height of the chart.
   *
   * @param value - The maximum height of the chart, in px. If chart size is static, the fixed height of the chart. If not called or called with `null`, a default value of 600 will be used.
   */
  height(value: number | null): this {
    if (value === null) {
      value = undefined;
      return this;
    }
    this._height = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the margin that will be established between the edges of the svg and the svg's contents, in px.
   *
   * @param value - The margin that will be established between the edges of the svg and the svg's contents, in px. If called with null, a default value of `{ top: 36, right: 36, bottom: 36, left: 36 }` will be used.
   */
  margin(
    value: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    } | null
  ): this {
    if (value === null) {
      value = DEFAULT._margin;
      return this;
    }
    this._margin = value;
    return this;
  }

  /**
   * OPTIONAL. Determines whether the chart size is fixed or will resize as the container width changes sizes, and how this resizing will be done.
   *
   * @param value - An object with up to three properties: `width`, `height`, and `useViewbox`. Can also be called with null to reset the resize configuration to its default value, which is `{ width: true, height: true, useViewbox: false }`.
   *
   * If `useViewbox` is true, the chart will resize via the viewbox attribute, scaling all contents of the chart at once. (For example, as the chart grows smaller, svg text in the chart will also grow proportionally smaller.) This is a more performant way to resize the chart.
   *
   * If `useViewbox` is false, the chart will resize by changing the width and height attributes of the svg element, recalculating scales and re-rendering the chart. This is a less performant way to resize the chart but may be necessary in some cases, particularly when the chart contains elements like text that should not be resized.
   *
   * If `useViewbox` is false, width and height can be used to determine which dimensions will resize when the chart's container changes width. If both are true, the chart will resize in both dimensions. If only one is true, the chart will resize in that dimension only.
   *
   * Note that the chart does not respond to changes in container height.
   */
  resize(
    value: Partial<{
      width: boolean;
      height: boolean;
      useViewbox: boolean;
    }> | null
  ): this {
    if (value === null) {
      value = DEFAULT._resize;
      return this;
    }
    this._resize = {
      ...this._resize,
      ...value,
    };
    return this;
  }

  /**
   * OPTIONAL. A time duration for all transitions in the chart, in ms.
   *
   * @@param value - The time duration for all transitions in the chart, in ms. If not called or called with null, a default value of 250 will be used.
   */
  transitionDuration(value: number | null): this {
    if (value === null) {
      value = DEFAULT._transitionDuration;
      return this;
    }
    this._transitionDuration = value;
    return this;
  }

  /**
   * OPTIONAL. If chart size is dynamic, sets the maximum width of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is not dynamic, sets the fixed width of the chart.
   *
   * @param value - The maximum width of the chart, in px. If chart size is static, the fixed width of the chart. If not called or called with `null`, a default value of 800 will be used.
   */
  width(value: number | null): this {
    if (value === null) {
      value = undefined;
      return this;
    }
    this._width = value;
    return this;
  }

  getConfig(): ChartConfig {
    this.validateBuilder();
    return new ChartConfig({
      aspectRatio: this._width / this._height,
      height: this._height,
      margin: this._margin,
      resize: this._resize,
      transitionDuration: this._transitionDuration,
      width: this._width,
    });
  }

  private validateBuilder(): void {
    if (this._height === undefined) {
      this._height = this._resize.useViewbox
        ? VIEWBOX_DEFAULT.height
        : SCALES_DEFAULT.height;
    }
    if (this._width === undefined) {
      this._width = this._resize.useViewbox
        ? VIEWBOX_DEFAULT.width
        : SCALES_DEFAULT.width;
    }
  }
}

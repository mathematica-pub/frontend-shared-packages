import { Injectable } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { ElementSpacing } from '../../../core/types/layout';
import { ChartConfig } from './chart-config';

export type ScalingStrategy = 'fixed' | 'responsive-width' | 'viewbox';

const SCALES_DEFAULT_WIDTH = 800;

// use smaller values for viewbox so that the labels don't get so small
// downside to this is that this is the max chart size, even when in a flex container
const VIEWBOX_DEFAULT_WIDTH = 800;
const MIN_WIDTH = 320;

const DEFAULT = {
  _aspectRatio: 16 / 9,
  _fixedHeight: false,
  _margin: { top: 36, right: 36, bottom: 36, left: 36 },
  _scalingStrategy: 'responsive-width' as ScalingStrategy,
  _transitionDuration: 250,
};

/**
 * Builds a configuration object for a ChartComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicChartConfigBuilder]` in the component decorator)
 *
 */
@Injectable()
export class VicChartConfigBuilder {
  private _aspectRatio?: number;
  private _fixedHeight: boolean;
  private _height: number;
  private _margin: ElementSpacing;
  private _minWidth: number;
  private _scalingStrategy: ScalingStrategy;
  private _transitionDuration: number;
  private _width: number;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Explicitly sets the aspect ratio to use when scalingStrategy is 'responsive-width' and fixedHeight is false, or when scalingStrategy is 'viewbox'.
   *
   * @param value - The aspect ratio (width / height) to use. If not called or called with null, a default value of 16/9 will be used. If maxWidth and maxHeight are set, aspect ratio will be derived from those values.
   */
  aspectRatio(value: number): this {
    this._aspectRatio = value;
    return this;
  }

  /**
   * OPTIONAL. If set to true and used with 'responsive-width' scaling strategy, height will be fixed and not derived from aspect ratio.
   *
   * Has no effect if scaling strategy is 'fixed' or 'viewbox'.
   */
  fixedHeight(value: boolean): this {
    this._fixedHeight = value;
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
   * OPTIONAL. If scaling strategy is 'responsive-width' or 'viewbox', determines the maximum height of the chart. This will override any provided aspect ratio.
   *
   * If scaling strategy is 'fixed', sets the fixed height of the chart.
   *
   * @param value - The maximum height of the chart, in px. If chart size is static, the fixed height of the chart. If not called or called with `null`, chart height will be set via aspect ratio.
   */
  maxHeight(value: number | null): this {
    this._height = value;
    return this;
  }

  /**
   * OPTIONAL. If scaling strategy is responsive-width or viewbox, sets the maximum width of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing.
   *
   * If scaling strategy is fixed, sets the fixed width of the chart.
   *
   * @param value - The maximum width of the chart, in px. If chart size is static, the fixed width of the chart.
   *
   * If not called or called with `null`, a default value of 800 will be used.
   */
  maxWidth(value: number | null): this {
    this._width = value;
    return this;
  }

  /**
   * OPTIONAL. If scaling strategy is responsive-width or viewbox, sets the minimum width of the chart. Has no effect if scaling strategy is fixed.
   *
   * @param value - The minimum width of the chart, in px. If not called or called with `null`, a default value of 320 will be used.
   */
  minWidth(value: number | null): this {
    this._minWidth = value;
    return this;
  }

  /**
   * OPTIONAL. Determines how the chart scales in response to container or window size changes.
   *
   * Default value, if not called, is 'responsive-width'.
   *
   * @param value - One of:
   * - 'fixed': Chart dimensions remain constant. Width and height are fixed. Dimensions can be set with maxWidth and maxHeight.
   * - 'responsive-width': Chart width responds to container; height is derived via aspect ratio, unless fixedHeight is true.
   * - 'viewbox': Chart is scaled entirely via SVG viewBox. All resizing behavior is controlled through CSS.
   */
  scalingStrategy(value: ScalingStrategy): this {
    this._scalingStrategy = value;
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

  getConfig(): ChartConfig {
    this.validateBuilder();

    return new ChartConfig({
      aspectRatio: this._aspectRatio,
      height: this._height,
      isFixedHeight: this._fixedHeight,
      margin: this._margin,
      minWidth: this._minWidth,
      scalingStrategy: this._scalingStrategy,
      transitionDuration: this._transitionDuration,
      width: this._width,
      viewBoxX: VIEWBOX_DEFAULT_WIDTH,
      viewBoxY:
        VIEWBOX_DEFAULT_WIDTH / (this._aspectRatio ?? DEFAULT._aspectRatio),
    });
  }

  private validateBuilder(): void {
    if (this._width === undefined || this._width === null) {
      this._width =
        this._scalingStrategy === 'viewbox' ? null : SCALES_DEFAULT_WIDTH;
    }
    if (this._height === undefined || this._height === null) {
      this._height =
        this._scalingStrategy === 'viewbox'
          ? null
          : this._width / this._aspectRatio;
    }
    if (this._minWidth === undefined || this._minWidth === null) {
      this._minWidth = this._scalingStrategy === 'viewbox' ? null : MIN_WIDTH;
    }
    if (this._scalingStrategy !== 'viewbox' && this._minWidth > this._width) {
      const [oldMin, oldWidth] = [this._minWidth, this._width];
      this._minWidth = oldWidth;
      this._width = oldMin;
      console.warn(
        `[vic-chart] The configured minWidth (${oldMin}px) cannot be larger than the configured width (${oldWidth}px). The values have been swapped.`
      );
    }
    if (this._scalingStrategy === 'responsive-width' && !this._fixedHeight) {
      this._aspectRatio = this._width / this._height;
    }
  }
}

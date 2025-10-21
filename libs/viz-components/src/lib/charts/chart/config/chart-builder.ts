import { Injectable } from '@angular/core';
import { safeAssign } from '@mathstack/app-kit';
import { ElementSpacing } from '../../../core/types/layout';
import { ChartConfig } from './chart-config';

export type ScalingStrategy = 'fixed' | 'responsive-width' | 'viewbox';

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
  _fixedHeight: false,
  _height: 600,
  _margin: { top: 36, right: 36, bottom: 36, left: 36 },
  _scalingStrategy: 'responsive-width' as ScalingStrategy,
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
  private _aspectRatio?: number;
  private _fixedHeight: boolean;
  private _height: number;
  private _margin: ElementSpacing;
  private _scalingStrategy: ScalingStrategy;
  private _transitionDuration: number;
  private _width: number;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Explicitly sets the aspect ratio to use when scalingStrategy is 'responsive-width' and fixedHeight is false.
   */
  aspectRatio(value: number): this {
    this._aspectRatio = value;
    return this;
  }

  /**
   * OPTIONAL. If set to true and used with 'responsive-width' strategy, height will be fixed and not derived from aspect ratio.
   */
  fixedHeight(value: boolean): this {
    this._fixedHeight = value;
    return this;
  }

  /**
   * @deprecated Use .maxHeight(...) instead.
   */
  height(value: number | null): this {
    console.warn(
      '[vic-chart] .height(...) is deprecated. Use .maxHeight(...) instead.'
    );
    return this.maxHeight(value);
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
   * OPTIONAL. If chart size is dynamic, determines the maximum height of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is not dynamic, sets the fixed height of the chart.
   *
   * @param value - The maximum height of the chart, in px. If chart size is static, the fixed height of the chart. If not called or called with `null`, a default value of 600 will be used.
   */
  maxHeight(value: number | null): this {
    if (value === null) {
      value = undefined;
      return this;
    }
    this._height = value;
    return this;
  }

  /**
   * OPTIONAL. If chart size is dynamic, sets the maximum width of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is not dynamic, sets the fixed width of the chart.
   *
   * @param value - The maximum width of the chart, in px. If chart size is static, the fixed width of the chart. If not called or called with `null`, a default value of 800 will be used.
   */
  maxWidth(value: number | null): this {
    if (value === null) {
      value = undefined;
      return this;
    }
    this._width = value;
    return this;
  }

  /**
   * @deprecated Use .scalingStrategy(...) and .fixedHeight(...) instead.
   */
  resize(
    value: Partial<{
      width: boolean;
      height: boolean;
      useViewbox: boolean;
    }> | null
  ): this {
    console.warn(
      '[vic-chart] .resize(...) is deprecated. Use .scalingStrategy(...) and .fixedHeight(...) instead.'
    );
    if (value === null) {
      this._scalingStrategy = DEFAULT._scalingStrategy;
      return this;
    }
    if (value.useViewbox) {
      this._scalingStrategy = 'viewbox';
    } else {
      if (!value.width && !value.height) {
        this._scalingStrategy = 'fixed';
      } else {
        this._scalingStrategy = 'responsive-width';

        if (value.height) {
          this._fixedHeight = true;
        }
      }
    }
    return this;
  }
  /**
   * OPTIONAL. Determines how the chart scales in response to container or window size changes.
   *
   * Default value, if not called, is 'responsive-width'.
   *
   * @param value - One of:
   * - 'fixed': Chart dimensions remain constant. Width and height are fixed.
   * - 'responsive-width': Chart width responds to container; height is derived via aspect ratio.
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

  /**
   * @deprecated Use .maxWidth(...) instead.
   */
  width(value: number | null): this {
    console.warn(
      '[vic-chart] .width(...) is deprecated. Use .maxWidth(...) instead.'
    );
    return this.maxWidth(value);
  }

  getConfig(): ChartConfig {
    this.validateBuilder();

    const aspectRatio =
      this._scalingStrategy === 'responsive-width' && !this._fixedHeight
        ? (this._aspectRatio ?? this._width / this._height)
        : undefined;

    return new ChartConfig({
      aspectRatio,
      height: this._height,
      margin: this._margin,
      scalingStrategy: this._scalingStrategy,
      transitionDuration: this._transitionDuration,
      width: this._width,
    });
  }

  private validateBuilder(): void {
    if (this._height === undefined) {
      this._height =
        this._scalingStrategy === 'viewbox'
          ? VIEWBOX_DEFAULT.height
          : SCALES_DEFAULT.height;
    }
    if (this._width === undefined) {
      this._width =
        this._scalingStrategy === 'viewbox'
          ? VIEWBOX_DEFAULT.width
          : SCALES_DEFAULT.width;
    }
  }
}

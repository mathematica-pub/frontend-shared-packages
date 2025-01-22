import { Injectable } from '@angular/core';
import { schemeTableau10 } from 'd3';
import { DataValue } from '../../core';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position-builder';
import { NumberVisualValueDimensionBuilder } from '../../data-dimensions/continuous-quantitative/number-visual-value/number-visual-value-builder';
import { OrdinalChartPositionDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position-builder';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { StrokeBuilder } from '../../stroke/stroke-builder';
import { DotsConfig } from './dots-config';

const DEFAULT = {
  _pointerDetectionRadius: 12,
  _fill: 'none',
  _opacity: 1,
  _radius: 2,
};

@Injectable()
export class VicDotsConfigBuilder<
  Datum,
  XOrdinalDomain extends DataValue = string,
  YOrdinalDomain extends DataValue = string,
> extends PrimaryMarksBuilder<Datum> {
  private _key: (datum: Datum) => string;
  private _opacity: number;
  private _pointerDetectionRadius: number;
  private fillBuilderCategorical: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  private fillBuilderNumber: NumberVisualValueDimensionBuilder<Datum, string>;
  private fillBuilderConst: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  private radiusBuilderCategorical: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    number
  >;
  private radiusBuilderNumber: NumberVisualValueDimensionBuilder<Datum, number>;
  private radiusBuilderConst: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    number
  >;
  private strokeBuilder: StrokeBuilder;
  private xBuilderNumeric: NumberChartPositionDimensionBuilder<Datum>;
  private xBuilderDate: DateChartPositionDimensionBuilder<Datum>;
  private xBuilderOrdinal: OrdinalChartPositionDimensionBuilder<
    Datum,
    XOrdinalDomain
  >;
  private yBuilderNumeric: NumberChartPositionDimensionBuilder<Datum>;
  private yBuilderDate: DateChartPositionDimensionBuilder<Datum>;
  private yBuilderOrdinal: OrdinalChartPositionDimensionBuilder<
    Datum,
    YOrdinalDomain
  >;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The distance from a line in which a hover event will trigger a tooltip, in px.
   *
   * This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines.
   *
   * @default 12
   */
  pointerDetectionRadius(pointerDetectionRadius: number): this {
    this._pointerDetectionRadius = pointerDetectionRadius;
    return this;
  }

  /**
   * OPTIONAL. Sets the opacity of the dots.
   *
   * @default 1
   */
  opacity(opacity: number): this {
    this._opacity = opacity;
    return this;
  }

  /**
   * OPTIONAL. Sets the appearance of the fill for the dots using a color string.
   *
   * If a string is passed, it will be used as the color for all dots.
   *
   * @default 'schemeTableau10[0]'
   */
  fill(fill: null): this;
  fill(fill: string): this;
  fill(fill: string | null): this {
    if (fill === null) {
      this.fillBuilderConst = undefined;
      return this;
    }
    this.fillBuilderConst = new OrdinalVisualValueDimensionBuilder();
    this.fillBuilderConst.valueAccessor(() => '').range([fill]);
    return this;
  }

  /**
   * OPTIONAL. Sets the appearance of the fill for the dots using a categorical dimension.
   *
   */
  fillCategorical(fill: null): this;
  fillCategorical(
    fill: (
      fill: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this;
  fillCategorical(
    fill:
      | ((
          fill: OrdinalVisualValueDimensionBuilder<Datum, string, string>
        ) => void)
      | null
  ): this {
    if (fill === null) {
      this.fillBuilderCategorical = undefined;
      return this;
    }
    this.fillBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
    fill(this.fillBuilderCategorical);
    return this;
  }

  fillNumeric(fill: null): this;
  fillNumeric(
    fill: (fill: NumberVisualValueDimensionBuilder<Datum, string>) => void
  ): this;
  fillNumeric(
    fill:
      | ((fill: NumberVisualValueDimensionBuilder<Datum, string>) => void)
      | null
  ): this {
    if (fill === null) {
      this.fillBuilderNumber = undefined;
      return this;
    }
    this.initFillBuilderNumber();
    fill(this.fillBuilderNumber);
    return this;
  }

  private initFillBuilderNumber(): void {
    this.fillBuilderNumber = new NumberVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. Sets a key that will be set as a `key` attribute on the SVGGElement that is the parent for each SVGCircleElement.
   *
   * Can be used to differentiate between dots.
   *
   * No key wil be set if this method is not called.
   */
  key(key: null): this;
  key(key: (datum: Datum) => string): this;
  key(key: (datum: Datum) => string): this {
    if (key === null) {
      this._key = undefined;
      return this;
    }
    this._key = key;
    return this;
  }

  /**
   * OPTIONAL. The size of the radius of the dots
   *
   * This is temporarily a constant.
   *
   * @default 2
   */
  radius(radius: null): this;
  radius(radius: number): this;
  radius(radius: number | null): this {
    if (radius === null) {
      this.radiusBuilderConst = undefined;
      return this;
    }
    this.radiusBuilderConst = new OrdinalVisualValueDimensionBuilder();
    this.radiusBuilderConst.range([radius]);
    return this;
  }

  radiusCategorical(radius: null): this;
  radiusCategorical(
    radius: (
      radius: OrdinalVisualValueDimensionBuilder<Datum, string, number>
    ) => void
  ): this;
  radiusCategorical(
    radius:
      | ((
          radius: OrdinalVisualValueDimensionBuilder<Datum, string, number>
        ) => void)
      | null
  ): this {
    if (radius === null) {
      this.radiusBuilderCategorical = undefined;
      return this;
    }
    this.radiusBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
    radius(this.radiusBuilderCategorical);
    return this;
  }

  radiusNumeric(radius: null): this;
  radiusNumeric(
    radius: (radius: NumberVisualValueDimensionBuilder<Datum, number>) => void
  ): this;
  radiusNumeric(
    radius: (
      radius: NumberVisualValueDimensionBuilder<Datum, number>
    ) => void | null
  ): this {
    if (radius === null) {
      this.radiusBuilderNumber = undefined;
      return this;
    }
    this.radiusBuilderNumber = new NumberVisualValueDimensionBuilder();
    radius(this.radiusBuilderNumber);
    return this;
  }

  /**
   * OPTIONAL. Sets the appearance of the stroke for the dots.
   */
  stroke(stroke: null): this;
  stroke(stroke: (stroke: StrokeBuilder) => void): this;
  stroke(stroke: ((stroke: StrokeBuilder) => void) | null): this {
    if (stroke === null) {
      this.strokeBuilder = undefined;
      return this;
    }
    this.initStrokeBuilder();
    stroke(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new StrokeBuilder();
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  xDate(x: null): this;
  xDate(x: (x: DateChartPositionDimensionBuilder<Datum>) => void): this;
  xDate(
    x: ((x: DateChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (x === null) {
      this.xBuilderDate = undefined;
      return this;
    }
    this.xBuilderDate = new DateChartPositionDimensionBuilder<Datum>();
    x(this.xBuilderDate);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  xNumeric(x: null): this;
  xNumeric(x: (x: NumberChartPositionDimensionBuilder<Datum>) => void): this;
  xNumeric(
    x: ((x: NumberChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (x === null) {
      this.xBuilderNumeric = undefined;
      return this;
    }
    this.xBuilderNumeric = new NumberChartPositionDimensionBuilder<Datum>();
    x(this.xBuilderNumeric);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  xOrdinal(x: null): this;
  xOrdinal(
    x: (x: OrdinalChartPositionDimensionBuilder<Datum, XOrdinalDomain>) => void
  ): this;
  xOrdinal(
    x:
      | ((
          x: OrdinalChartPositionDimensionBuilder<Datum, XOrdinalDomain>
        ) => void)
      | null
  ): this {
    if (x === null) {
      this.xBuilderDate = undefined;
      return this;
    }
    this.xBuilderOrdinal = new OrdinalChartPositionDimensionBuilder<
      Datum,
      XOrdinalDomain
    >();
    x(this.xBuilderOrdinal);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  yDate(y: null): this;
  yDate(y: (y: DateChartPositionDimensionBuilder<Datum>) => void): this;
  yDate(
    y: ((y: DateChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (y === null) {
      this.yBuilderDate = undefined;
      return this;
    }
    this.yBuilderDate = new DateChartPositionDimensionBuilder<Datum>();
    y(this.yBuilderDate);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  yNumeric(y: null): this;
  yNumeric(y: (y: NumberChartPositionDimensionBuilder<Datum>) => void): this;
  yNumeric(
    y: ((y: NumberChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (y === null) {
      this.yBuilderNumeric = undefined;
      return this;
    }
    this.yBuilderNumeric = new NumberChartPositionDimensionBuilder<Datum>();
    y(this.yBuilderNumeric);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  yOrdinal(y: null): this;
  yOrdinal(
    y: (y: OrdinalChartPositionDimensionBuilder<Datum, YOrdinalDomain>) => void
  ): this;
  yOrdinal(
    y:
      | ((
          y: OrdinalChartPositionDimensionBuilder<Datum, YOrdinalDomain>
        ) => void)
      | null
  ): this {
    if (y === null) {
      this.yBuilderOrdinal = undefined;
      return this;
    }
    this.yBuilderOrdinal = new OrdinalChartPositionDimensionBuilder<
      Datum,
      YOrdinalDomain
    >();
    y(this.yBuilderOrdinal);
    return this;
  }

  /**
   * REQUIRED. Validates and builds the configuration object for the bars that can be passed to BarsComponent.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): DotsConfig<Datum, XOrdinalDomain, YOrdinalDomain> {
    this.validateBuilder();
    const fillName = 'Dots Fill';
    const radiusName = 'Dots Radius';
    const xName = 'Dots X';
    const yName = 'Dots Y';
    const fillBuilder = this.fillBuilderCategorical
      ? this.fillBuilderCategorical
      : this.fillBuilderNumber || this.fillBuilderConst;
    const radiusBuilder = this.radiusBuilderCategorical
      ? this.radiusBuilderCategorical
      : this.radiusBuilderNumber || this.radiusBuilderConst;
    return new DotsConfig<Datum, XOrdinalDomain, YOrdinalDomain>({
      data: this._data,
      fill: fillBuilder._build(fillName),
      key: this._key,
      mixBlendMode: this._mixBlendMode,
      opacity: this._opacity,
      pointerDetectionRadius: this._pointerDetectionRadius,
      radius: radiusBuilder._build(radiusName),
      stroke: this.strokeBuilder?._build(),
      x: this.xBuilderDate
        ? this.xBuilderDate._build(xName)
        : this.xBuilderNumeric
          ? this.xBuilderNumeric._build(xName)
          : this.xBuilderOrdinal._build('point', xName),
      y: this.xBuilderDate
        ? this.yBuilderDate._build(yName)
        : this.yBuilderNumeric
          ? this.yBuilderNumeric._build(yName)
          : this.yBuilderOrdinal._build('point', yName),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Lines');
    const fillBuilders = [
      this.fillBuilderCategorical,
      this.fillBuilderNumber,
      this.fillBuilderConst,
    ];
    const numFillBuilders = fillBuilders.filter(
      (builder) => builder !== undefined
    ).length;
    if (numFillBuilders === 0) {
      this.fillBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
      this.fillBuilderCategorical.range([schemeTableau10[0]]);
    }
    if (numFillBuilders > 1) {
      throw new Error(
        `Dots Builder: Only one fill method can be called with a truthy value. Curently ${numFillBuilders} are called.`
      );
    }
    const radiusBuilders = [
      this.radiusBuilderCategorical,
      this.radiusBuilderNumber,
      this.radiusBuilderConst,
    ];
    const numRadiusBuilders = radiusBuilders.filter(
      (builder) => builder !== undefined
    ).length;
    if (numRadiusBuilders === 0) {
      this.radiusBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
      this.radiusBuilderCategorical.range([2]);
    }
    if (numRadiusBuilders > 1) {
      throw new Error(
        `Dots Builder: Only one radius method can be called with a truthy value. Curently ${numRadiusBuilders} are called.`
      );
    }
    if (
      +!!this.xBuilderNumeric +
        +!!this.xBuilderDate +
        +!!this.xBuilderOrdinal !==
      1
    ) {
      throw new Error(
        'Dots Builder: Exactly one X dimension is required. Please use one of `xDate`, `xNumeric`, or `xOrdinal` to set it.'
      );
    }
    if (
      +!!this.yBuilderNumeric +
        +!!this.yBuilderDate +
        +!!this.yBuilderOrdinal !==
      1
    ) {
      throw new Error(
        'Dots Builder: Exactly one Y dimension is required. Please use one of `yDate`, `yNumeric`, or `yOrdinal` to set it.'
      );
    }
  }
}

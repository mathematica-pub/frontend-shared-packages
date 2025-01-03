import { Injectable } from '@angular/core';
import { VicAuxMarksBuilder } from '../../marks/aux-marks/config/aux-marks-builder';
import { StrokeBuilder } from '../../stroke/stroke-builder';
import { RulesLabelsBuilder } from './labels/quantitative-rules-labels-builder';
import { QuantitativeRulesConfig } from './quantitative-rules-config';
import {
  HORIZONTAL_RULE_DIMENSIONS,
  QuantitativeRulesDimensions,
  VERTICAL_RULE_DIMENSIONS,
} from './quantitative-rules-dimensions';

const DEFAULT = {
  _color: '#cccccc',
};

@Injectable()
export class VicQuantitativeRulesConfigBuilder<
  Datum extends number | Date,
> extends VicAuxMarksBuilder {
  protected _color: (d: Datum) => string;
  protected _data: Datum[];
  protected dimensions: QuantitativeRulesDimensions;
  protected _orientation: 'horizontal' | 'vertical';
  private labelsBuilder: RulesLabelsBuilder<Datum>;
  private strokeBuilder: StrokeBuilder;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the color of the rule.
   *
   * @default #cccccc.
   */
  color(color: string | ((d: Datum) => string)): this {
    if (typeof color === 'string') {
      this._color = () => color;
    } else {
      this._color = color;
    }
    return this;
  }

  /**
   * REQUIRED. Sets the data that will be used to render the quantitative rules.
   *
   * This component is not a Primary Marks component, so this data will not affect chart-level scales.
   *
   * @param data The data to be used to render the quantitative rules. Should be an array of numbers or dates.
   */
  data(data: Datum[]): this {
    this._data = data;
    return this;
  }

  /**
   * REQUIRED. Sets the orientation of the rule.
   */
  orientation(orientation: 'horizontal' | 'vertical'): this {
    this._orientation = orientation;
    this.dimensions =
      orientation === 'horizontal'
        ? HORIZONTAL_RULE_DIMENSIONS
        : VERTICAL_RULE_DIMENSIONS;
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the rule labels.
   */
  labels(): this;
  labels(labels: null): this;
  labels(labels: (labels: RulesLabelsBuilder<Datum>) => void): this;
  labels(labels?: ((labels: RulesLabelsBuilder<Datum>) => void) | null): this {
    if (labels === null) {
      this.labelsBuilder = undefined;
      return this;
    }
    this.labelsBuilder = new RulesLabelsBuilder();
    labels?.(this.labelsBuilder);
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the rule stroke.
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
   * REQUIRED. Builds the configuration object for the RuleComponent.
   */
  getConfig(): QuantitativeRulesConfig<Datum> {
    this.validateBuilder();
    return new QuantitativeRulesConfig({
      color: this._color,
      data: this._data,
      dimensions: this.dimensions,
      labels: this.labelsBuilder?._build(),
      mixBlendMode: this._mixBlendMode,
      stroke: this.strokeBuilder._build(),
    });
  }

  protected validateBuilder(): void {
    if (this.data === undefined) {
      throw new Error('Data is required for the Quantitative Rules component.');
    }
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
    if (this.labelsBuilder) {
      this.labelsBuilder.validateBuilder(this._orientation, this._color);
    }
  }
}

import { Injectable } from '@angular/core';
import { MarksBuilder } from '../../marks/config/marks-builder';
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
> extends MarksBuilder<Datum> {
  protected _color: (d: Datum) => string;
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
  createLabels(
    setProperties?: (labels: RulesLabelsBuilder<Datum>) => void
  ): this {
    this.labelsBuilder = new RulesLabelsBuilder();
    setProperties?.(this.labelsBuilder);
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the rule stroke.
   */
  createStroke(setProperties?: (stroke: StrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
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

  protected override validateBuilder(): void {
    super.validateBuilder('Rule');
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
    if (this.labelsBuilder) {
      this.labelsBuilder.validateBuilder(this._orientation, this._color);
    }
  }
}

import { DataValue } from '../../../../../../core/types/values';
import { DataDimensionBuilder } from '../../../../../../data-dimensions/dimension-builder';
import { FillDef } from '../../../../../../fill-defs/fill-def';

export abstract class AttributeDataDimensionBuilder<
  Datum,
  AttributeValue extends DataValue,
  RangeValue extends string | number = string,
> extends DataDimensionBuilder<Datum, AttributeValue> {
  protected _fillDefs: FillDef<Datum>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _interpolator: (...args: any) => any;
  protected _nullColor: string;
  protected _range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _scale: (...args: any) => string;

  /**
   * OPTIONAL. An array of fill patterns that will be applied to the features in this layer with attribute data.
   */
  fillDefs(fillDefs: FillDef<Datum>[]): this {
    this._fillDefs = fillDefs;
    return this;
  }

  /**
   * OPTIONAL. For binned dimensions, a function that will be used to create the a new range for the attribute data scale if the user's specified numBins is greater than the values in the user's specified range.
   *
   * For the No Bins dimension, this will be used to interpolate between the two colors in the range.
   *
   * @default interpolateLab
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator(interpolator: (...args: any) => any): this {
    this._interpolator = interpolator;
    return this;
  }

  /**
   * A color that will be used if there are any geojson features provided in this dimension's geographies that do not have attribute data.
   *
   * @default 'whitesmoke'
   */
  nullColor(nullColor: string): this {
    this._nullColor = nullColor;
    return this;
  }

  /**
   * OPTIONAL. An array of values that will be used as the range in the attribute data scale.
   *
   * @default ['white', 'slategray'] for Categorical Bins
   * @default ['white', 'blue'] for Equal Frequencies Bins
   * @default ['white', 'pink', 'red'] for Equal Value Ranges Bins
   */
  range(range: RangeValue[]): this {
    this._range = range;
    return this;
  }

  /**
   * A function that will be used to create the scale for the attribute data.
   *
   * @default scaleOrdinal for Categorical Bins
   * @default scaleThreshold for Custom Breaks Bins (cannot be overridden)
   * @default scaleQuantile for Equal Frequencies Bins
   * @default scaleQuantize for Equal Value Ranges Bins
   * @default scaleLinear for No Bins
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale(scale: (...args: any) => string): this {
    this._scale = scale;
    return this;
  }
}

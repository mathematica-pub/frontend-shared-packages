import { Injectable } from '@angular/core';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicCategoricalAttributeDataDimension } from '../../dimensions/categorical-bins/categorical-bins';
import { VicCategoricalBinsBuilder } from '../../dimensions/categorical-bins/categorical-bins-builder';
import { VicCustomBreaksAttributeDataDimension } from '../../dimensions/custom-breaks/custom-breaks-bins';
import { VicCustomBreaksBuilder } from '../../dimensions/custom-breaks/custom-breaks-bins-builder';
import { VicEqualFrequenciesAttributeDataDimension } from '../../dimensions/equal-frequencies-bins/equal-frequencies-bins';
import { VicEqualFrequenciesBinsBuilder } from '../../dimensions/equal-frequencies-bins/equal-frequencies-bins-builder';
import { VicEqualValueRangesAttributeDataDimension } from '../../dimensions/equal-value-ranges-bins/equal-value-ranges-bins';
import { VicEqualValueRangesBinsBuilder } from '../../dimensions/equal-value-ranges-bins/equal-value-ranges-bins-builder';
import { VicNoBinsAttributeDataDimension } from '../../dimensions/no-bins/no-bins';
import { VicNoBinsBuilder } from '../../dimensions/no-bins/no-bins-builder';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { VicGeographiesLabels } from '../labels/geographies-labels';
import { VicGeographiesLabelsBuilder } from '../labels/geographies-labels-builder';
import { VicGeographiesAttributeDataLayer } from './attribute-data-layer';

const DEFAULT = {
  _enableEffects: true,
  _nullColor: '#dcdcdc',
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
};

@Injectable({ providedIn: 'root' })
export class VicGeographiesAttributeDataLayerBuilder<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private _attributeDimension:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValueRangesAttributeDataDimension<Datum>
    | VicEqualFrequenciesAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  private _data: Datum[];
  private _geographyIndexAccessor: (d: Datum) => string;
  private _labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;

  constructor(
    public categoricalBinsBuilder: VicCategoricalBinsBuilder<Datum>,
    public customBreaksBuilder: VicCustomBreaksBuilder<Datum>,
    public equalFrequenciesBinsBuilder: VicEqualFrequenciesBinsBuilder<Datum>,
    public equalValueRangesBinsBuilder: VicEqualValueRangesBinsBuilder<Datum>,
    public noBinsBuilder: VicNoBinsBuilder<Datum>,
    public labelsBuilder: VicGeographiesLabelsBuilder<
      Datum,
      TProperties,
      TGeometry
    >
  ) {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * The dimension that will be used to color the geographies based on attribute data.
   */
  attributeDimension(
    dimension:
      | VicCategoricalAttributeDataDimension<Datum>
      | VicNoBinsAttributeDataDimension<Datum>
      | VicEqualValueRangesAttributeDataDimension<Datum>
      | VicEqualFrequenciesAttributeDataDimension<Datum>
      | VicCustomBreaksAttributeDataDimension<Datum>
  ): this {
    this._attributeDimension = dimension;
    return this;
  }

  /**
   * The data that will be used to color the geographies.
   */
  data(data: Datum[]): this {
    this._data = data;
    return this;
  }

  /**
   * The accessor function that returns a value from a Datum that must match the value returned by featureIndexAccessor.
   */
  geographyIndexAccessor(accessor: (d: Datum) => string): this {
    this._geographyIndexAccessor = accessor;
    return this;
  }

  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels(labels: VicGeographiesLabels<Datum, TProperties, TGeometry>): this {
    this._labels = labels;
    return this;
  }

  build(): VicGeographiesAttributeDataLayer<Datum, TProperties, TGeometry> {
    return new VicGeographiesAttributeDataLayer({
      attributeDimension: this._attributeDimension,
      data: this._data,
      geographyIndexAccessor: this._geographyIndexAccessor,
      labels: this._labels,
    });
  }
}

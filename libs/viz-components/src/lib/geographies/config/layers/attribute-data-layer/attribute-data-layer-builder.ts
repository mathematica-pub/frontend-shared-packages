import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { GeographiesAttributeDataLayer } from './attribute-data-layer';
import { CategoricalBinsBuilder } from './dimensions/categorical-bins/categorical-bins-builder';
import { CustomBreaksBinsAttributeDataDimensionBuilder } from './dimensions/custom-breaks/custom-breaks-bins-builder';
import { EqualFrequenciesAttributeDataDimensionBuilder } from './dimensions/equal-frequencies-bins/equal-frequencies-bins-builder';
import { EqualValueRangesBinsBuilder } from './dimensions/equal-value-ranges-bins/equal-value-ranges-bins-builder';
import { NoBinsAttributeDataDimensionBuilder } from './dimensions/no-bins/no-bins-builder';

const DEFAULT = {
  _enableEventActions: true,
};

export class GeographiesAttributeDataLayerBuilder<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private _data: Datum[];
  private _geographyIndexAccessor: (d: Datum) => string;

  private binsBuilder:
    | CategoricalBinsBuilder<Datum>
    | CustomBreaksBinsAttributeDataDimensionBuilder<Datum>
    | EqualFrequenciesAttributeDataDimensionBuilder<Datum>
    | EqualValueRangesBinsBuilder<Datum>
    | NoBinsAttributeDataDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Creates a configuration object that maps data to colors by categorical values.
   *
   * For example, if the data for a set of U.S. states had a string property, 'region', this could be used to color the states by region.
   */
  categoricalBins(
    setProperties: (builder: CategoricalBinsBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new CategoricalBinsBuilder<Datum, string>();
    setProperties(this.binsBuilder);
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object that maps data to colors by custom breaks values for bins.
   */
  customBreaksBins(
    setProperties: (
      builder: CustomBreaksBinsAttributeDataDimensionBuilder<Datum>
    ) => void
  ): this {
    this.binsBuilder = new CustomBreaksBinsAttributeDataDimensionBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  noBins(
    setProperties: (builder: NoBinsAttributeDataDimensionBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new NoBinsAttributeDataDimensionBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  equalValueRangesBins(
    setProperties: (builder: EqualValueRangesBinsBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new EqualValueRangesBinsBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  equalFrequenciesBins(
    setProperties: (
      builder: EqualFrequenciesAttributeDataDimensionBuilder<Datum>
    ) => void
  ): this {
    this.binsBuilder = new EqualFrequenciesAttributeDataDimensionBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  /**
   * REQUIRED. The data that will be used to color the geographies.
   */
  data(data: Datum[]): this {
    this._data = data;
    return this;
  }

  /**
   * REQUIRED. The accessor function that returns a value from a Datum that must match the value returned by featureIndexAccessor.
   */
  geographyIndexAccessor(accessor: (d: Datum) => string): this {
    this._geographyIndexAccessor = accessor;
    return this;
  }

  _build(): GeographiesAttributeDataLayer<Datum, TProperties, TGeometry> {
    this.validateBuilder();
    return new GeographiesAttributeDataLayer({
      attributeDimension: this.binsBuilder._build(),
      class: this._class,
      data: this._data,
      enableEventActions: this._enableEventActions,
      geographies: this._geographies,
      geographyIndexAccessor: this._geographyIndexAccessor,
      labels: this.labelsBuilder?._build(),
      strokeColor: this._strokeColor,
      strokeWidth: this._strokeWidth,
    });
  }

  private validateBuilder(): void {
    if (!this._data) {
      throw new Error('Data must be provided');
    }
    if (!this._geographyIndexAccessor) {
      throw new Error('Geography index accessor must be provided');
    }
    if (!this.binsBuilder) {
      throw new Error('Bins builder must be provided');
    }
  }
}

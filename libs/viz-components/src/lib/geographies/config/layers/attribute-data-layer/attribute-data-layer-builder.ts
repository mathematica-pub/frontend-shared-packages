import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { FillDefinition } from 'libs/viz-components/src/public-api';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { GeographiesAttributeDataLayer } from './attribute-data-layer';
import { CategoricalBinsBuilder } from './dimensions/categorical-bins/categorical-bins-builder';
import { CustomBreaksBinsAttributeDataDimensionBuilder } from './dimensions/custom-breaks/custom-breaks-bins-builder';
import { EqualFrequenciesAttributeDataDimensionBuilder } from './dimensions/equal-frequencies-bins/equal-frequencies-bins-builder';
import { EqualValueRangesBinsBuilder } from './dimensions/equal-value-ranges-bins/equal-value-ranges-bins-builder';
import { NoBinsAttributeDataDimensionBuilder } from './dimensions/no-bins/no-bins-builder';

const DEFAULT = {
  _class: () => '',
  _enableEventActions: true,
};

export class GeographiesAttributeDataLayerBuilder<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private _customFills: FillDefinition<Datum>[];
  private _data: Datum[];
  private _geographyIndexAccessor: (d: Datum) => string;

  private binsBuilder:
    | CategoricalBinsBuilder<Datum>
    | CustomBreaksBinsAttributeDataDimensionBuilder<Datum>
    | EqualFrequenciesAttributeDataDimensionBuilder<Datum>
    | EqualValueRangesBinsBuilder<Datum>
    | NoBinsAttributeDataDimensionBuilder<Datum>;

  private categoricalBinsBuilder: CategoricalBinsBuilder<Datum>;
  private customBreaksBinsBuilder: CustomBreaksBinsAttributeDataDimensionBuilder<Datum>;
  private equalFrequenciesBinsBuilder: EqualFrequenciesAttributeDataDimensionBuilder<Datum>;
  private equalValueRangesBinsBuilder: EqualValueRangesBinsBuilder<Datum>;
  private noBinsBuilder: NoBinsAttributeDataDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Creates a configuration object that maps data to colors by categorical values.
   *
   * For example, if the data for a set of U.S. states had a string property, 'region', this could be used to color the states by region.
   */
  categoricalBins(bins: null): this;
  categoricalBins(bins: (bins: CategoricalBinsBuilder<Datum>) => void): this;
  categoricalBins(
    bins: ((bins: CategoricalBinsBuilder<Datum>) => void) | null
  ): this {
    if (bins === null) {
      this.categoricalBinsBuilder = undefined;
      return this;
    }
    this.categoricalBinsBuilder = new CategoricalBinsBuilder<Datum, string>();
    bins(this.categoricalBinsBuilder);
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object that maps data to colors by custom breaks values for bins.
   */
  customBreaksBins(bins: null): this;
  customBreaksBins(
    bins: (bins: CustomBreaksBinsAttributeDataDimensionBuilder<Datum>) => void
  ): this;
  customBreaksBins(
    bins:
      | ((bins: CustomBreaksBinsAttributeDataDimensionBuilder<Datum>) => void)
      | null
  ): this {
    if (bins === null) {
      this.customBreaksBinsBuilder = undefined;
      return this;
    }
    this.customBreaksBinsBuilder =
      new CustomBreaksBinsAttributeDataDimensionBuilder();
    bins(this.customBreaksBinsBuilder);
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
   * OPTIONAL. Creates a configuration object that for creating a map without binning values.
   */
  noBins(bins: null): this;
  noBins(
    bins: (bins: NoBinsAttributeDataDimensionBuilder<Datum>) => void
  ): this;
  noBins(
    bins: ((bins: NoBinsAttributeDataDimensionBuilder<Datum>) => void) | null
  ): this {
    if (bins === null) {
      this.noBinsBuilder = undefined;
      return this;
    }
    this.noBinsBuilder = new NoBinsAttributeDataDimensionBuilder();
    bins(this.noBinsBuilder);
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object that maps data to bins that each have the same size range.
   *
   * For example, bins may be, 0-10, 10-20, 20-30, etc.
   */
  equalValueRangesBins(bins: null): this;
  equalValueRangesBins(
    bins: (bins: EqualValueRangesBinsBuilder<Datum>) => void
  ): this;
  equalValueRangesBins(
    bins: ((bins: EqualValueRangesBinsBuilder<Datum>) => void) | null
  ): this {
    if (bins === null) {
      this.equalValueRangesBinsBuilder = undefined;
      return this;
    }
    this.equalValueRangesBinsBuilder = new EqualValueRangesBinsBuilder();
    bins(this.equalValueRangesBinsBuilder);
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object that maps data to bins that contain an equal number of data observations.
   *
   * This is useful for creating quartiles, deciles, etc.
   */
  equalFrequenciesBins(bins: null): this;
  equalFrequenciesBins(
    bins: (bins: EqualFrequenciesAttributeDataDimensionBuilder<Datum>) => void
  ): this;
  equalFrequenciesBins(
    bins:
      | ((bins: EqualFrequenciesAttributeDataDimensionBuilder<Datum>) => void)
      | null
  ): this {
    if (bins === null) {
      this.equalFrequenciesBinsBuilder = undefined;
      return this;
    }
    this.equalFrequenciesBinsBuilder =
      new EqualFrequenciesAttributeDataDimensionBuilder();
    bins(this.equalFrequenciesBinsBuilder);
    return this;
  }

  customFills(customFills: FillDefinition<Datum>[]): this {
    this._customFills = customFills;
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
      marksClass: 'vic-geographies-attribute-data-layer',
      attributeDimension: this.binsBuilder._build(),
      customFills: this._customFills,
      data: this._data,
      featureClass: this._class,
      enableEventActions: this._enableEventActions,
      geographies: this._geographies,
      geographyIndexAccessor: this._geographyIndexAccessor,
      labels: this.labelsBuilder?._build(),
      mixBlendMode: this._mixBlendMode,
      stroke: this.strokeBuilder?._build(),
    });
  }

  private validateBuilder(): void {
    const binsBuilders = [
      this.categoricalBinsBuilder,
      this.customBreaksBinsBuilder,
      this.equalFrequenciesBinsBuilder,
      this.equalValueRangesBinsBuilder,
      this.noBinsBuilder,
    ];
    if (!this._data) {
      throw new Error('Data must be provided');
    }
    if (!this._geographyIndexAccessor) {
      throw new Error('Geography index accessor must be provided');
    }
    const numBinsBuilders = binsBuilders.filter((builder) => builder).length;
    if (numBinsBuilders !== 1) {
      throw new Error(
        `Exactly one bin strategy must be provided. Currently, ${numBinsBuilders} are provided.`
      );
    }
    this.binsBuilder = binsBuilders.find((builder) => builder);
    if (!this.strokeBuilder) {
      this.initStrokeBuilder();
    }
  }
}

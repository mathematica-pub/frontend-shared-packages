import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicCategoricalBinsBuilder } from '../../dimensions/categorical-bins/categorical-bins-builder';
import { VicCustomBreaksBuilder } from '../../dimensions/custom-breaks/custom-breaks-bins-builder';
import { VicEqualFrequenciesBinsBuilder } from '../../dimensions/equal-frequencies-bins/equal-frequencies-bins-builder';
import { VicEqualValueRangesBinsBuilder } from '../../dimensions/equal-value-ranges-bins/equal-value-ranges-bins-builder';
import { VicNoBinsBuilder } from '../../dimensions/no-bins/no-bins-builder';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { VicGeographiesLabels } from '../labels/geographies-labels';
import { VicGeographiesLabelsBuilder } from '../labels/geographies-labels-builder';
import { VicGeographiesAttributeDataLayer } from './attribute-data-layer';

const DEFAULT = {
  _enableEffects: true,
};

export class VicGeographiesAttributeDataLayerBuilder<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private _data: Datum[];
  private _geographyIndexAccessor: (d: Datum) => string;
  private labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
  private labelsBuilder: VicGeographiesLabelsBuilder<
    Datum,
    TProperties,
    TGeometry
  >;
  private binsBuilder:
    | VicCategoricalBinsBuilder<Datum>
    | VicCustomBreaksBuilder<Datum>
    | VicEqualFrequenciesBinsBuilder<Datum>
    | VicEqualValueRangesBinsBuilder<Datum>
    | VicNoBinsBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * The dimension that will be used to color the geographies based on attribute data.
   */
  createCategoricalBinsDimension(
    setProperties: (builder: VicCategoricalBinsBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new VicCategoricalBinsBuilder<Datum, string>();
    setProperties(this.binsBuilder);
    return this;
  }

  createCustomBreaksBinsDimension(
    setProperties: (builder: VicCustomBreaksBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new VicCustomBreaksBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  createNoBinsDimension(
    setProperties: (builder: VicNoBinsBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new VicNoBinsBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  createEqualValueRangesBinsDimension(
    setProperties: (builder: VicEqualValueRangesBinsBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new VicEqualValueRangesBinsBuilder();
    setProperties(this.binsBuilder);
    return this;
  }

  createEqualFrequenciesBinsDimension(
    setProperties: (builder: VicEqualFrequenciesBinsBuilder<Datum>) => void
  ): this {
    this.binsBuilder = new VicEqualFrequenciesBinsBuilder();
    setProperties(this.binsBuilder);
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
  createLabels(
    setProperties: (
      builder: VicGeographiesLabelsBuilder<Datum, TProperties, TGeometry>
    ) => void
  ): this {
    this.labelsBuilder = new VicGeographiesLabelsBuilder();
    setProperties(this.labelsBuilder);
    this.labels = this.labelsBuilder.build();
    return this;
  }

  build(): VicGeographiesAttributeDataLayer<Datum, TProperties, TGeometry> {
    return new VicGeographiesAttributeDataLayer({
      attributeDimension: this.binsBuilder.build(),
      class: this._class,
      data: this._data,
      enableEffects: this._enableEffects,
      geographies: this._geographies,
      geographyIndexAccessor: this._geographyIndexAccessor,
      labels: this.labels,
      strokeColor: this._strokeColor,
      strokeWidth: this._strokeWidth,
    });
  }
}

import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { CategoricalDimensionBuilder } from 'projects/viz-components/src/lib/data-dimensions/categorical/categorical-builder';
import { VicDimensionCategorical } from '../../../../data-dimensions/categorical/categorical';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { VicGeographiesLabels } from '../labels/geographies-labels';
import { VicGeographiesLabelsBuilder } from '../labels/geographies-labels-builder';
import { VicGeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';

const DEFAULT = {
  _fill: 'none',
  _enableEffects: false,
};

export class VicGeographiesGeojsonPropertiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private categorical: VicDimensionCategorical<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  private categoricalBuilder: CategoricalDimensionBuilder<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  private _fill: string;
  private _labels: VicGeographiesLabels<string, TProperties, TGeometry>;
  private labelsBuilder: VicGeographiesLabelsBuilder<
    string,
    TProperties,
    TGeometry
  > = new VicGeographiesLabelsBuilder();

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  fill(fill: string): this {
    this._fill = fill;
    return this;
  }

  createCategoricalDimension(
    callback: (
      builder: CategoricalDimensionBuilder<
        VicGeographiesFeature<TProperties, TGeometry>,
        string
      >
    ) => void
  ): this {
    this.categoricalBuilder = new CategoricalDimensionBuilder();
    callback(this.categoricalBuilder);
    return this;
  }

  createLabels(
    callback: (
      builder: VicGeographiesLabelsBuilder<string, TProperties, TGeometry>
    ) => void
  ): this {
    this.labelsBuilder = new VicGeographiesLabelsBuilder();
    callback(this.labelsBuilder);
    this._labels = this.labelsBuilder.build();
    return this;
  }

  build(): VicGeographiesGeojsonPropertiesLayer<TProperties, TGeometry> {
    return new VicGeographiesGeojsonPropertiesLayer({
      categorical: this.categoricalBuilder.build(),
      class: this._class,
      enableEffects: this._enableEffects,
      fill: this._fill,
      geographies: this._geographies,
      labels: this._labels,
      strokeColor: this._strokeColor,
      strokeWidth: this._strokeWidth,
    });
  }
}

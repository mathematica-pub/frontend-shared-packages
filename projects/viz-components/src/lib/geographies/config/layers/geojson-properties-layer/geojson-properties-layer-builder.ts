import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { CategoricalDimensionBuilder } from 'projects/viz-components/src/lib/data-dimensions/categorical/categorical-builder';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { GeographiesLabels } from '../labels/geographies-labels';
import { GeographiesLabelsBuilder } from '../labels/geographies-labels-builder';
import { GeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';

const DEFAULT = {
  _fill: 'none',
  _enableEffects: false,
};

export class GeographiesGeojsonPropertiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private categoricalBuilder: CategoricalDimensionBuilder<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  private _fill: string;
  private _labels: GeographiesLabels<string, TProperties, TGeometry>;
  private labelsBuilder: GeographiesLabelsBuilder<
    string,
    TProperties,
    TGeometry
  > = new GeographiesLabelsBuilder();

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * Set a fill color for all geographies in the layer.
   *
   * To set a fill color based on a geography's geojson properties, use the `createCategoricalDimension` method.
   *
   * @default 'none'
   */
  fill(fill: string): this {
    this._fill = fill;
    return this;
  }

  createCategoricalDimension(
    setProperties: (
      builder: CategoricalDimensionBuilder<
        VicGeographiesFeature<TProperties, TGeometry>,
        string
      >
    ) => void
  ): this {
    this.initCategricalBuilder();
    if (setProperties) {
      setProperties(this.categoricalBuilder);
    }
    setProperties(this.categoricalBuilder);
    return this;
  }

  private initCategricalBuilder(): void {
    this.categoricalBuilder = new CategoricalDimensionBuilder();
  }

  createLabels(
    setProperties: (
      builder: GeographiesLabelsBuilder<string, TProperties, TGeometry>
    ) => void
  ): this {
    this.labelsBuilder = new GeographiesLabelsBuilder();
    if (setProperties) {
      setProperties(this.labelsBuilder);
    }
    this._labels = this.labelsBuilder.build();
    return this;
  }

  build(): GeographiesGeojsonPropertiesLayer<TProperties, TGeometry> {
    return new GeographiesGeojsonPropertiesLayer({
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

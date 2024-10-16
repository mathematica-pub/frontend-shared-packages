import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { OrdinalVisualValueDimensionBuilder } from '../../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { GeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';

const DEFAULT = {
  _fill: 'none',
  _enableEventActions: false,
};

export class GeographiesGeojsonPropertiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private categoricalBuilder: OrdinalVisualValueDimensionBuilder<
    GeographiesFeature<TProperties, TGeometry>,
    string,
    string
  >;
  private _fill: string;

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
      builder: OrdinalVisualValueDimensionBuilder<
        GeographiesFeature<TProperties, TGeometry>,
        string,
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
    this.categoricalBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  _build(): GeographiesGeojsonPropertiesLayer<TProperties, TGeometry> {
    return new GeographiesGeojsonPropertiesLayer({
      categorical: this.categoricalBuilder?._build(),
      class: this._class,
      enableEventActions: this._enableEventActions,
      fill: this._fill,
      geographies: this._geographies,
      labels: this.labelsBuilder?._build(),
      strokeColor: this._strokeColor,
      strokeWidth: this._strokeWidth,
    });
  }
}

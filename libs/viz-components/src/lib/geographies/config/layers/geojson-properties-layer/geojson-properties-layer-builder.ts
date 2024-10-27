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
  private fillBuilder: OrdinalVisualValueDimensionBuilder<
    GeographiesFeature<TProperties, TGeometry>,
    string
  >;
  private _fill: string;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL: Set a fill color for all geographies in the layer.
   *
   * To set a fill color based on a geography's geojson properties, use the `fillCategorical` method.
   *
   * @default 'none'
   */
  fill(fill: string): this {
    this.initFillBuilder();
    this.fillBuilder.valueAccessor(() => null).range([fill]);
    return this;
  }

  fillGeojsonProperties(
    setProperties: (
      builder: OrdinalVisualValueDimensionBuilder<
        GeographiesFeature<TProperties, TGeometry>,
        string
      >
    ) => void
  ): this {
    this.initFillBuilder();
    setProperties(this.fillBuilder);
    return this;
  }

  private initFillBuilder(): void {
    this.fillBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  _build(): GeographiesGeojsonPropertiesLayer<TProperties, TGeometry> {
    return new GeographiesGeojsonPropertiesLayer({
      class: this._class,
      enableEventActions: this._enableEventActions,
      fill: this.fillBuilder?._build(),
      geographies: this._geographies,
      labels: this.labelsBuilder?._build(),
      stroke: this.strokeBuilder?._build(),
    });
  }
}

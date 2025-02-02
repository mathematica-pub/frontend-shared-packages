import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { OrdinalVisualValueDimensionBuilder } from '../../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { FillDefinition } from '../../../../fill-definitions/fill-definitions';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerBuilder } from '../geographies-layer/geographies-layer-builder';
import { GeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';

const DEFAULT = {
  _class: () => '',
  _enableEventActions: false,
};

export class GeographiesGeojsonPropertiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private fillBuilder: OrdinalVisualValueDimensionBuilder<
    GeographiesFeature<TProperties, TGeometry>,
    string,
    string
  >;
  private _customFills: FillDefinition<
    GeographiesFeature<TProperties, TGeometry>
  >[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL: Set a fill color or function that yields a color for all geographies in the layer.
   *
   * If a string is provided, all geographies will be filled with that color.
   *
   * Otherwise, you can use this method to specify how each geography should be filled based on the properties of the geojson feature.
   */
  fill(fill: null): this;
  fill(fill: string): this;
  fill(
    fill: (
      fill: OrdinalVisualValueDimensionBuilder<
        GeographiesFeature<TProperties, TGeometry>,
        string,
        string
      >
    ) => void
  ): this;
  fill(
    fill:
      | string
      | null
      | ((
          fill: OrdinalVisualValueDimensionBuilder<
            GeographiesFeature<TProperties, TGeometry>,
            string,
            string
          >
        ) => void)
  ): this {
    this.initFillBuilder();

    if (fill === null) {
      this.fillBuilder.valueAccessor(() => null).range(['None']);
      return this;
    }

    if (typeof fill === 'string') {
      this.fillBuilder.valueAccessor(() => null).range([fill]);
    } else {
      fill(this.fillBuilder);
    }
    return this;
  }

  customFills(
    customFills: FillDefinition<GeographiesFeature<TProperties, TGeometry>>[]
  ): this {
    this._customFills = customFills;
    return this;
  }

  private initFillBuilder(): void {
    this.fillBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  _build(): GeographiesGeojsonPropertiesLayer<TProperties, TGeometry> {
    this.validateBuilder();
    return new GeographiesGeojsonPropertiesLayer({
      marksClass: 'vic-geographies-geojson-properties-layer',
      customFills: this._customFills,
      featureClass: this._class,
      enableEventActions: this._enableEventActions,
      fill: this.fillBuilder._build('Fill'),
      geographies: this._geographies,
      labels: this.labelsBuilder?._build(),
      mixBlendMode: this._mixBlendMode,
      stroke: this.strokeBuilder?._build(),
    });
  }

  validateBuilder(): void {
    if (!this.fillBuilder) {
      this.initFillBuilder();
    }
    if (!this.strokeBuilder) {
      this.initStrokeBuilder();
    }
  }
}

import { Geometry } from 'geojson';
import { VicGeographiesFeature } from '../../../geographies-feature';

const DEFAULT = {
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
};

export abstract class GeographiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry
> {
  protected _class: string;
  protected _enableEffects: boolean;
  protected _geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  protected _strokeColor: string;
  protected _strokeWidth: string;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * The class to be applied to the geography layer.
   */
  class(value: string): this {
    this._class = value;
    return this;
  }

  /**
   * Whether the layer can use viz-components pointer effects. If true, the event listener that corresponds to the provided directive will be placed on that layer's paths.
   */
  enableEffects(value: boolean): this {
    this._enableEffects = value;
    return this;
  }

  /**
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies(
    value: Array<VicGeographiesFeature<TProperties, TGeometry>>
  ): this {
    this._geographies = value;
    return this;
  }

  /**
   * The color of the stroke for the geography.
   */
  strokeColor(value: string): this {
    this._strokeColor = value;
    return this;
  }

  /**
   * The width of the stroke for the geography.
   */
  strokeWidth(value: string): this {
    this._strokeWidth = value;
    return this;
  }
}

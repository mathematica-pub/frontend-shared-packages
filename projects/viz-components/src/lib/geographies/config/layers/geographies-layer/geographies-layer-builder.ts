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
   * OPTIONAL. The class to be applied to an SVGGElement that holds all geographies and labels for the layer.
   */
  class(value: string): this {
    this._class = value;
    return this;
  }

  /**
   * OPTIONAL. Determines whether the layer can use viz-components pointer effects.
   *
   * If true, the event listener that corresponds to the provided directive will be placed on that layer's paths.
   *
   * @default true for Attribute Data layer
   * @default false for Geojson Properties layers
   */
  enableEffects(value: boolean): this {
    this._enableEffects = value;
    return this;
  }

  /**
   * REQUIRED. GeoJSON features that define the geographies to be drawn.
   */
  geographies(
    value: Array<VicGeographiesFeature<TProperties, TGeometry>>
  ): this {
    this._geographies = value;
    return this;
  }

  /**
   * OPTIONAL. The color of the stroke for the geography.
   *
   * @default 'dimgray'
   */
  strokeColor(value: string): this {
    this._strokeColor = value;
    return this;
  }

  /**
   * OPTIONAL. The width of the stroke for the geography.
   *
   * @default '1'
   */
  strokeWidth(value: string): this {
    this._strokeWidth = value;
    return this;
  }
}

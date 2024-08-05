import { Geometry } from 'geojson';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLabelsBuilder } from '../labels/geographies-labels-builder';

const DEFAULT = {
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
};

export abstract class GeographiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry,
> {
  protected _class: string;
  protected _enableEventActions: boolean;
  protected _geographies: Array<GeographiesFeature<TProperties, TGeometry>>;
  protected labelsBuilder: GeographiesLabelsBuilder<TProperties, TGeometry>;
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
   * OPTIONAL. Determines whether the layer can use viz-components event actions.
   *
   * If true, the event listener that corresponds to the provided directive will be placed on that layer's paths.
   *
   * @default true for Attribute Data layer
   * @default false for Geojson Properties layers
   */
  enableEventActions(value: boolean): this {
    this._enableEventActions = value;
    return this;
  }

  /**
   * REQUIRED. GeoJSON features that define the geographies to be drawn.
   */
  geographies(value: Array<GeographiesFeature<TProperties, TGeometry>>): this {
    this._geographies = value;
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object for labels that will be drawn on the geographies.
   */
  createLabels(
    setProperties: (
      builder: GeographiesLabelsBuilder<TProperties, TGeometry>
    ) => void
  ): this {
    this.labelsBuilder = new GeographiesLabelsBuilder();
    setProperties(this.labelsBuilder);
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

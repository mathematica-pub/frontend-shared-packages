import { Geometry } from 'geojson';
import { StrokeBuilder } from '../../../../stroke/stroke-builder';
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
  protected _enableEventActions: boolean;
  protected _geographies: Array<GeographiesFeature<TProperties, TGeometry>>;
  protected labelsBuilder: GeographiesLabelsBuilder<TProperties, TGeometry>;
  protected strokeBuilder: StrokeBuilder;

  constructor() {
    Object.assign(this, DEFAULT);
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
  labels(labels: null): this;
  labels(
    labels: (labels: GeographiesLabelsBuilder<TProperties, TGeometry>) => void
  ): this;
  labels(
    labels:
      | ((labels: GeographiesLabelsBuilder<TProperties, TGeometry>) => void)
      | null
  ): this {
    if (labels === null) {
      this.labelsBuilder = undefined;
      return this;
    }
    this.labelsBuilder = new GeographiesLabelsBuilder();
    labels(this.labelsBuilder);
    return this;
  }

  /**
   * OPTIONAL. Sets the appearance of the stroke for the geographies in the layer.
   */
  stroke(setProperties?: (stroke: StrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
    return this;
  }

  protected initStrokeBuilder(): void {
    this.strokeBuilder = new StrokeBuilder();
  }
}

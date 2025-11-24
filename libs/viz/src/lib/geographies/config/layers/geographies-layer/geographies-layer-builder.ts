import { safeAssign } from '@mathstack/app-kit';
import { Geometry } from 'geojson';
import { StrokeBuilder } from '../../../../stroke/stroke-builder';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLabelsBuilder } from '../labels/geographies-labels-builder';

const DEFAULT = {
  _class: () => '',
  _mixBlendMode: 'normal',
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
};

export abstract class GeographiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry,
> {
  protected _class: (d: TProperties) => string;
  protected _enableEventActions: boolean;
  protected _geographies: Array<GeographiesFeature<TProperties, TGeometry>>;
  protected labelsBuilder: GeographiesLabelsBuilder<TProperties, TGeometry>;
  protected _mixBlendMode: string;
  protected strokeBuilder: StrokeBuilder;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Provides a class on the SVG element that correspends to a single datum. If a datum creates multiple SVG elements -- for example, a rect and a label, the class will be applied on the parent SVGGElement.
   *
   * IF the chart does not have SVG elements that correspond to a single datum, this class will be placed on the SVG element that represents a collection of data, for example, a area in a stacked area chart, or a line in a line chart. In this case the datum passed to the callback function will be the first datum in the collection.
   *
   * Note that if the resultant string has spaces in the name, multiple classes will be applied. For example, if the class is 'North Carolina', the element will have the classes 'North' and 'Carolina'.
   */
  class(value: null): this;
  class(value: string): this;
  class(value: (d: TProperties) => string): this;
  class(value: ((d: TProperties) => string) | string | null): this {
    if (value === null) {
      this._class = DEFAULT._class;
      return this;
    }
    if (typeof value === 'string') {
      this._class = () => value;
      return this;
    }
    this._class = value;
    return this;
  }

  /**
   * OPTIONAL. Determines whether the layer can use viz event actions.
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
   * Sets the mix-blend-mode of the marks.
   *
   * @default 'normal'
   */
  mixBlendMode(mixBlendMode: string): this {
    this._mixBlendMode = mixBlendMode;
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

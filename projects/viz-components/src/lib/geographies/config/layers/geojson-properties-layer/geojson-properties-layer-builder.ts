import { Injectable } from '@angular/core';
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
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
};

@Injectable({ providedIn: 'root' })
export class VicGeographiesGeojsonPropertiesLayerBuilder<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerBuilder<TProperties, TGeometry> {
  private _categorical: VicDimensionCategorical<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  private _labels: VicGeographiesLabels<string, TProperties, TGeometry>;

  constructor(
    public categoricalDimensionBuilder: CategoricalDimensionBuilder<
      VicGeographiesFeature<TProperties, TGeometry>,
      string
    >,
    public labelsBuilder: VicGeographiesLabelsBuilder<
      string,
      TProperties,
      TGeometry
    >
  ) {
    super();
    Object.assign(this, DEFAULT);
  }

  categorical(
    categorical: VicDimensionCategorical<
      VicGeographiesFeature<TProperties, TGeometry>,
      string
    >
  ): this {
    this._categorical = categorical;
    return this;
  }

  labels(labels: VicGeographiesLabels<string, TProperties, TGeometry>): this {
    this._labels = labels;
    return this;
  }

  build(): VicGeographiesGeojsonPropertiesLayer<TProperties, TGeometry> {
    return new VicGeographiesGeojsonPropertiesLayer({
      categorical: this._categorical,
      labels: this._labels,
    });
  }
}

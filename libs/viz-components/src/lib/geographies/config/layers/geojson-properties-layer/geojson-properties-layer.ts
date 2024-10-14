import { select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { FillUtilities } from '../../../../core/utilities/fill-utilities';
import { CategoricalDimension } from '../../../../data-dimensions/categorical/categorical';
import { GeographiesTooltipData } from '../../../events/geographies-event-output';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayer } from '../geographies-layer/geographies-layer';
import { GeographiesGeojsonPropertiesLayerOptions } from './geojson-properties-layer-options';

export class GeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
  >
  extends GeographiesLayer<string, TProperties, TGeometry>
  implements GeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
{
  readonly categorical: CategoricalDimension<
    GeographiesFeature<TProperties, TGeometry>,
    string,
    string
  >;
  readonly fill: string;

  constructor(
    options: GeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
  ) {
    super();
    Object.assign(this, options);
    this.initPropertiesFromGeographies();
  }

  private initPropertiesFromGeographies(): void {
    if (this.categorical) {
      this.categorical.setPropertiesFromData(this.geographies);
    }
  }

  getFill(feature: GeographiesFeature<TProperties, TGeometry>): string {
    if (!this.categorical) {
      return this.fill;
    }
    const featureIndex = this.featureIndexAccessor(feature);
    const defaultFill = this.categorical.getScale()(featureIndex);
    return this.categorical.fillDefs
      ? FillUtilities.getFill(feature, defaultFill, this.categorical.fillDefs)
      : defaultFill;
  }

  getTooltipData(path: SVGPathElement): GeographiesTooltipData<undefined> {
    const feature = select(path).datum() as GeographiesFeature<
      TProperties,
      TGeometry
    >;
    const featureIndex = this.featureIndexAccessor(feature);
    const tooltipData: GeographiesTooltipData<undefined> = {
      datum: undefined,
      geography: featureIndex,
      attributeValue: undefined,
      color: this.getFill(feature),
    };

    return tooltipData;
  }
}

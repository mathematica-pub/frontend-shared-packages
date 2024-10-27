import { select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { OrdinalVisualValueDimension } from 'libs/viz-components/src/lib/data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { FillUtilities } from '../../../../core/utilities/fill-utilities';
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
  readonly fill: OrdinalVisualValueDimension<
    GeographiesFeature<TProperties, TGeometry>,
    string
  >;

  constructor(
    options: GeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
  ) {
    super();
    Object.assign(this, options);
    this.initPropertiesFromGeographies();
  }

  private initPropertiesFromGeographies(): void {
    this.fill.setPropertiesFromData(this.geographies);
  }

  getFill(feature: GeographiesFeature<TProperties, TGeometry>): string {
    const featureIndex = this.featureIndexAccessor(feature);
    const defaultFill = this.fill.getScale()(featureIndex);
    return this.fill.fillDefs
      ? FillUtilities.getFill(feature, defaultFill, this.fill.fillDefs)
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

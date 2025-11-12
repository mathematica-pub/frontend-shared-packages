import { safeAssign } from '@mathstack/app-kit';
import { select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { FillUtilities } from '../../../../core/utilities/fill-utilities';
import { OrdinalVisualValueDimension } from '../../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { FillDefinition } from '../../../../fill-definitions/fill-definitions';
import { GeographiesFeature } from '../../../geographies-feature';
import {
  GeographiesLayer,
  GeographiesTooltipDatum,
} from '../geographies-layer/geographies-layer';
import { GeographiesGeojsonPropertiesLayerOptions } from './geojson-properties-layer-options';

export class GeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
  >
  extends GeographiesLayer<string, TProperties, TGeometry>
  implements GeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
{
  readonly customFills: FillDefinition<
    GeographiesFeature<TProperties, TGeometry>
  >[];
  readonly fill: OrdinalVisualValueDimension<
    GeographiesFeature<TProperties, TGeometry>,
    string,
    string
  >;
  readonly marksClass: string;
  readonly mixBlendMode: string;

  constructor(
    options: GeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
  ) {
    super();
    safeAssign(this, options);
    this.initPropertiesFromGeographies();
  }

  private initPropertiesFromGeographies(): void {
    this.fill.setPropertiesFromData(this.geographies);
  }

  getFill(feature: GeographiesFeature<TProperties, TGeometry>): string {
    const featureIndex = this.featureIndexAccessor(feature);
    const defaultFill = this.fill.getScale()(featureIndex);
    return this.customFills
      ? FillUtilities.getFill(feature, defaultFill, this.customFills)
      : defaultFill;
  }

  getTooltipData(path: SVGPathElement): GeographiesTooltipDatum<undefined> {
    const feature = select(path).datum() as GeographiesFeature<
      TProperties,
      TGeometry
    >;
    const featureIndex = this.featureIndexAccessor(feature);
    const tooltipData: GeographiesTooltipDatum<undefined> = {
      attributeValue: undefined,
      datum: undefined,
      color: this.getFill(feature),
      geography: featureIndex,
    };

    return tooltipData;
  }
}

import * as CSSType from 'csstype';
import { select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { PatternUtilities } from '../../../../core/utilities/pattern-utilities';
import {
  isFunction,
  isPrimitiveType,
} from '../../../../core/utilities/type-guards';
import { VicDimensionCategorical } from '../../../../data-dimensions/categorical/categorical';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { VicGeographiesTooltipOutput } from '../../../geographies-tooltip-data';
import { GeographiesLayer } from '../geographies-layer/geographies-layer';
import { VicGeographiesLabels } from '../labels/geographies-labels';
import { VicGeographiesGeojsonPropertiesLayerOptions } from './geojson-properties-layer-options';

const DEFAULT = {
  strokeColor: 'dimgray',
  strokeWidth: '1',
  fill: 'none',
  enableEffects: false,
};

export class VicGeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >
  extends GeographiesLayer<string, TProperties, TGeometry>
  implements
    VicGeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
{
  readonly categorical: VicDimensionCategorical<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private categoricalScale: any;
  override labels: VicGeographiesLabels<string, TProperties, TGeometry>;

  constructor(
    options?: Partial<
      VicGeographiesGeojsonPropertiesLayerOptions<TProperties, TGeometry>
    >
  ) {
    super();
    Object.assign(this, DEFAULT, options);
    this.initPropertiesFromGeographies();
  }

  private initPropertiesFromGeographies(): void {
    if (this.categorical) {
      this.categorical.setPropertiesFromData(this.geographies);
      this.categoricalScale = this.categorical.getScale();
    }
  }

  getFill(feature: VicGeographiesFeature<TProperties, TGeometry>): string {
    if (!this.categorical) {
      return DEFAULT.fill;
    }
    const featureIndex = this.featureIndexAccessor(feature);
    const defaultFill = this.categoricalScale(featureIndex);
    return this.categorical.fillPatterns
      ? PatternUtilities.getFill(
          feature,
          defaultFill,
          this.categorical.fillPatterns
        )
      : defaultFill;
  }

  getLabelColor(
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.Fill {
    const featureIndex = this.featureIndexAccessor(feature);
    const pathColor = this.getFill(feature);
    let fontColor: CSSType.Property.Fill;
    if (isFunction<CSSType.Property.Fill>(this.labels.color)) {
      fontColor = this.labels.color(featureIndex, pathColor);
    } else if (isPrimitiveType<CSSType.Property.Fill>(this.labels.color)) {
      fontColor = this.labels.color;
    }
    return fontColor;
  }

  getLabelFontWeight(
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.FontWeight {
    const featureIndex = this.featureIndexAccessor(feature);
    const pathColor = this.getFill(feature);
    let fontProperty: CSSType.Property.FontWeight;
    if (isFunction<CSSType.Property.FontWeight>(this.labels.fontWeight)) {
      fontProperty = this.labels.fontWeight(featureIndex, pathColor);
    } else if (
      isPrimitiveType<CSSType.Property.FontWeight>(this.labels.fontWeight)
    ) {
      fontProperty = this.labels.fontWeight;
    }
    return fontProperty;
  }

  getTooltipData(path: SVGPathElement): VicGeographiesTooltipOutput<undefined> {
    const feature = select(path).datum() as VicGeographiesFeature<
      TProperties,
      TGeometry
    >;
    const featureIndex = this.featureIndexAccessor(feature);
    const tooltipData: VicGeographiesTooltipOutput<undefined> = {
      datum: undefined,
      geography: featureIndex,
      attributeValue: undefined,
      color: this.getFill(feature),
    };

    return tooltipData;
  }
}

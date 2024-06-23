import * as CSSType from 'csstype';
import { InternMap, select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import {
  isFunction,
  isPrimitiveType,
} from '../../../core/utilities/type-guards';
import { PatternUtilities } from '../../../shared/pattern-utilities';
import { ValueUtilities } from '../../../shared/value-utilities';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesTooltipOutput } from '../../geographies-tooltip-data';
import { VicValuesBin } from '../dimensions/attribute-data-bin-types';
import { VicCategoricalAttributeDataDimension } from '../dimensions/categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from '../dimensions/custom-breaks-bins';
import { VicEqualNumObservationsAttributeDataDimension } from '../dimensions/equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimension } from '../dimensions/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from '../dimensions/no-bins';
import { VicGeographiesLabels } from './geographies-labels';
import { GeographiesLayer, GeographiesLayerOptions } from './geographies-layer';

const DEFAULT = {
  attributeData: new VicEqualValuesAttributeDataDimension(),
  nullColor: '#dcdcdc',
  strokeColor: 'dimgray',
  strokeWidth: '1',
  enableEffects: true,
};

/**
 * Configuration object for geographies that have attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface VicGeographiesDataLayerOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  attributeDimension:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  data: Datum[];
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
}

export class VicGeographiesDataLayer<
    Datum,
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >
  extends GeographiesLayer<Datum, TProperties, TGeometry>
  implements VicGeographiesDataLayerOptions<Datum, TProperties, TGeometry>
{
  readonly attributeDimension:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  readonly data: Datum[];
  override labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
  attributeValuesByGeographyIndex: InternMap<string, string | number>;
  datumsByGeographyIndex: InternMap<string, Datum>;

  constructor(
    options?: Partial<
      VicGeographiesDataLayerOptions<Datum, TProperties, TGeometry>
    >
  ) {
    super();
    Object.assign(this, DEFAULT, options);
    this.initPropertiesFromData();
  }

  initPropertiesFromData(): void {
    const uniqueDatums = this.getUniqueDatumsByGeoAccessor(this.data);
    this.attributeDimension.setPropertiesFromData(uniqueDatums);
    this.setAttributeDataMaps(uniqueDatums);
  }

  private getUniqueDatumsByGeoAccessor(data: Datum[]): Datum[] {
    const uniqueByGeoAccessor = (arr: Datum[], set = new Set()) =>
      arr.filter(
        (x) =>
          !set.has(this.attributeDimension.geoAccessor(x)) &&
          set.add(this.attributeDimension.geoAccessor(x))
      );
    return uniqueByGeoAccessor(data);
  }

  private setAttributeDataMaps(uniqueDatums: Datum[]): void {
    this.attributeValuesByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        const value = this.attributeDimension.valueAccessor(d);
        return [
          this.attributeDimension.geoAccessor(d),
          value === null || value === undefined ? undefined : value,
        ];
      })
    );
    this.datumsByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        return [this.attributeDimension.geoAccessor(d), d];
      })
    );
  }

  getFill(feature: VicGeographiesFeature<TProperties, TGeometry>): string {
    const geographyIndex = this.featureIndexAccessor(feature);
    return this.attributeDimension.fillPatterns
      ? this.getPatternFill(geographyIndex)
      : this.getAttributeFill(geographyIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPatternFill(geographyIndex: string): string {
    const datum = this.datumsByGeographyIndex.get(geographyIndex);
    const geographyFill = this.getAttributeFill(geographyIndex);
    const patterns = this.attributeDimension.fillPatterns;
    return PatternUtilities.getFill(datum, geographyFill, patterns);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAttributeFill(geographyIndex: string): string {
    const dataValue = this.attributeValuesByGeographyIndex.get(geographyIndex);
    return this.attributeDimension.getScale()(dataValue);
  }

  getLabelColor(
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.Fill {
    const featureIndex = this.featureIndexAccessor(feature);
    const pathColor = this.getFill(feature);
    let fontColor: CSSType.Property.Fill;
    if (isFunction<CSSType.Property.Fill>(this.labels.color)) {
      fontColor = this.labels.color(
        this.datumsByGeographyIndex.get(featureIndex),
        pathColor
      );
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
      fontProperty = this.labels.fontWeight(
        this.datumsByGeographyIndex.get(featureIndex),
        pathColor
      );
    } else if (
      isPrimitiveType<CSSType.Property.FontWeight>(this.labels.fontWeight)
    ) {
      fontProperty = this.labels.fontWeight;
    }
    return fontProperty;
  }

  getTooltipData(path: SVGPathElement): VicGeographiesTooltipOutput<Datum> {
    const feature = select(path).datum() as VicGeographiesFeature<
      TProperties,
      TGeometry
    >;
    const featureIndex = this.featureIndexAccessor(feature);
    const datum = this.datumsByGeographyIndex.get(featureIndex);
    const value = this.attributeValuesByGeographyIndex.get(featureIndex);
    const tooltipData: VicGeographiesTooltipOutput<Datum> = {
      datum,
      geography: this.attributeDimension.geoAccessor(datum),
      attributeValue: this.attributeDimension.formatFunction
        ? ValueUtilities.customFormat(
            datum,
            this.attributeDimension.formatFunction
          )
        : this.attributeDimension.binType !== VicValuesBin.categorical
        ? ValueUtilities.d3Format(
            value as number,
            this.attributeDimension.formatSpecifier
          )
        : (value as string),
      color: this.getAttributeFill(featureIndex),
    };

    return tooltipData;
  }
}

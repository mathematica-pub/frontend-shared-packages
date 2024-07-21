import * as CSSType from 'csstype';
import { InternMap, select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { PatternUtilities } from '../../../../core/utilities/pattern-utilities';
import {
  isFunction,
  isPrimitiveType,
} from '../../../../core/utilities/type-guards';
import { ValueUtilities } from '../../../../core/utilities/values';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { VicGeographiesTooltipOutput } from '../../../geographies-tooltip-data';
import { VicValuesBin } from '../../dimensions/attribute-data-bin-enums';
import { CategoricalBinsAttributeDataDimension } from '../../dimensions/categorical-bins/categorical-bins';
import { CustomBreaksBinsAttributeDataDimension } from '../../dimensions/custom-breaks/custom-breaks-bins';
import { EqualFrequenciesAttributeDataDimension } from '../../dimensions/equal-frequencies-bins/equal-frequencies-bins';
import { VicEqualValueRangesAttributeDataDimension } from '../../dimensions/equal-value-ranges-bins/equal-value-ranges-bins';
import { NoBinsAttributeDataDimension } from '../../dimensions/no-bins/no-bins';
import { GeographiesLayer } from '../geographies-layer/geographies-layer';
import { GeographiesLabels } from '../labels/geographies-labels';
import { GeographiesAttributeDataLayerOptions } from './attribute-data-layer-options';

const DEFAULT = {
  _nullColor: '#dcdcdc',
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
  _enableEffects: true,
};

export class GeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >
  extends GeographiesLayer<Datum, TProperties, TGeometry>
  implements
    GeographiesAttributeDataLayerOptions<Datum, TProperties, TGeometry>
{
  readonly attributeDimension:
    | CategoricalBinsAttributeDataDimension<Datum>
    | NoBinsAttributeDataDimension<Datum>
    | VicEqualValueRangesAttributeDataDimension<Datum>
    | EqualFrequenciesAttributeDataDimension<Datum>
    | CustomBreaksBinsAttributeDataDimension<Datum>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeScale: any;
  attributeValuesByGeographyIndex: InternMap<string, string | number>;
  readonly data: Datum[];
  datumsByGeographyIndex: InternMap<string, Datum>;
  geographyIndexAccessor: (d: Datum) => string;
  override labels: GeographiesLabels<Datum, TProperties, TGeometry>;

  constructor(
    options: GeographiesAttributeDataLayerOptions<Datum, TProperties, TGeometry>
  ) {
    super();
    Object.assign(this, DEFAULT, options);
    if (this.attributeDimension === undefined) {
      console.error('Attribute dimension is required for data layers');
    }
    if (this.geographyIndexAccessor === undefined) {
      console.error('Geography index accessor is required for data layers');
    }
    this.class = `vic-geographies-data-layer ${this.class ?? ''}`;
    this.initPropertiesFromData();
  }

  initPropertiesFromData(): void {
    const uniqueDatums = this.getUniqueDatumsByGeoAccessor(this.data);
    this.attributeDimension.setPropertiesFromData(uniqueDatums);
    this.setAttributeDataMaps(uniqueDatums);
    this.attributeScale = this.attributeDimension.getScale();
  }

  private getUniqueDatumsByGeoAccessor(data: Datum[]): Datum[] {
    const uniqueByGeoAccessor = (arr: Datum[], set = new Set()) =>
      arr.filter(
        (x) =>
          !set.has(this.geographyIndexAccessor(x)) &&
          set.add(this.geographyIndexAccessor(x))
      );
    return uniqueByGeoAccessor(data);
  }

  private setAttributeDataMaps(uniqueDatums: Datum[]): void {
    this.attributeValuesByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        const value = this.attributeDimension.valueAccessor(d);
        return [
          this.geographyIndexAccessor(d),
          value === null || value === undefined ? undefined : value,
        ];
      })
    );
    this.datumsByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        return [this.geographyIndexAccessor(d), d];
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
    return this.attributeScale(dataValue);
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
      geography: this.geographyIndexAccessor(datum),
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

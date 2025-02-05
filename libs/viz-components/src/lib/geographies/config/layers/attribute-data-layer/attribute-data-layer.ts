import { InternMap, select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { FillDefinition } from 'libs/viz-components/src/public-api';
import { FillUtilities } from '../../../../core/utilities/fill-utilities';
import { ValueUtilities } from '../../../../core/utilities/values';
import { GeographiesFeature } from '../../../geographies-feature';
import {
  GeographiesLayer,
  GeographiesTooltipDatum,
} from '../geographies-layer/geographies-layer';
import { GeographiesAttributeDataLayerOptions } from './attribute-data-layer-options';
import { BinStrategy } from './dimensions/attribute-data-bin-enums';
import { CategoricalBinsAttributeDataDimension } from './dimensions/categorical-bins/categorical-bins';
import { CustomBreaksBinsAttributeDataDimension } from './dimensions/custom-breaks/custom-breaks-bins';
import { EqualFrequenciesAttributeDataDimension } from './dimensions/equal-frequencies-bins/equal-frequencies-bins';
import { EqualValueRangesAttributeDataDimension } from './dimensions/equal-value-ranges-bins/equal-value-ranges-bins';
import { NoBinsAttributeDataDimension } from './dimensions/no-bins/no-bins';

const DEFAULT = {
  _nullColor: '#dcdcdc',
  _strokeColor: 'dimgray',
  _strokeWidth: '1',
  _enableEventActions: true,
};

export class GeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
  >
  extends GeographiesLayer<Datum, TProperties, TGeometry>
  implements
    GeographiesAttributeDataLayerOptions<Datum, TProperties, TGeometry>
{
  readonly attributeDimension:
    | CategoricalBinsAttributeDataDimension<Datum>
    | NoBinsAttributeDataDimension<Datum>
    | EqualValueRangesAttributeDataDimension<Datum>
    | EqualFrequenciesAttributeDataDimension<Datum>
    | CustomBreaksBinsAttributeDataDimension<Datum>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeScale: any;
  attributeValuesByGeographyIndex: InternMap<string, string | number>;
  readonly customFills: FillDefinition<Datum>[];
  readonly data: Datum[];
  datumsByGeographyIndex: InternMap<string, Datum>;
  geographyIndexAccessor: (d: Datum) => string;
  readonly marksClass: string;
  readonly mixBlendMode: string;

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

  getFill(feature: GeographiesFeature<TProperties, TGeometry>): string {
    const geographyIndex = this.featureIndexAccessor(feature);
    return this.customFills
      ? this.getPatternFill(geographyIndex)
      : this.getAttributeFill(geographyIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPatternFill(geographyIndex: string): string {
    const datum = this.datumsByGeographyIndex.get(geographyIndex);
    const geographyFill = this.getAttributeFill(geographyIndex);
    return FillUtilities.getFill(datum, geographyFill, this.customFills);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAttributeFill(geographyIndex: string): string {
    const dataValue = this.attributeValuesByGeographyIndex.get(geographyIndex);
    return this.attributeScale(dataValue);
  }

  getTooltipData(path: SVGPathElement): GeographiesTooltipDatum<Datum> {
    const feature = select(path).datum() as GeographiesFeature<
      TProperties,
      TGeometry
    >;
    const featureIndex = this.featureIndexAccessor(feature);
    const datum = this.datumsByGeographyIndex.get(featureIndex);
    const value = this.attributeValuesByGeographyIndex.get(featureIndex);
    const tooltipData: GeographiesTooltipDatum<Datum> = {
      datum,
      geography: this.geographyIndexAccessor(datum),
      attributeValue: this.attributeDimension.formatFunction
        ? ValueUtilities.customFormat(
            datum,
            this.attributeDimension.formatFunction
          )
        : this.attributeDimension.dimensionType !== 'ordinal' &&
            this.attributeDimension.binType !== BinStrategy.categorical
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

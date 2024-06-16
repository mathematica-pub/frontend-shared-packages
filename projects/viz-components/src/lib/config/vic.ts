import {
  GeoJsonProperties,
  GeometryObject as Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { VicOrdinalAxisOptions } from '../axes/ordinal/ordinal-axis.config';
import { VicQuantitativeAxisOptions } from '../axes/quantitative/quantitative-axis.config';
import { VicXOrdinalAxisConfig } from '../axes/x-ordinal/x-ordinal-axis.config';
import { VicXQuantitativeAxisConfig } from '../axes/x-quantitative/x-quantitative-axis.config';
import { VicXAxisOptions } from '../axes/x/x-axis.config';
import { VicYOrdinalAxisConfig } from '../axes/y-ordinal/y-ordinal-axis.config';
import { VicYQuantitativeAxisConfig } from '../axes/y-quantitative-axis/y-quantitative-axis.config';
import { VicYAxisOptions } from '../axes/y/y-axis.config';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
  VicBarsDimensions,
} from '../bars/config/bars-dimensions';
import { VicBarsLabels } from '../bars/config/bars-labels';
import { VicBarsConfig, VicBarsOptions } from '../bars/config/bars.config';
import { VicDataValue } from '../core/types/values';
import {
  VicCategoricalDimensionOptions,
  VicDimensionCategorical,
} from '../data-dimensions/categorical/categorical';
import {
  VicDimensionDate,
  VicDimensionDateOptions,
} from '../data-dimensions/date/date-dimension';
import {
  VicDimensionOrdinal,
  VicDimensionOrdinalOptions,
} from '../data-dimensions/ordinal/ordinal';
import {
  PercentOverDomainPaddingOptions,
  VicPercentOverDomainPadding,
} from '../data-dimensions/quantitative/domain-padding/percent-over';
import {
  VicPixelDomainPadding,
  VicPixelDomainPaddingOptions,
} from '../data-dimensions/quantitative/domain-padding/pixel';
import {
  VicRoundUpToIntervalDomainPadding,
  VicRoundUpToIntervalDomainPaddingOptions,
} from '../data-dimensions/quantitative/domain-padding/round-to-interval';
import {
  VicRoundUpDomainPadding,
  VicRoundUpDomainPaddingOptions,
} from '../data-dimensions/quantitative/domain-padding/round-up';
import {
  VicDimensionQuantitative,
  VicDimensionQuantitativeOptions,
} from '../data-dimensions/quantitative/quantitative';
import {
  VicCategoricalAttributeDataDimension,
  VicCategoricalAttributeDataDimensionOptions,
} from '../geographies/config/dimensions/categorical-bins';
import {
  VicCustomBreaksAttributeDataDimension,
  VicCustomBreaksAttributeDataDimensionOptions,
} from '../geographies/config/dimensions/custom-breaks-bins';
import {
  VicGeographiesDataLayer,
  VicGeographiesDataLayerOptions,
} from '../geographies/config/dimensions/data-layer';
import {
  VicEqualNumObservationsAttributeDataDimension,
  VicEqualNumObservationsAttributeDataDimensionOptions,
} from '../geographies/config/dimensions/equal-num-observations-bins';
import {
  VicEqualValuesAttributeDataDimension,
  VicEqualValuesAttributeDataDimensionOptions,
} from '../geographies/config/dimensions/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from '../geographies/config/dimensions/no-bins';
import {
  VicGeographiesNoDataLayer,
  VicGeographiesNoDataLayerOptions,
} from '../geographies/config/dimensions/no-data-layer';
import {
  VicGeographiesLabels,
  VicGeographiesLabelsOptions,
} from '../geographies/config/geographies-labels';
import {
  VicGeographiesConfig,
  VicGeographiesOptions,
} from '../geographies/config/geographies.config';
import {
  VicGroupedBarsConfig,
  VicGroupedBarsOptions,
} from '../grouped-bars/config/grouped-bars.config';
import { VicLinesConfig, VicLinesOptions } from '../lines/config/lines.config';
import {
  VicPointMarkers,
  VicPointMarkersOptions,
} from '../lines/config/point-markers';
import { VicStroke, VicStrokeOptions } from '../lines/config/stroke';
import {
  VicStackedAreaConfig,
  VicStackedAreaOptions,
} from '../stacked-area/config/stacked-area.config';
import {
  VicStackedBarsConfig,
  VicStackedBarsOptions,
} from '../stacked-bars/config/stacked-bars.config';

export class Vic {
  static axisXOrdinal<TickValue extends VicDataValue>(
    options?: Partial<VicXAxisOptions<TickValue>> &
      Partial<VicOrdinalAxisOptions<TickValue>>
  ): VicXOrdinalAxisConfig<TickValue> {
    return new VicXOrdinalAxisConfig(options);
  }

  static axisXQuantitative<TickValue extends VicDataValue>(
    options?: Partial<VicXAxisOptions<TickValue>> &
      Partial<VicQuantitativeAxisOptions<TickValue>>
  ): VicXQuantitativeAxisConfig<TickValue> {
    return new VicXQuantitativeAxisConfig(options);
  }

  static axisYOrdinal<TickValue extends VicDataValue>(
    options?: Partial<
      VicYAxisOptions<TickValue> & Partial<VicOrdinalAxisOptions<TickValue>>
    >
  ): VicYOrdinalAxisConfig<TickValue> {
    return new VicYOrdinalAxisConfig(options);
  }

  static axisYQuantitative<TickValue extends VicDataValue>(
    options?: Partial<
      VicYAxisOptions<TickValue> &
        Partial<VicQuantitativeAxisOptions<TickValue>>
    >
  ): VicYQuantitativeAxisConfig<TickValue> {
    return new VicYQuantitativeAxisConfig(options);
  }

  private static bars<Datum, TOrdinalValue extends VicDataValue>(
    dimensions: VicBarsDimensions,
    options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
  ): VicBarsConfig<Datum, TOrdinalValue> {
    return new VicBarsConfig(dimensions, options);
  }

  static barsHorizontal<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
  ): VicBarsConfig<Datum, TOrdinalValue> {
    return this.bars(HORIZONTAL_BARS_DIMENSIONS, options);
  }

  static barsLabels<Datum>(
    options: Partial<VicBarsLabels<Datum>>
  ): VicBarsLabels<Datum> {
    return new VicBarsLabels(options);
  }

  static barsVertical<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
  ): VicBarsConfig<Datum, TOrdinalValue> {
    return this.bars(VERTICAL_BARS_DIMENSIONS, options);
  }

  static dimensionCategorical<
    Datum,
    TCategoricalValue extends VicDataValue = string
  >(
    options?: Partial<VicCategoricalDimensionOptions<Datum, TCategoricalValue>>
  ): VicDimensionCategorical<Datum, TCategoricalValue> {
    return new VicDimensionCategorical(options);
  }

  static dimensionDate<Datum>(
    options: Partial<VicDimensionDateOptions<Datum>>
  ): VicDimensionDate<Datum> {
    return new VicDimensionDate(options);
  }

  static dimensionOrdinal<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicDimensionOrdinalOptions<Datum, TOrdinalValue>>
  ): VicDimensionOrdinal<Datum, TOrdinalValue> {
    return new VicDimensionOrdinal(options);
  }

  static dimensionQuantitative<Datum>(
    options: Partial<VicDimensionQuantitativeOptions<Datum>>
  ): VicDimensionQuantitative<Datum> {
    return new VicDimensionQuantitative(options);
  }

  static domainPaddingPercentOver(
    options?: Partial<PercentOverDomainPaddingOptions>
  ): VicPercentOverDomainPadding {
    return new VicPercentOverDomainPadding(options);
  }

  static domainPaddingPixel(
    options?: Partial<VicPixelDomainPaddingOptions>
  ): VicPixelDomainPadding {
    return new VicPixelDomainPadding(options);
  }

  static domainPaddingRoundUp(
    options?: Partial<VicRoundUpDomainPaddingOptions>
  ): VicRoundUpDomainPadding {
    return new VicRoundUpDomainPadding(options);
  }

  static domainPaddingRoundUpToInterval(
    options?: Partial<VicRoundUpToIntervalDomainPaddingOptions>
  ): VicRoundUpToIntervalDomainPadding {
    return new VicRoundUpToIntervalDomainPadding(options);
  }

  static geographies<
    Datum,
    TProperties extends GeoJsonProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >(
    options: Partial<VicGeographiesOptions<Datum, TProperties, TGeometry>>
  ): VicGeographiesConfig<Datum, TProperties, TGeometry> {
    return new VicGeographiesConfig(options);
  }

  static geographiesDataDimensionCategorical<
    Datum,
    RangeValue extends string | number = string
  >(
    options?: Partial<
      VicCategoricalAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ): VicCategoricalAttributeDataDimension<Datum, RangeValue> {
    return new VicCategoricalAttributeDataDimension<Datum, RangeValue>(options);
  }

  static geographiesDataDimensionCustomBreaks<
    Datum,
    RangeValue extends string | number = string
  >(
    options?: Partial<
      VicCustomBreaksAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ): VicCustomBreaksAttributeDataDimension<Datum, RangeValue> {
    return new VicCustomBreaksAttributeDataDimension<Datum, RangeValue>(
      options
    );
  }

  static geographiesDataDimensionEqualNumObservations<
    Datum,
    RangeValue extends string | number = string
  >(
    options?: Partial<
      VicEqualNumObservationsAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ): VicEqualNumObservationsAttributeDataDimension<Datum, RangeValue> {
    return new VicEqualNumObservationsAttributeDataDimension<Datum, RangeValue>(
      options
    );
  }

  static geographiesDataDimensionEqualValueRanges<
    Datum,
    RangeValue extends string | number = string
  >(
    options?: Partial<
      VicEqualValuesAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ): VicEqualValuesAttributeDataDimension<Datum, RangeValue> {
    return new VicEqualValuesAttributeDataDimension<Datum, RangeValue>(options);
  }

  static geographiesDataDimensionNoBins<Datum>(
    options?: Partial<VicNoBinsAttributeDataDimension<Datum>>
  ): VicNoBinsAttributeDataDimension<Datum> {
    return new VicNoBinsAttributeDataDimension<Datum>(options);
  }

  static geographiesDataLayer<
    Datum,
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >(
    options?: Partial<
      VicGeographiesDataLayerOptions<Datum, TProperties, TGeometry>
    >
  ): VicGeographiesDataLayer<Datum, TProperties, TGeometry> {
    return new VicGeographiesDataLayer(options);
  }

  static geographiesLabels<
    Datum,
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >(
    options?: Partial<
      VicGeographiesLabelsOptions<Datum, TProperties, TGeometry>
    >
  ): VicGeographiesLabels<Datum, TProperties, TGeometry> {
    return new VicGeographiesLabels(options);
  }

  static geographiesNoDataLayer<
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
    TCategoricalValue extends string = string
  >(
    options?: Partial<
      VicGeographiesNoDataLayerOptions<
        TProperties,
        TGeometry,
        TCategoricalValue
      >
    >
  ) {
    return new VicGeographiesNoDataLayer(options);
  }

  static groupedBarsHorizontal<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicGroupedBarsOptions<Datum, TOrdinalValue>>
  ): VicGroupedBarsConfig<Datum, TOrdinalValue> {
    const config = new VicGroupedBarsConfig(
      HORIZONTAL_BARS_DIMENSIONS,
      options
    );
    return config;
  }

  static groupedBarsVertical<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicGroupedBarsOptions<Datum, TOrdinalValue>>
  ): VicGroupedBarsConfig<Datum, TOrdinalValue> {
    const config = new VicGroupedBarsConfig(VERTICAL_BARS_DIMENSIONS, options);
    return config;
  }

  static lines<Datum>(
    options: Partial<VicLinesOptions<Datum>>
  ): VicLinesConfig<Datum> {
    return new VicLinesConfig(options);
  }

  static pointMarkers(options?: Partial<VicPointMarkersOptions>) {
    return new VicPointMarkers(options);
  }

  static stackedArea<Datum, TCategoricalValue extends VicDataValue>(
    options: Partial<VicStackedAreaOptions<Datum, TCategoricalValue>>
  ): VicStackedAreaConfig<Datum, TCategoricalValue> {
    return new VicStackedAreaConfig(options);
  }

  static stackedBarsHorizontal<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicStackedBarsOptions<Datum, TOrdinalValue>>
  ): VicStackedBarsConfig<Datum, TOrdinalValue> {
    return new VicStackedBarsConfig(HORIZONTAL_BARS_DIMENSIONS, options);
  }

  static stackedBarsVertical<Datum, TOrdinalValue extends VicDataValue>(
    options: Partial<VicStackedBarsOptions<Datum, TOrdinalValue>>
  ): VicStackedBarsConfig<Datum, TOrdinalValue> {
    return new VicStackedBarsConfig(VERTICAL_BARS_DIMENSIONS, options);
  }

  static stroke(options: Partial<VicStrokeOptions>) {
    return new VicStroke(options);
  }
}

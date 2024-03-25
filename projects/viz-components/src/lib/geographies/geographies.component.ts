import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import * as CSSType from 'csstype';
import {
  InternMap,
  InternSet,
  Selection,
  extent,
  geoPath,
  range,
  scaleLinear,
  select,
} from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { VicVariableType } from '../core/types/variable-type';
import { isFunction } from '../core/utilities/type-guards';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapDataMarksBase } from '../map-data-marks/map-data-marks-base';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { formatValue } from '../value-format/value-format';
import {
  GeographiesFeature,
  VicDataGeographyConfig,
  VicGeographiesConfig,
  VicGeographyLabelConfig,
  VicNoDataGeographyConfig,
  VicValuesBin,
} from './geographies.config';

export class MapDataValues {
  attributeValuesByGeographyIndex: InternMap;
  datumsByGeographyIndex: InternMap;
}

export const GEOGRAPHIES = new InjectionToken<
  GeographiesComponent<unknown, unknown>
>('GeographiesComponent');
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-geographies]',
  templateUrl: './geographies.component.html',
  styleUrls: ['./geographies.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: GeographiesComponent },
    {
      provide: GEOGRAPHIES,
      useExisting: GeographiesComponent,
    },
    {
      provide: ChartComponent,
      useExisting: MapChartComponent,
    },
  ],
})
export class GeographiesComponent<
  Datum,
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = MultiPolygon | Polygon
> extends MapDataMarksBase<Datum, VicGeographiesConfig<Datum, P, G>> {
  projection: any;
  path: any;
  values: MapDataValues = new MapDataValues();
  dataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  dataGeographies$: Observable<any> = this.dataGeographies.asObservable();
  noDataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  noDataGeographies$: Observable<any> = this.noDataGeographies.asObservable();

  constructor(public zone: NgZone, public elRef: ElementRef) {
    super();
  }

  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initAttributeDataScaleDomain();
    this.initAttributeDataScaleRange();
    this.setChartAttributeScaleAndConfig();
  }

  resizeMarks(): void {
    this.setPropertiesFromRanges();
  }

  setValueArrays(): void {
    const uniqueByGeoAccessor = (arr: any[], set = new Set()) =>
      arr.filter(
        (x) =>
          !set.has(
            this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(x)
          ) &&
          set.add(
            this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(x)
          )
      );
    const uniqueDatums = uniqueByGeoAccessor(this.config.data);
    this.values.attributeValuesByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        const value =
          this.config.dataGeographyConfig.attributeDataConfig.valueAccessor(d);
        return [
          this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(d),
          value === null || value === undefined ? NaN : value,
        ];
      })
    );
    this.values.datumsByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        return [
          this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(d),
          d,
        ];
      })
    );
  }

  initAttributeDataScaleDomain(): void {
    if (
      this.config.dataGeographyConfig.attributeDataConfig.variableType ===
      VicVariableType.quantitative
    ) {
      this.setQuantitativeDomainAndBinsForBinType();
    }
    if (
      this.config.dataGeographyConfig.attributeDataConfig.variableType ===
      VicVariableType.categorical
    ) {
      this.setCategoricalDomain();
    }
  }

  setQuantitativeDomainAndBinsForBinType(): void {
    if (
      this.config.dataGeographyConfig.attributeDataConfig.binType ===
      VicValuesBin.equalNumObservations
    ) {
      this.config.dataGeographyConfig.attributeDataConfig.domain = Array.from(
        this.values.attributeValuesByGeographyIndex.values()
      );
    } else if (
      this.config.dataGeographyConfig.attributeDataConfig.binType ===
      VicValuesBin.customBreaks
    ) {
      this.config.dataGeographyConfig.attributeDataConfig.domain =
        this.config.dataGeographyConfig.attributeDataConfig.breakValues.slice(
          1
        );
      this.config.dataGeographyConfig.attributeDataConfig.numBins =
        this.config.dataGeographyConfig.attributeDataConfig.breakValues.length -
        1;
    } else {
      // no bins, equal interval
      let domainValues: any[];
      if (
        this.config.dataGeographyConfig.attributeDataConfig.domain === undefined
      ) {
        domainValues = extent(
          Array.from(this.values.attributeValuesByGeographyIndex.values())
        );
      } else {
        domainValues =
          this.config.dataGeographyConfig.attributeDataConfig.domain;
      }
      this.config.dataGeographyConfig.attributeDataConfig.domain =
        extent(domainValues);
    }

    if (
      // do we need to do this for equal num observations?
      this.config.dataGeographyConfig.attributeDataConfig.binType ===
      VicValuesBin.equalValueRanges
    ) {
      if (this.attributeDataValueFormatIsInteger()) {
        this.validateNumBinsAndDomainForIntegerValues();
      }
    }
  }

  attributeDataValueFormatIsInteger(): boolean {
    const formatString =
      this.config.dataGeographyConfig.attributeDataConfig.valueFormat;
    return (
      formatString &&
      typeof formatString === 'string' &&
      formatString.includes('0f')
    );
  }

  validateNumBinsAndDomainForIntegerValues(): void {
    const domain = this.config.dataGeographyConfig.attributeDataConfig.domain;
    const dataRange = [domain[0], domain[domain.length - 1]].map(
      (x) =>
        +formatValue(
          x,
          this.config.dataGeographyConfig.attributeDataConfig.valueFormat
        )
    );
    const numDiscreteValues = Math.abs(dataRange[1] - dataRange[0]) + 1;
    if (
      numDiscreteValues <
      this.config.dataGeographyConfig.attributeDataConfig.numBins
    ) {
      this.config.dataGeographyConfig.attributeDataConfig.numBins =
        numDiscreteValues;
      this.config.dataGeographyConfig.attributeDataConfig.domain = [
        dataRange[0],
        dataRange[1] + 1,
      ];
    }
  }

  setCategoricalDomain(): void {
    const domainValues =
      this.config.dataGeographyConfig.attributeDataConfig.domain ??
      Array.from(this.values.attributeValuesByGeographyIndex.values());
    this.config.dataGeographyConfig.attributeDataConfig.domain = new InternSet(
      domainValues
    );
  }

  initAttributeDataScaleRange(): void {
    if (this.shouldCalculateBinColors()) {
      const binIndicies = range(
        this.config.dataGeographyConfig.attributeDataConfig.numBins
      );
      const colorGenerator = scaleLinear<string>()
        .domain(extent(binIndicies))
        .range(this.config.dataGeographyConfig.attributeDataConfig.colors)
        .interpolate(
          this.config.dataGeographyConfig.attributeDataConfig.interpolator
        );
      this.config.dataGeographyConfig.attributeDataConfig.range =
        binIndicies.map((i) => colorGenerator(i));
    } else {
      let colors = this.config.dataGeographyConfig.attributeDataConfig.colors;
      if (
        this.config.dataGeographyConfig.attributeDataConfig.variableType ===
        VicVariableType.categorical
      ) {
        colors = colors.slice(
          0,
          this.config.dataGeographyConfig.attributeDataConfig.domain.length
        );
      }
      this.config.dataGeographyConfig.attributeDataConfig.range = colors;
    }
  }

  shouldCalculateBinColors(): boolean {
    return (
      this.config.dataGeographyConfig.attributeDataConfig.numBins &&
      this.config.dataGeographyConfig.attributeDataConfig.numBins > 1 &&
      this.config.dataGeographyConfig.attributeDataConfig.colors.length !==
        this.config.dataGeographyConfig.attributeDataConfig.numBins
    );
  }

  setChartAttributeScaleAndConfig(): void {
    const scale = this.getAttributeDataScale();
    this.zone.run(() => {
      this.chart.updateAttributeDataScale(scale);
      this.chart.updateAttributeDataConfig(
        this.config.dataGeographyConfig.attributeDataConfig
      );
    });
  }

  setPropertiesFromRanges(): void {
    this.setProjection();
    this.setPath();
  }

  setProjection(): void {
    this.projection = this.config.projection.fitSize(
      [this.ranges.x[1], this.ranges.y[0]],
      this.config.boundary
    );
  }

  setPath(): void {
    this.path = geoPath().projection(this.projection);
  }

  getAttributeDataScale(): any {
    if (
      this.config.dataGeographyConfig.attributeDataConfig.variableType ===
        VicVariableType.quantitative &&
      this.config.dataGeographyConfig.attributeDataConfig.binType ===
        VicValuesBin.none
    ) {
      return this.setColorScaleWithColorInterpolator();
    } else {
      return this.setColorScaleWithoutColorInterpolator();
    }
  }

  setColorScaleWithColorInterpolator(): any {
    return this.config.dataGeographyConfig.attributeDataConfig
      .colorScale()
      .domain(this.config.dataGeographyConfig.attributeDataConfig.domain)
      .range(this.config.dataGeographyConfig.attributeDataConfig.range)
      .unknown(this.config.dataGeographyConfig.nullColor)
      .interpolate(
        this.config.dataGeographyConfig.attributeDataConfig.interpolator
      );
  }

  setColorScaleWithoutColorInterpolator(): any {
    return this.config.dataGeographyConfig.attributeDataConfig
      .colorScale()
      .domain(this.config.dataGeographyConfig.attributeDataConfig.domain)
      .range(this.config.dataGeographyConfig.attributeDataConfig.range)
      .unknown(this.config.dataGeographyConfig.nullColor);
  }

  drawMarks(): void {
    this.zone.run(() => {
      this.drawMap(this.chart.transitionDuration);
      this.updateGeographyElements();
    });
  }

  drawMap(transitionDuration): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration);

    if (this.config.dataGeographyConfig) {
      this.drawDataLayer(t);
    }
    if (this.config.noDataGeographiesConfigs) {
      this.drawNoDataLayers(t);
    }
  }

  drawDataLayer(t: any): void {
    const dataLayers = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, VicDataGeographyConfig<Datum, P, G>>(
        '.vic-map-layer.vic-data'
      )
      .data<VicDataGeographyConfig<Datum, P, G>>([
        this.config.dataGeographyConfig,
      ])
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    const dataGeographyGroups = dataLayers
      .selectAll<SVGGElement, GeographiesFeature<P, G>>('.geography-g')
      .data<GeographiesFeature<P, G>>((layer) => layer.geographies)
      .join(
        (enter) => enter.append('g').attr('class', 'geography-g'),
        (update) => update,
        (exit) => exit.remove()
      );

    dataGeographyGroups
      .selectAll<SVGPathElement, GeographiesFeature<P, G>>('path')
      .data<GeographiesFeature<P, G>>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', this.path)
            .attr('stroke', this.config.dataGeographyConfig.strokeColor)
            .attr('stroke-width', this.config.dataGeographyConfig.strokeWidth)
            .attr('fill', (d) =>
              this.config.dataGeographyConfig.attributeDataConfig
                .patternPredicates
                ? this.getPatternFill(this.config.featureIndexAccessor(d))
                : this.getFill(this.config.featureIndexAccessor(d))
            ),
        (update) =>
          update.call((update) =>
            update
              .attr('d', this.path)
              .attr('stroke', this.config.dataGeographyConfig.strokeColor)
              .attr('stroke-width', this.config.dataGeographyConfig.strokeWidth)
              .transition(t)
              .attr('fill', (d) =>
                this.config.dataGeographyConfig.attributeDataConfig
                  .patternPredicates
                  ? this.getPatternFill(this.config.featureIndexAccessor(d))
                  : this.getFill(this.config.featureIndexAccessor(d))
              )
          ),
        (exit) => exit.remove()
      );

    if (this.config.dataGeographyConfig.labels) {
      this.drawLabels(
        dataGeographyGroups,
        t,
        this.config.dataGeographyConfig.labels
      );
    }
  }

  drawNoDataLayers(t: any): void {
    const noDataLayers = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, VicNoDataGeographyConfig<Datum, P, G>>(
        '.vic-map-layer.vic-no-data'
      )
      .data<VicNoDataGeographyConfig<Datum, P, G>>(
        this.config.noDataGeographiesConfigs
      )
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-no-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    this.config.noDataGeographiesConfigs.forEach((config, index) => {
      const noDataGeographyGroups = noDataLayers
        .filter((d, i) => i === index)
        .selectAll<SVGGElement, GeographiesFeature<P, G>>(
          '.no-data-geography-g'
        )
        .data<GeographiesFeature<P, G>>((layer) => layer.geographies)
        .join(
          (enter) => enter.append('g').attr('class', 'no-data-geography-g'),
          (update) => update,
          (exit) => exit.remove()
        );

      noDataGeographyGroups
        .selectAll<SVGPathElement, GeographiesFeature<P, G>>('path')
        .data<GeographiesFeature<P, G>>((d) => [d])
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('d', this.path)
              .attr('stroke', config.strokeColor)
              .attr('stroke-width', config.strokeWidth)
              .attr('fill', this.getNoDataGeographyPatternFill(config)),
          (update) =>
            update
              .attr('d', this.path)
              .attr('fill', this.getNoDataGeographyPatternFill(config)),
          (exit) => exit.remove()
        );

      if (config.labels) {
        this.drawLabels(noDataGeographyGroups, t, config.labels);
      }
    });
  }

  getFill(geographyIndex: string | number): string {
    const dataValue =
      this.values.attributeValuesByGeographyIndex.get(geographyIndex);
    return this.attributeDataScale(dataValue);
  }

  getPatternFill(geographyIndex: string | number): string {
    const datum = this.values.datumsByGeographyIndex.get(geographyIndex);
    const color = this.attributeDataScale(
      this.values.attributeValuesByGeographyIndex.get(geographyIndex)
    );
    const predicates =
      this.config.dataGeographyConfig.attributeDataConfig.patternPredicates;
    return PatternUtilities.getPatternFill(datum, color, predicates);
  }

  getNoDataGeographyPatternFill(
    config: VicNoDataGeographyConfig<Datum, P, G>
  ): string {
    return config.patternName ? `url(#${config.patternName})` : config.fill;
  }

  drawLabels(
    features: Selection<
      SVGGElement,
      GeographiesFeature<P, G>,
      SVGGElement,
      | VicNoDataGeographyConfig<Datum, P, G>
      | VicDataGeographyConfig<Datum, P, G>
    >,
    t: any,
    labelsConfig: VicGeographyLabelConfig<Datum, P, G>
  ): void {
    features
      .filter((d, i) => labelsConfig.display(d))
      .selectAll('.vic-geography-label')
      .remove();

    features
      .filter((d) => labelsConfig.display(d))
      .selectAll<SVGTextElement, GeographiesFeature<P, G>>(
        '.vic-geography-label'
      )
      .data<GeographiesFeature<P, G>>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'vic-geography-label')
            .attr('text-anchor', labelsConfig.textAnchor)
            .attr('alignment-baseline', labelsConfig.alignmentBaseline)
            .attr('dominant-baseline', labelsConfig.dominantBaseline)
            .style('cursor', labelsConfig.cursor)
            .attr('pointer-events', labelsConfig.pointerEvents)
            .text((d) => labelsConfig.valueAccessor(d))
            .attr('x', (d) => this.getLabelPosition(d, labelsConfig)[0])
            .attr('y', (d) => this.getLabelPosition(d, labelsConfig)[1])
            .attr('font-size', labelsConfig.fontScale(this.ranges.x[1]))
            .attr('fill', (d) =>
              this.getLabelColor(
                this.config.featureIndexAccessor(d),
                labelsConfig
              )
            )
            .attr('font-weight', (d) =>
              this.getLabelFontWeight(
                this.config.featureIndexAccessor(d),
                labelsConfig
              )
            ),
        (update) =>
          update.call((update) =>
            update
              .text((d) => labelsConfig.valueAccessor(d))
              .attr('y', (d) => this.getLabelPosition(d, labelsConfig).y)
              .attr('x', (d) => this.getLabelPosition(d, labelsConfig).x)
              .attr('font-size', labelsConfig.fontScale(this.ranges.x[1]))
              .transition(t as any)
              .attr('fill', (d) =>
                this.getLabelColor(
                  this.config.featureIndexAccessor(d),
                  labelsConfig
                )
              )
              .attr('font-weight', (d) =>
                this.getLabelFontWeight(
                  this.config.featureIndexAccessor(d),
                  labelsConfig
                )
              )
          ),
        (exit) => exit.remove()
      );
  }

  getLabelPosition(
    d: GeographiesFeature<P, G>,
    config: VicGeographyLabelConfig<Datum, P, G>
  ): { x: number; y: number } {
    if (!this.path || !this.projection) return { x: 0, y: 0 };
    return config.position(d, this.path, this.projection);
  }

  getLabelColor(
    geographyIndex: string | number,
    config: VicGeographyLabelConfig<Datum, P, G>
  ): CSSType.Property.Fill {
    const pathColor = this.getFill(geographyIndex);
    let fontColor: CSSType.Property.Fill;
    if (isFunction(config.color)) {
      fontColor = config.color(
        this.values.datumsByGeographyIndex.get(geographyIndex)
      );
    } else {
      fontColor = config.color;
    }
    if (config.autoColorByContrast) {
      fontColor =
        config.autoColorByContrast.getAutoContrastLabelProperties(pathColor)[
          'color'
        ];
    }
    return fontColor;
  }

  getLabelFontWeight(
    geographyIndex: string | number,
    config: VicGeographyLabelConfig<Datum, P, G>
  ): CSSType.Property.FontWeight {
    const pathColor = this.getFill(geographyIndex);
    let fontProperty: CSSType.Property.FontWeight;
    if (isFunction(config.fontWeight)) {
      fontProperty = config.fontWeight(
        this.values.datumsByGeographyIndex.get(geographyIndex)
      );
    } else {
      fontProperty = config.fontWeight;
    }
    if (config.autoColorByContrast) {
      fontProperty =
        config.autoColorByContrast.getAutoContrastLabelProperties(pathColor)[
          'fontWeight'
        ];
    }
    return fontProperty;
  }

  updateGeographyElements(): void {
    const dataGeographies = select(this.elRef.nativeElement)
      .selectAll('.vic-map-layer.vic-data')
      .selectAll('path');
    const noDataGeographies = select(this.elRef.nativeElement)
      .selectAll('vic-map-layer.vic-no-data')
      .selectAll('path');
    this.dataGeographies.next(dataGeographies);
    this.noDataGeographies.next(noDataGeographies);
  }
}

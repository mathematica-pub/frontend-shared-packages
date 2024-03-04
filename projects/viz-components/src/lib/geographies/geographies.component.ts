import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import {
  InternMap,
  InternSet,
  Transition,
  extent,
  geoPath,
  map,
  range,
  scaleLinear,
  select,
} from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { VicVariableType } from '../core/types/variable-type';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapDataMarksBase } from '../map-data-marks/map-data-marks-base';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { formatValue } from '../value-format/value-format';
import {
  VicDataGeographyConfig,
  VicGeoJsonDefaultProperty,
  VicGeographiesConfig,
  VicNoDataGeographyConfig,
  VicValuesBin,
} from './geographies.config';

export class MapDataValues {
  attributeDataGeographies: any[];
  attributeDataValues: any[];
  indexMap: InternMap;
  geoJsonGeographies: any[];
}

export const GEOGRAPHIES = new InjectionToken<GeographiesComponent<unknown>>(
  'GeographiesComponent'
);
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
  T,
  P extends VicGeoJsonDefaultProperty = VicGeoJsonDefaultProperty
> extends MapDataMarksBase<T, VicGeographiesConfig<T, P>> {
  map: any;
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

  override initFromConfig(): void {
    this.setConfig();
    this.setPropertiesFromConfig();
    this.setPropertiesFromRanges();
    this.drawMarks();
  }

  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initAttributeDataScaleDomain();
    this.initAttributeDataScaleRange();
    this.setChartAttributeScaleAndConfig();
  }

  resizeMarks(): void {
    this.setPropertiesFromRanges();
    this.drawMarks();
  }

  setValueArrays(): void {
    this.values.attributeDataGeographies = map(
      this.config.data,
      this.config.dataGeographyConfig.attributeDataConfig.geoAccessor
    ).map((x) => {
      return typeof x === 'string' ? x.toLowerCase() : x;
    });
    this.values.attributeDataValues = map(
      this.config.data,
      this.config.dataGeographyConfig.attributeDataConfig.valueAccessor
    ).map((d) => (d === null ? NaN : d));
    this.values.indexMap = new InternMap(
      this.values.attributeDataGeographies.map((name, i) => [name, i])
    );
    this.values.geoJsonGeographies = this.config.dataGeographyConfig.geographies
      .map((feature) =>
        this.config.dataGeographyConfig.featureIndexAccessor(feature.properties)
      )
      .map((x) => {
        return typeof x === 'string' ? x.toLowerCase() : x;
      });
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
      this.config.dataGeographyConfig.attributeDataConfig.domain =
        this.values.attributeDataValues;
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
        domainValues = extent(this.values.attributeDataValues);
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
      this.values.attributeDataValues;
    this.config.dataGeographyConfig.attributeDataConfig.domain = new InternSet(
      domainValues
    );
  }

  initAttributeDataScaleRange(): void {
    if (this.shouldCalculateBinColors()) {
      const binIndicies = range(
        this.config.dataGeographyConfig.attributeDataConfig.numBins
      );
      const colorGenerator = scaleLinear()
        .domain(extent(binIndicies))
        .range(
          this.config.dataGeographyConfig.attributeDataConfig.colors as any
        )
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
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    if (this.config.dataGeographyConfig) {
      this.drawDataLayer(t);
    }
    if (this.config.noDataGeographiesConfigs) {
      this.drawNoDataLayers(t);
    }
  }

  drawDataLayer(t: any): void {
    this.map = select(this.elRef.nativeElement)
      .selectAll('.vic-map-layer.vic-data')
      .data([this.config.dataGeographyConfig])
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    this.map
      .selectAll('path')
      .data((layer: VicDataGeographyConfig<T, P>) => layer.geographies)
      .join(
        (enter) => {
          enter = enter.append('path');
          this.drawBasicPaths(enter);
        },
        (update) => this.drawBasicPaths(update),
        (exit) => exit.remove()
      );
  }

  drawBasicPaths(selection: any): any {
    return selection
      .attr('d', this.path)
      .attr('fill', (d, i) =>
        this.config.dataGeographyConfig.attributeDataConfig.patternPredicates
          ? this.getPatternFill(i)
          : this.getFill(i)
      )
      .attr('stroke', this.config.dataGeographyConfig.strokeColor)
      .attr('stroke-width', this.config.dataGeographyConfig.strokeWidth);
  }

  drawNoDataLayers(t: any): void {
    const noDataLayers = select(this.elRef.nativeElement)
      .selectAll('.vic-map-layer.vic-no-data')
      .data(this.config.noDataGeographiesConfigs)
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-no-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    noDataLayers
      .selectAll('path')
      .data((layer: VicNoDataGeographyConfig) => layer.geographies)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', this.path)
            .attr('fill', (d, i, nodes) =>
              this.getNoDataGeographyPatternFill(nodes[i])
            )
            .attr(
              'stroke',
              (d, i, nodes) => this.getConfigFromNode(nodes[i]).strokeColor
            )
            .attr(
              'stroke-width',
              (d, i, nodes) => this.getConfigFromNode(nodes[i]).strokeWidth
            ),
        (update) =>
          update
            .attr('d', this.path)
            .attr('fill', (d, i, nodes) =>
              this.getNoDataGeographyPatternFill(nodes[i])
            ),
        (exit) => exit.remove()
      );
  }

  getConfigFromNode(node: any): any {
    const config = select(node.parentNode).datum() as any;
    return config;
  }

  getFill(i: number): string {
    const convertedIndex = this.getValueIndexFromDataGeographyIndex(i);
    const dataValue = this.values.attributeDataValues[convertedIndex];
    return this.attributeDataScale(dataValue);
  }

  getPatternFill(i: number): string {
    const convertedIndex = this.getValueIndexFromDataGeographyIndex(i);
    const dataValue = this.values.attributeDataValues[convertedIndex];
    const datum = this.config.data[convertedIndex];
    const color = this.attributeDataScale(dataValue);
    const predicates =
      this.config.dataGeographyConfig.attributeDataConfig.patternPredicates;
    return PatternUtilities.getPatternFill(datum, color, predicates);
  }

  getNoDataGeographyPatternFill(node: any): string {
    const config: VicNoDataGeographyConfig = this.getConfigFromNode(node);
    return config.patternName ? `url(#${config.patternName})` : config.fill;
  }

  getValueIndexFromDataGeographyIndex(i: number): number {
    const geoName = this.values.geoJsonGeographies[i];
    return this.values.indexMap.get(geoName);
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

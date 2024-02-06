import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import type * as CSSType from 'csstype';
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
import { Feature, MultiPolygon } from 'geojson';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { ChartComponent, Ranges } from '../chart/chart.component';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapContent } from '../map-chart/map-content';
import { ColorUtilities } from '../shared/color-utilities.class';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { formatValue } from '../value-format/value-format';
import {
  VicDataGeographyConfig,
  VicGeographiesConfig,
  VicGeographiesLabelsAutoColor,
  VicGeographiesLabelsAutoColorProperties,
  VicGeographyLabelConfig,
  VicNoDataGeographyConfig,
} from './geographies.config';

export class MapDataValues {
  attributeDataValues: any[];
  geoDataValueMap: InternMap;
  geoDatumValueMap: InternMap;
}

export const GEOGRAPHIES = new InjectionToken<GeographiesComponent>(
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
export class GeographiesComponent
  extends MapContent
  implements DataMarks, OnChanges, OnInit
{
  @Input() config: VicGeographiesConfig;
  ranges: Ranges;
  map: any;
  projection: any;
  path: any;
  values: MapDataValues = new MapDataValues();
  dataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  dataGeographies$: Observable<any> = this.dataGeographies.asObservable();
  noDataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  noDataGeographies$: Observable<any> = this.noDataGeographies.asObservable();

  constructor(
    public zone: NgZone,
    public elRef: ElementRef,
    chart: MapChartComponent
  ) {
    super(chart);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScalesAndConfig();
    this.setMethodsFromConfigAndDraw();
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

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.ranges = ranges;
      if (this.attributeDataScale) {
        this.resizeMarks();
      }
    });
  }

  setScaleAndConfig(scale: any): void {
    this.attributeDataScale = scale;
  }

  resizeMarks(): void {
    this.setProjection();
    this.setPath();
    this.drawMarks(this.chart.transitionDuration);
  }

  setMethodsFromConfigAndDraw(): void {
    this.setProjection();
    this.setPath();
    this.setValueArrays();
    this.initAttributeDataScaleDomain();
    this.initAttributeDataScaleRange();
    this.initAttributeDataScaleAndUpdateChart();
    this.drawMarks(this.chart.transitionDuration);
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

  setValueArrays(): void {
    const attributeDataGeographies = map(
      this.config.data,
      this.config.dataGeographyConfig.attributeDataConfig.geoAccessor
    );
    this.values.attributeDataValues = map(
      this.config.data,
      this.config.dataGeographyConfig.attributeDataConfig.valueAccessor
    ).map((d) => (d === null ? NaN : d));
    this.values.geoDataValueMap = new InternMap(
      attributeDataGeographies.map((name, i) => {
        return [name, this.values.attributeDataValues[i]];
      })
    );
    this.values.geoDatumValueMap = new InternMap(
      attributeDataGeographies.map((name, i) => {
        return [name, this.config.data[i]];
      })
    );
  }

  initAttributeDataScaleDomain(): void {
    if (
      this.config.dataGeographyConfig.attributeDataConfig.valueType ===
      'quantitative'
    ) {
      this.setQuantitativeDomainAndBinsForBinType();
    }
    if (
      this.config.dataGeographyConfig.attributeDataConfig.valueType ===
      'categorical'
    ) {
      this.setCategoricalDomain();
    }
  }

  setQuantitativeDomainAndBinsForBinType(): void {
    if (
      this.config.dataGeographyConfig.attributeDataConfig.binType ===
      'equal num observations'
    ) {
      this.config.dataGeographyConfig.attributeDataConfig.domain =
        this.values.attributeDataValues;
    } else if (
      this.config.dataGeographyConfig.attributeDataConfig.binType ===
      'custom breaks'
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
      'equal value ranges'
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
        this.config.dataGeographyConfig.attributeDataConfig.valueType ===
        'categorical'
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

  initAttributeDataScaleAndUpdateChart(): void {
    let scale;
    if (
      this.config.dataGeographyConfig.attributeDataConfig.valueType ===
        'quantitative' &&
      this.config.dataGeographyConfig.attributeDataConfig.binType === 'none'
    ) {
      scale = this.setColorScaleWithColorInterpolator();
    } else {
      scale = this.setColorScaleWithoutColorInterpolator();
    }
    this.zone.run(() => {
      this.chart.updateAttributeDataScale(scale);
      this.chart.updateAttributeDataConfig(
        this.config.dataGeographyConfig.attributeDataConfig
      );
    });
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

  drawMarks(transitionDuration: number): void {
    this.zone.run(() => {
      this.drawMap(transitionDuration);
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

    const dataGeographyGroups = this.map
      .selectAll('.geography-g')
      .data((layer: VicDataGeographyConfig) => layer.geographies)
      .join(
        (enter) => enter.append('g').attr('class', 'geography-g'),
        (update) => update,
        (exit) => exit.remove()
      );

    dataGeographyGroups
      .selectAll('path')
      .data((d: Feature) => [d])
      .join(
        (enter) => {
          enter = enter.append('path');
          this.drawBasicPaths(enter);
        },
        (update) => this.drawBasicPaths(update),
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

  drawBasicPaths(selection: any): any {
    return selection
      .attr('d', this.path)
      .attr('fill', (d) =>
        this.config.dataGeographyConfig.attributeDataConfig.patternPredicates
          ? this.getPatternFill(d)
          : this.getFill(d)
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

    this.config.noDataGeographiesConfigs.forEach((config, index) => {
      const noDataGeographyGroups = noDataLayers
        .filter((d, i) => i === index)
        .selectAll('.no-data-geography-g')
        .data((layer: VicNoDataGeographyConfig) => layer.geographies)
        .join(
          (enter) => enter.append('g').attr('class', 'no-data-geography-g'),
          (update) => update,
          (exit) => exit.remove()
        );

      noDataGeographyGroups
        .selectAll('path')
        .data((d) => [d])
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('d', this.path)
              .attr('fill', this.getNoDataGeographyPatternFill(config))
              .attr('stroke', config.strokeColor)
              .attr('stroke-width', config.strokeWidth),
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

  getFill(d: Feature): string {
    const dataValue = this.values.geoDataValueMap.get(
      this.config.dataGeographyConfig.valueAccessor(d)
    );
    return this.attributeDataScale(dataValue);
  }

  getPatternFill(d: Feature): string {
    const geography = this.config.dataGeographyConfig.valueAccessor(d);
    const dataValue = this.values.geoDataValueMap.get(geography);
    const datum = this.values.geoDatumValueMap.get(geography);
    const color = this.attributeDataScale(dataValue);
    const predicates =
      this.config.dataGeographyConfig.attributeDataConfig.patternPredicates;
    return PatternUtilities.getPatternFill(datum, color, predicates);
  }

  getNoDataGeographyPatternFill(config: VicNoDataGeographyConfig): string {
    return config.patternName ? `url(#${config.patternName})` : config.fill;
  }

  drawLabels(layer: any, t: any, config: VicGeographyLabelConfig): void {
    layer
      .filter((d, i) => config.display(d, i))
      .selectAll('.vic-geography-label')
      .remove();

    layer
      .filter((d, i) => config.display(d, i))
      .selectAll('.vic-geography-label')
      .data((d: Feature) => [d])
      .join(
        (enter: any) =>
          enter
            .append('text')
            .attr('class', 'vic-geography-label')
            .attr('text-anchor', config.textAnchor)
            .attr('alignment-baseline', config.alignmentBaseline)
            .attr('dominant-baseline', config.dominantBaseline)
            .style('cursor', config.cursor)
            .attr('pointer-events', config.pointerEvents)
            .text((d) => config.valueAccessor(d))
            .attr('y', (d) => config.position(d, this.path, this.projection)[1])
            .attr('x', (d) => config.position(d, this.path, this.projection)[0])
            .attr('font-size', config.fontScale(this.ranges.x[1]))
            .attr('fill', (d) =>
              this.getLabelProperty<CSSType.Property.Fill>(d, config, 'color')
            )
            .attr('font-weight', (d) =>
              this.getLabelProperty<CSSType.Property.FontWeight>(
                d,
                config,
                'fontWeight'
              )
            ),
        (update: any) =>
          update.call((update: any) =>
            update
              .text((d) => config.valueAccessor(d))
              .attr(
                'y',
                (d) => config.position(d, this.path, this.projection)[1]
              )
              .attr(
                'x',
                (d) => config.position(d, this.path, this.projection)[0]
              )
              .attr('font-size', config.fontScale(this.ranges.x[1]))
              .transition(t as any)
              .attr('fill', (d) =>
                this.getLabelProperty<CSSType.Property.Fill>(d, config, 'color')
              )
              .attr('font-weight', (d) =>
                this.getLabelProperty<CSSType.Property.FontWeight>(
                  d,
                  config,
                  'fontWeight'
                )
              )
          ),
        (exit: any) => exit.remove()
      );
  }

  getLabelProperty<T>(
    d: Feature<MultiPolygon, any>,
    config: VicGeographyLabelConfig,
    property: 'color' | 'fontWeight'
  ): T {
    const pathColor = this.getFill(d);
    const accessor = config[property];
    let fontProperty;
    if (this.isPropertyFunction(accessor)) {
      fontProperty = accessor(d);
    } else {
      fontProperty = accessor;
    }
    if (config.autoColorByContrast.enable) {
      fontProperty = this.getAutoContrastLabelProperties(
        config.autoColorByContrast,
        pathColor
      )[property];
    }
    return fontProperty;
  }

  isPropertyFunction<T>(x: ((d: Feature) => T) | T): x is (d: Feature) => T {
    return typeof x === 'function';
  }

  getAutoContrastLabelProperties(
    config: VicGeographiesLabelsAutoColor,
    backgroundColor: string
  ): VicGeographiesLabelsAutoColorProperties {
    return ColorUtilities.getContrastRatio(
      config.light.color,
      backgroundColor
    ) > ColorUtilities.getContrastRatio(config.dark.color, backgroundColor)
      ? config.light
      : config.dark;
  }
}

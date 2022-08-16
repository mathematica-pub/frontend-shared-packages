import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  extent,
  geoPath,
  InternMap,
  InternSet,
  map,
  max,
  min,
  range,
  scaleLinear,
  select,
  Transition,
} from 'd3';
import { takeUntil } from 'rxjs';
import { Ranges } from '../chart/chart.model';
import { UtilitiesService } from '../core/services/utilities.service';
import { DataMarks } from '../data-marks/data-marks.model';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapContent } from '../map-chart/map-content';
import {
  DataGeography,
  GeographiesConfig,
  MapDataValues,
  NoDataGeography,
} from './geographies.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-data-marks-geographies]',
  templateUrl: './geographies.component.html',
  styleUrls: ['./geographies.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DATA_MARKS, useExisting: GeographiesComponent }],
})
export class GeographiesComponent
  extends MapContent
  implements DataMarks, OnChanges, OnInit
{
  @ViewChild('map', { static: true }) mapRef: ElementRef<SVGSVGElement>;
  @Input() config: GeographiesConfig;
  ranges: Ranges;
  map: any;
  projection: any;
  path: any;
  values: MapDataValues = new MapDataValues();

  constructor(
    private utilities: UtilitiesService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    chart: MapChartComponent
  ) {
    super(chart);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScalesAndConfig();
    this.setMethodsFromConfigAndDraw();
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
    this.values.attributeDataGeographies = map(
      this.config.data,
      this.config.dataGeography.attributeDataConfig.geoAccessor
    );
    this.values.attributeDataValues = map(
      this.config.data,
      this.config.dataGeography.attributeDataConfig.valueAccessor
    ).map((d) => (d == null ? NaN : +d));
    this.values.indexMap = new InternMap(
      this.values.attributeDataGeographies.map((name, i) => [name, i])
    );
    this.values.geoJsonGeographies = map(
      this.config.dataGeography.geographies,
      this.config.dataGeography.valueAccessor
    );
  }

  initAttributeDataScaleDomain(): void {
    let valuesDomain: any[];
    if (this.config.dataGeography.attributeDataConfig.domain === undefined) {
      valuesDomain = extent(this.values.attributeDataValues);
    } else {
      valuesDomain = [
        ...new Set([
          ...this.config.dataGeography.attributeDataConfig.domain,
          ...this.values.attributeDataValues,
        ]),
      ];
    }
    if (
      this.config.dataGeography.attributeDataConfig.valueType === 'quantitative'
    ) {
      this.setQuantitativeDomainAndBins(valuesDomain);
    }
    if (
      this.config.dataGeography.attributeDataConfig.valueType === 'categorical'
    ) {
      this.setCategoricalDomain();
    }
  }

  setQuantitativeDomainAndBins(valuesDomain: any[]): void {
    if (
      this.config.dataGeography.attributeDataConfig.binType ===
      'equal num observations'
    ) {
      this.config.dataGeography.attributeDataConfig.domain = valuesDomain;
    } else if (
      this.config.dataGeography.attributeDataConfig.binType === 'custom breaks'
    ) {
      this.config.dataGeography.attributeDataConfig.domain =
        this.config.dataGeography.attributeDataConfig.breakValues;
      this.config.dataGeography.attributeDataConfig.numBins =
        this.config.dataGeography.attributeDataConfig.breakValues.length + 1;
    } else {
      const dataMin = min([min(valuesDomain), 0]);
      this.config.dataGeography.attributeDataConfig.domain = [
        dataMin,
        max(valuesDomain),
      ];
    }
  }

  setCategoricalDomain(): void {
    this.config.dataGeography.attributeDataConfig.domain = new InternSet(
      this.values.attributeDataValues
    );
  }

  initAttributeDataScaleRange(): void {
    if (this.shouldCalculateBinColors()) {
      const binIndicies = range(
        this.config.dataGeography.attributeDataConfig.numBins
      );
      const colorGenerator = scaleLinear()
        .domain(extent(binIndicies))
        .range(this.config.dataGeography.attributeDataConfig.colors as any)
        .interpolate(
          this.config.dataGeography.attributeDataConfig.interpolator
        );
      this.config.dataGeography.attributeDataConfig.range = binIndicies.map(
        (i) => colorGenerator(i)
      );
    } else {
      this.config.dataGeography.attributeDataConfig.range =
        this.config.dataGeography.attributeDataConfig.colors;
    }
  }

  shouldCalculateBinColors(): boolean {
    return (
      this.config.dataGeography.attributeDataConfig.numBins &&
      this.config.dataGeography.attributeDataConfig.numBins > 1 &&
      this.config.dataGeography.attributeDataConfig.colors.length !==
        this.config.dataGeography.attributeDataConfig.numBins
    );
  }

  initAttributeDataScaleAndUpdateChart(): void {
    let scale;
    if (
      this.config.dataGeography.attributeDataConfig.valueType ===
        'quantitative' &&
      this.config.dataGeography.attributeDataConfig.binType === 'none'
    ) {
      scale = this.setColorScaleWithColorInterpolator();
    } else {
      scale = this.setColorScaleWithoutColorInterpolator();
    }
    this.zone.run(() => {
      this.chart.updateAttributeDataScale(scale);
      this.chart.updateAttributeDataConfig(
        this.config.dataGeography.attributeDataConfig
      );
    });
  }

  setColorScaleWithColorInterpolator(): any {
    return this.config.dataGeography.attributeDataConfig
      .colorScale()
      .domain(this.config.dataGeography.attributeDataConfig.domain)
      .range(this.config.dataGeography.attributeDataConfig.range)
      .unknown(this.config.dataGeography.nullColor)
      .interpolate(this.config.dataGeography.attributeDataConfig.interpolator);
  }

  setColorScaleWithoutColorInterpolator(): any {
    return this.config.dataGeography.attributeDataConfig
      .colorScale()
      .domain(this.config.dataGeography.attributeDataConfig.domain)
      .range(this.config.dataGeography.attributeDataConfig.range)
      .unknown(this.config.dataGeography.nullColor);
  }

  drawMarks(transitionDuration: number): void {
    this.zone.run(() => {
      this.drawMap(transitionDuration);
    });
  }

  drawMap(transitionDuration): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    if (this.config.dataGeography) {
      this.drawDataLayer(t);
    }
    if (this.config.noDataGeographies) {
      this.drawNoDataLayers(t);
    }
  }

  drawDataLayer(t: any): void {
    this.map = select(this.mapRef.nativeElement)
      .selectAll('.map-layer.data')
      .data([this.config.dataGeography])
      .join(
        (enter) => enter.append('g').attr('class', 'map-layer data'),
        (update) => update,
        (exit) => exit.remove()
      );

    this.map
      .selectAll('path')
      .data((layer: DataGeography) => layer.geographies)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', this.path)
            .attr('fill', (d, i) => this.getFill(i))
            .attr('stroke', this.config.dataGeography.strokeColor)
            .attr('stroke-width', this.config.dataGeography.strokeWidth),
        (update) => update.attr('d', this.path),
        (exit) => exit.remove()
      );
  }

  drawNoDataLayers(t: any): void {
    const noDataLayers = select(this.mapRef.nativeElement)
      .selectAll('.map-layer.no-data')
      .data(this.config.noDataGeographies)
      .join(
        (enter) => enter.append('g').attr('class', 'map-layer no-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    noDataLayers
      .selectAll('path')
      .data((layer: NoDataGeography) => layer.geographies)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', this.path)
            .attr(
              'fill',
              (d, i, nodes) => this.getConfigFromNode(nodes[i]).fill
            )
            .attr(
              'stroke',
              (d, i, nodes) => this.getConfigFromNode(nodes[i]).strokeColor
            )
            .attr(
              'stroke-width',
              (d, i, nodes) => this.getConfigFromNode(nodes[i]).strokeWidth
            ),
        (update) => update.attr('d', this.path),
        (exit) => exit.remove()
      );
  }

  getConfigFromNode(node: any): any {
    const config = select(node.parentNode).datum() as any;
    return config;
  }

  getFill(i: number): string {
    const dataValue = this.getValueFromDataGeographyIndex(i);
    const color = this.attributeDataScale(dataValue);
    return color;
  }

  getValueFromDataGeographyIndex(i: number): any {
    const geoName = this.values.geoJsonGeographies[i];
    const dataIndex = this.values.indexMap.get(geoName);
    return this.values.attributeDataValues[dataIndex];
  }

  onPointerEnter(event: PointerEvent) {
    return;
  }
  onPointerLeave(event: PointerEvent) {
    return;
  }
  onPointerMove(event: PointerEvent) {
    return;
  }
}

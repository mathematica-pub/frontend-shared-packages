import {
  ChangeDetectionStrategy,
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
import { takeUntil } from 'rxjs/operators';
import { ChartComponent } from '../chart/chart.component';
import { Ranges } from '../chart/chart.model';
import { UtilitiesService } from '../core/services/utilities.service';
import { DataMarks } from '../data-marks/data-marks.model';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { Unsubscribe } from '../shared/unsubscribe.class';
import {
  DataGeography,
  MapConfig,
  MapDataValues,
  SimpleGeography,
} from './map.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-data-marks-map]',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DATA_MARKS, useExisting: MapComponent }],
})
export class MapComponent
  extends Unsubscribe
  implements DataMarks, OnChanges, OnInit
{
  @ViewChild('map', { static: true }) mapRef: ElementRef<SVGSVGElement>;
  @Input() config: MapConfig;
  map: any;
  projection: any;
  path: any;
  values: MapDataValues = new MapDataValues();
  dataScale: any;
  ranges: Ranges;

  constructor(
    private utilities: UtilitiesService,
    public chart: ChartComponent,
    private zone: NgZone
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.setMethodsFromConfigAndDraw();
  }

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.ranges.x = ranges.x;
      this.ranges.y = ranges.y;
      if (this.values.dataValues) {
        this.zone.run(() => {
          this.resizeMarks();
        });
      }
    });
  }

  resizeMarks(): void {
    this.setProjection();
    this.setPath();
    this.drawMarks(this.config.transitionDuration);
  }

  setMethodsFromConfigAndDraw(): void {
    this.setProjection();
    this.setPath();
    this.setValueArrays();
    this.initDataScaleDomain();
    this.initDataScaleRange();
    this.initDataScale();
    this.drawMarks(this.config.transitionDuration);
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
    this.values.dataGeographies = map(
      this.config.data,
      this.config.dataGeography.dataConfig.geoAccessor
    );
    this.values.dataValues = map(
      this.config.data,
      this.config.dataGeography.dataConfig.valueAccessor
    ).map((d) => (d == null ? NaN : +d));
    this.values.indexMap = new InternMap(
      this.values.dataGeographies.map((name, i) => [name, i])
    );
    this.values.geoGeographies = map(
      this.config.dataGeography.geographies,
      this.config.dataGeography.valueAccessor
    );
  }

  initDataScaleDomain(): void {
    let valuesDomain: any[];
    if (this.config.dataGeography.dataConfig.domain === undefined) {
      valuesDomain = extent(this.values.dataValues);
    } else {
      valuesDomain = [
        ...new Set([
          ...this.config.dataGeography.dataConfig.domain,
          ...this.values.dataValues,
        ]),
      ];
    }
    if (this.config.dataGeography.dataConfig.valueType === 'quantitative') {
      this.setQuantitativeDomainAndBins(valuesDomain);
    }
    if (this.config.dataGeography.dataConfig.valueType === 'categorical') {
      this.setCategoricalDomain();
    }
  }

  setQuantitativeDomainAndBins(valuesDomain: any[]): void {
    if (
      this.config.dataGeography.dataConfig.binType === 'equal num observations'
    ) {
      this.config.dataGeography.dataConfig.domain = valuesDomain;
    } else if (
      this.config.dataGeography.dataConfig.binType === 'custom breaks'
    ) {
      this.config.dataGeography.dataConfig.domain =
        this.config.dataGeography.dataConfig.breakValues;
      this.config.dataGeography.dataConfig.numBins =
        this.config.dataGeography.dataConfig.breakValues.length + 1;
    } else {
      const dataMin = min([min(valuesDomain), 0]);
      this.config.dataGeography.dataConfig.domain = [
        dataMin,
        max(valuesDomain),
      ];
    }
  }

  setCategoricalDomain(): void {
    this.config.dataGeography.dataConfig.domain = new InternSet(
      this.values.dataValues
    );
  }

  initDataScaleRange(): void {
    if (this.shouldCalculateBinColors()) {
      const binIndicies = range(this.config.dataGeography.dataConfig.numBins);
      const colorGenerator = scaleLinear()
        .domain(extent(binIndicies))
        .range(this.config.dataGeography.dataConfig.colors as any)
        .interpolate(this.config.dataGeography.dataConfig.interpolator);
      this.config.dataGeography.dataConfig.range = binIndicies.map((i) =>
        colorGenerator(i)
      );
    } else {
      this.config.dataGeography.dataConfig.range =
        this.config.dataGeography.dataConfig.colors;
    }
  }

  shouldCalculateBinColors(): boolean {
    return (
      this.config.dataGeography.dataConfig.numBins &&
      this.config.dataGeography.dataConfig.numBins > 1 &&
      this.config.dataGeography.dataConfig.colors.length !==
        this.config.dataGeography.dataConfig.numBins
    );
  }

  initDataScale(): void {
    if (
      this.config.dataGeography.dataConfig.valueType === 'quantitative' &&
      this.config.dataGeography.dataConfig.binType === 'none'
    ) {
      this.setColorScaleWithColorInterpolator();
    } else {
      this.setColorScaleWithoutColorInterpolator();
    }
  }

  setColorScaleWithColorInterpolator(): void {
    this.config.dataGeography.dataConfig.colorScale =
      this.config.dataGeography.dataConfig
        .colorScale()
        .domain(this.config.dataGeography.dataConfig.domain)
        .range(this.config.dataGeography.dataConfig.range)
        .unknown(this.config.dataGeography.nullColor)
        .interpolate(this.config.dataGeography.dataConfig.interpolator);
  }

  setColorScaleWithoutColorInterpolator(): void {
    this.config.dataGeography.dataConfig.colorScale =
      this.config.dataGeography.dataConfig
        .colorScale()
        .domain(this.config.dataGeography.dataConfig.domain)
        .range(this.config.dataGeography.dataConfig.range)
        .unknown(this.config.dataGeography.nullColor);
  }

  drawMarks(transitionDuration: number): void {
    this.drawMap(transitionDuration);
  }

  drawMap(transitionDuration): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    if (this.config.dataGeography) {
      this.drawDataLayer(t);
    }
    if (this.config.simpleGeographies) {
      this.drawSimpleLayers(t);
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
        (update) => update,
        (exit) => exit.remove()
      );
  }

  drawSimpleLayers(t: any): void {
    const simpleLayers = select(this.mapRef.nativeElement)
      .selectAll('.map-layer.simple')
      .data(this.config.simpleGeographies)
      .join(
        (enter) => enter.append('g').attr('class', 'map-layer simple'),
        (update) => update,
        (exit) => exit.remove()
      );

    simpleLayers
      .selectAll('path')
      .data((layer: SimpleGeography) => layer.geographies)
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
        (update) => update,
        (exit) => exit.remove()
      );
  }

  getConfigFromNode(node: any): any {
    const config = select(node.parentNode).datum() as any;
    return config;
  }

  getFill(i: number): string {
    const dataValue = this.getValueFromDataGeographyIndex(i);
    const color = this.config.dataGeography.dataConfig.colorScale(dataValue);
    return color;
  }

  getValueFromDataGeographyIndex(i: number): any {
    const geoName = this.values.geoGeographies[i];
    const dataIndex = this.values.indexMap.get(geoName);
    return this.values.dataValues[dataIndex];
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

import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { GeographiesHoverDirective } from 'projects/viz-components/src/lib/geographies/geographies-hover.directive';
import {
  HtmlTooltipConfig,
  HtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import { valueFormat } from 'projects/viz-components/src/lib/value-format/value-format';
import {
  DataGeographyConfig,
  ElementSpacing,
  EqualValuesQuantitativeAttributeDataDimensionConfig,
  GeographiesClickDirective,
  GeographiesClickEmitTooltipDataPauseHoverMoveEffects,
  GeographiesConfig,
  GeographiesEventOutput,
  GeographiesHoverEmitTooltipData,
  NoDataGeographyConfig,
  VicGeographyLabelConfig,
} from 'projects/viz-components/src/public-api';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
} from 'rxjs';
import * as topojson from 'topojson-client';
import { Topology } from 'topojson-specification';
import { colors } from '../core/constants/colors.constants';
import { StateIncomeDatum } from '../core/models/data';
import { BasemapService } from '../core/services/basemap.service';
import { DataService } from '../core/services/data.service';
import { Feature, MultiPolygon } from 'geojson';
import { maxIndex, polygonArea } from 'd3';
import polylabel from 'polylabel';

type ScaleType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks'
  | 'categorical';

@Component({
  selector: 'app-geographies-example',
  templateUrl: './geographies-example.component.html',
  styleUrls: ['./geographies-example.component.scss'],
})
export class GeographiesExampleComponent implements OnInit {
  scaleType: ScaleType;
  scaleTypes: ScaleType[] = [
    'none',
    'equal value ranges',
    'equal num observations',
    'custom breaks',
    'categorical',
  ];
  dataMarksConfig$: Observable<GeographiesConfig>;
  width = 700;
  height = 400;
  margin: ElementSpacing = { top: 0, right: 0, bottom: 0, left: 0 };
  outlineColor = colors.base;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<GeographiesEventOutput> =
    new BehaviorSubject<GeographiesEventOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverEffects: EventEffect<GeographiesHoverDirective>[] = [
    new GeographiesHoverEmitTooltipData(),
  ];
  patternName = 'dotPattern';
  folderName = 'geographies-example';
  selectedYear: BehaviorSubject<string> = new BehaviorSubject<string>('2020');
  selectedYear$ = this.selectedYear.asObservable();

  clickEffects: EventEffect<GeographiesClickDirective>[] = [
    new GeographiesClickEmitTooltipDataPauseHoverMoveEffects(),
  ];
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();

  constructor(
    private dataService: DataService,
    private basemap: BasemapService
  ) {}

  ngOnInit(): void {
    const filteredData$ = combineLatest([
      this.dataService.stateIncomeData$,
      this.selectedYear$,
    ]).pipe(
      filter(([data]) => !!data),
      map(([data, year]) => data.filter((x) => x.year === +year)),
      map((data) => data.filter((x) => x.state !== 'Texas'))
    );

    this.dataMarksConfig$ = combineLatest([
      filteredData$,
      this.basemap.map$,
    ]).pipe(
      filter(([data, map]) => !!data && !!map),
      map(([data, map]) => this.getDataMarksConfig(data, map))
    );
  }

  getDataMarksConfig(
    data: StateIncomeDatum[],
    map: Topology
  ): GeographiesConfig {
    const config = new GeographiesConfig();
    config.data = data;
    config.boundary = this.basemap.us;
    const noDataStatesConfig = this.getNoDataGeographyStatesFeatures(map, data);
    config.noDataGeographiesConfigs = [
      this.basemap.usOutlineConfig,
      noDataStatesConfig,
    ];
    config.dataGeographyConfig = this.getDataGeographyConfig(map, data);
    return config;
  }

  getGeographyLabelConfig(): VicGeographyLabelConfig {
    const polylabelStates = [
      'CA',
      'ID',
      'MN',
      'LA',
      'MI',
      'KY',
      'FL',
      'VA',
      'NY',
    ];

    const unlabelledTerritories = ['GU', 'MP', 'PR', 'VI', 'AS'];
    const smallSquareStates = [
      'CT',
      'DE',
      'DC',
      'MD',
      'MA',
      'NH',
      'NJ',
      'RI',
      'VT',
    ];
    const labelConfig = new VicGeographyLabelConfig();
    labelConfig.labelTextFunction = (d) => d.properties['id'];
    labelConfig.showLabelFunction = (d) =>
      !unlabelledTerritories.includes(d.properties['id']) &&
      !smallSquareStates.includes(d.properties['id']);
    labelConfig.labelPositionFunction = (d, path, projection) =>
      polylabelStates.includes(d.properties['id'])
        ? this.getPolyLabelCentroid(d, projection)
        : d.properties['id'] == 'HI'
        ? this.getHawaiiCentroid(d, projection)
        : path.centroid(d);
    labelConfig.darkTextColor = 'rgb(22,80,225)';
    return labelConfig;
  }

  getPolyLabelCentroid(
    feature: Feature<MultiPolygon, any>,
    projection: any
  ): [number, number] {
    const hasMultiPolys = feature.geometry.coordinates.length > 1;
    const largestIndex = !hasMultiPolys
      ? 0
      : maxIndex(
          feature.geometry.coordinates.map((polygon) => {
            return polygonArea(polygon[0] as [number, number][]);
          })
        );
    const largestPolygon = feature.geometry.coordinates[largestIndex];
    const projectedPoints = !hasMultiPolys
      ? (largestPolygon.map(projection) as [number, number][])
      : (largestPolygon[0].map(projection) as [number, number][]);
    return polylabel([projectedPoints]);
  }

  getHawaiiCentroid(
    feature: Feature<MultiPolygon, any>,
    projection: any
  ): [number, number] {
    const startPolygon = feature.geometry.coordinates[0][0].map(projection) as [
      number,
      number
    ][];
    const endPolygon = feature.geometry.coordinates[
      feature.geometry.coordinates.length - 1
    ][0].map(projection) as [number, number][];

    const hawaiiApproxStartCoords = startPolygon[0];
    const hawaiiApproxEndCoords = endPolygon[0];
    return [
      hawaiiApproxStartCoords[0] +
        (hawaiiApproxEndCoords[0] - hawaiiApproxStartCoords[0]) / 2,
      hawaiiApproxStartCoords[1],
    ];
  }

  getDataGeographyConfig(
    map: Topology,
    data: StateIncomeDatum[]
  ): DataGeographyConfig {
    const config = new DataGeographyConfig();
    config.geographies = this.getDataGeographyFeatures(map, data);
    config.valueAccessor = (d) => d.properties['name'];
    config.attributeDataConfig =
      new EqualValuesQuantitativeAttributeDataDimensionConfig();
    config.attributeDataConfig.geoAccessor = (d) => d.state;
    config.attributeDataConfig.valueAccessor = (d) => d.income;
    config.attributeDataConfig.valueFormat = `$${valueFormat.integer}`;
    config.attributeDataConfig.colors = [
      colors.white,
      colors.highlight.default,
    ];
    config.attributeDataConfig.numBins = 6;
    config.attributeDataConfig.patternPredicates = [
      {
        patternName: this.patternName,
        predicate: (d) => !!d && d.population < 1000000,
      },
    ];
    config.labels = this.getGeographyLabelConfig();
    return config;
  }

  getNoDataGeographyStatesFeatures(
    map: Topology,
    data: StateIncomeDatum[]
  ): NoDataGeographyConfig {
    const statesInData = data.map((x) => x.state);
    const features = topojson
      .feature(map, map.objects['states'])
      ['features'].filter((x) => !statesInData.includes(x.properties.name));
    const labels = this.getGeographyLabelConfig();
    return new NoDataGeographyConfig({
      geographies: features,
      patternName: this.patternName,
      labels: labels,
    });
  }

  getDataGeographyFeatures(map: Topology, data: StateIncomeDatum[]): any {
    const statesInData = data.map((x) => x.state);
    return topojson
      .feature(map, map.objects['states'])
      ['features'].filter((x) => statesInData.includes(x.properties.name));
  }

  updateTooltipForNewOutput(
    data: GeographiesEventOutput,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data, tooltipEvent);
  }

  updateTooltipData(data: GeographiesEventOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: GeographiesEventOutput,
    eventContext: 'hover' | 'click'
  ): void {
    const config = new HtmlTooltipConfig();
    config.size.minWidth = 130;
    config.hasBackdrop = eventContext === 'click';
    config.closeOnBackdropClick = eventContext === 'click';
    config.position = new HtmlTooltipOffsetFromOriginPosition();
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }

  onYearChange(change: MatButtonToggleChange): void {
    this.selectedYear.next(change.value);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
  }
}

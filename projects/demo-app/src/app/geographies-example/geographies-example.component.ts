import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { GeographiesHoverDirective } from 'projects/viz-components/src/lib/geographies/geographies-hover.directive';
import {
  HtmlTooltipConfig,
  OffsetFromOriginPosition,
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
      map(([data, year]) => data.filter((x) => x.year === +year))
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
    config.noDataGeographiesConfigs = [this.basemap.usOutlineConfig];
    config.dataGeographyConfig = this.getDataGeographyConfig(map);
    return config;
  }

  getDataGeographyConfig(map: Topology): DataGeographyConfig {
    const config = new DataGeographyConfig();
    config.geographies = this.getDataGeographyFeatures(map);
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
    return config;
  }

  getDataGeographyFeatures(map: Topology): any {
    return topojson.feature(map, map.objects['states'])['features'];
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
    config.position = new OffsetFromOriginPosition();
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

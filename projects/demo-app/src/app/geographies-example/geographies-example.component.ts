import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { GeographiesHoverDirective } from 'projects/viz-components/src/lib/geographies/geographies-hover.directive';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import { valueFormat } from 'projects/viz-components/src/lib/value-format/value-format';
import {
  ElementSpacing,
  GeographiesClickDirective,
  GeographiesClickEmitTooltipDataPauseHoverMoveEffects,
  GeographiesHoverEmitTooltipData,
  VicDataGeographyConfig,
  VicEqualValuesQuantitativeAttributeDataDimensionConfig,
  VicGeographiesConfig,
  VicGeographiesEventOutput,
  VicNoDataGeographyConfig,
} from 'projects/viz-components/src/public-api';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
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
  dataMarksConfig$: Observable<VicGeographiesConfig>;
  width = 700;
  height = 400;
  margin: ElementSpacing = { top: 0, right: 0, bottom: 0, left: 0 };
  outlineColor = colors.base;
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<VicGeographiesEventOutput> =
    new BehaviorSubject<VicGeographiesEventOutput>(null);
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
  ): VicGeographiesConfig {
    const config = new VicGeographiesConfig();
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

  getDataGeographyConfig(
    map: Topology,
    data: StateIncomeDatum[]
  ): VicDataGeographyConfig {
    const config = new VicDataGeographyConfig();
    config.geographies = this.getDataGeographyFeatures(map, data);
    config.valueAccessor = (d) => d.properties['name'];
    config.attributeDataConfig =
      new VicEqualValuesQuantitativeAttributeDataDimensionConfig();
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

  getNoDataGeographyStatesFeatures(
    map: Topology,
    data: StateIncomeDatum[]
  ): VicNoDataGeographyConfig {
    const statesInData = data.map((x) => x.state);
    const features = topojson
      .feature(map, map.objects['states'])
      ['features'].filter((x) => !statesInData.includes(x.properties.name));
    return new VicNoDataGeographyConfig({
      geographies: features,
      patternName: this.patternName,
    });
  }

  getDataGeographyFeatures(map: Topology, data: StateIncomeDatum[]): any {
    const statesInData = data.map((x) => x.state);
    return topojson
      .feature(map, map.objects['states'])
      ['features'].filter((x) => statesInData.includes(x.properties.name));
  }

  updateTooltipForNewOutput(
    data: VicGeographiesEventOutput,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data, tooltipEvent);
  }

  updateTooltipData(data: VicGeographiesEventOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: VicGeographiesEventOutput,
    eventContext: 'hover' | 'click'
  ): void {
    const config = new VicHtmlTooltipConfig();
    config.size.minWidth = 130;
    config.hasBackdrop = eventContext === 'click';
    config.closeOnBackdropClick = eventContext === 'click';
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
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

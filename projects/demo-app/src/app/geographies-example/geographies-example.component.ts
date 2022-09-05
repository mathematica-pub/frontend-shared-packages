import { Component, OnInit } from '@angular/core';
import { valueFormat } from 'projects/viz-components/src/lib/core/constants/formatters.constants';
import { GeographiesHoverAndMoveEffect } from 'projects/viz-components/src/lib/geographies/geographies-effect';
import { EmitGeographiesTooltipData } from 'projects/viz-components/src/lib/geographies/geographies-effects';
import { GeographiesEmittedOutput } from 'projects/viz-components/src/lib/geographies/geographies-hover-move-event.directive';
import { HtmlTooltipConfig } from 'projects/viz-components/src/lib/html-tooltip/html-tooltip.config';
import {
  DataGeographyConfig,
  ElementSpacing,
  EqualValuesQuantitativeAttributeDataDimensionConfig,
  GeographiesConfig,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
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
  margin: ElementSpacing = { top: 36, right: 36, bottom: 36, left: 200 };
  outlineColor = colors.base;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<GeographiesEmittedOutput> =
    new BehaviorSubject<GeographiesEmittedOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverEffects: GeographiesHoverAndMoveEffect[] = [
    new EmitGeographiesTooltipData(),
  ];

  constructor(
    private dataService: DataService,
    private basemap: BasemapService
  ) {}

  ngOnInit(): void {
    this.dataMarksConfig$ = combineLatest([
      this.dataService.stateIncomeData$,
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
    config.data = data.filter((x) => x.state.toLowerCase() !== 'puerto rico');
    config.boundary = this.basemap.us;
    config.noDataGeographiesConfigs = [this.basemap.usOutlineConfig];
    config.dataGeographyConfig = this.getDataGeographyConfig(map);
    return config;
  }

  getDataGeographyConfig(map: Topology): DataGeographyConfig {
    const config = new DataGeographyConfig();
    config.geographies = this.getDataGeographyFeatures(map);
    config.valueAccessor = (d) => d.properties['NAME'];
    config.attributeDataConfig =
      new EqualValuesQuantitativeAttributeDataDimensionConfig();
    config.attributeDataConfig.geoAccessor = (d) => d.state;
    config.attributeDataConfig.valueAccessor = (d) => d.income;
    config.attributeDataConfig.valueFormat = `$${valueFormat.integer()}`;
    config.attributeDataConfig.colors = [
      colors.white,
      colors.highlight.default,
    ];
    config.attributeDataConfig.numBins = 6;
    return config;
  }

  getDataGeographyFeatures(map: Topology): any {
    return topojson.feature(map, map.objects['states'])['features'];
  }

  updateTooltipForNewOutput(data: GeographiesEmittedOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: GeographiesEmittedOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: GeographiesEmittedOutput): void {
    const config = new HtmlTooltipConfig();
    config.position.panelClass = 'map-tooltip';
    if (data) {
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 16;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MultiPolygon } from 'geojson';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { VicGeographiesFeature } from 'projects/viz-components/src/lib/geographies/geographies';
import { GeographiesClickEmitTooltipDataPauseHoverMoveEffects } from 'projects/viz-components/src/lib/geographies/geographies-click-effects';
import { GeographiesClickDirective } from 'projects/viz-components/src/lib/geographies/geographies-click.directive';
import { GeographiesHoverEmitTooltipData } from 'projects/viz-components/src/lib/geographies/geographies-hover-effects';
import { GeographiesHoverDirective } from 'projects/viz-components/src/lib/geographies/geographies-hover.directive';
import { VicGeographyLabelConfig } from 'projects/viz-components/src/lib/geographies/geographies-labels';
import { VicGeographiesLabelsPositioners } from 'projects/viz-components/src/lib/geographies/geographies-labels-positioners';
import { VicGeographiesEventOutput } from 'projects/viz-components/src/lib/geographies/geographies-tooltip-data';
import {
  VicDataGeographyConfig,
  VicEqualValuesQuantitativeAttributeDataDimensionConfig,
  VicGeographiesConfig,
  VicNoDataGeographyConfig,
} from 'projects/viz-components/src/lib/geographies/geographies.config';
import { VicColorUtilities } from 'projects/viz-components/src/lib/shared/color-utilities.class';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
import { valueFormat } from 'projects/viz-components/src/lib/value-format/value-format';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  shareReplay,
} from 'rxjs';
import { colors } from '../core/constants/colors.constants';
import { StateIncomeDatum } from '../core/models/data';
import { MapGeometryProperties } from '../core/services/basemap';
import { BasemapService } from '../core/services/basemap.service';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-geographies-example',
  templateUrl: './geographies-example.component.html',
  styleUrls: ['./geographies-example.component.scss'],
})
export class GeographiesExampleComponent implements OnInit {
  dataMarksConfig$: Observable<
    VicGeographiesConfig<StateIncomeDatum, MapGeometryProperties>
  >;
  width = 700;
  height = 400;
  margin: VicElementSpacing = { top: 0, right: 0, bottom: 0, left: 0 };
  outlineColor = colors.base;
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<VicGeographiesEventOutput<StateIncomeDatum>> =
    new BehaviorSubject<VicGeographiesEventOutput<StateIncomeDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverEffects: EventEffect<
    GeographiesHoverDirective<StateIncomeDatum, MapGeometryProperties>
  >[] = [
    new GeographiesHoverEmitTooltipData<
      StateIncomeDatum,
      MapGeometryProperties
    >(),
  ];
  patternName = 'dotPattern';
  folderName = 'geographies-example';
  selectedYear: BehaviorSubject<string> = new BehaviorSubject<string>('2020');
  selectedYear$ = this.selectedYear.asObservable();

  clickEffects: EventEffect<
    GeographiesClickDirective<StateIncomeDatum, MapGeometryProperties>
  >[] = [
    new GeographiesClickEmitTooltipDataPauseHoverMoveEffects<
      StateIncomeDatum,
      MapGeometryProperties
    >(),
  ];
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  featureIndexAccessor = (d: VicGeographiesFeature<MapGeometryProperties>) =>
    d.properties.name;

  constructor(
    private dataService: DataService,
    private basemap: BasemapService
  ) {}

  ngOnInit(): void {
    const filteredData$ = combineLatest([
      this.dataService.stateIncomeData$.pipe(filter((data) => !!data)),
      this.selectedYear$,
    ]).pipe(
      map(([data, year]) =>
        data.filter((x) => x.year === +year && x.state !== 'Texas')
      )
    );

    this.dataMarksConfig$ = filteredData$.pipe(
      map((data) => this.getDataMarksConfig(data)),
      shareReplay(1)
    );
  }

  getDataMarksConfig(
    data: StateIncomeDatum[]
  ): VicGeographiesConfig<StateIncomeDatum, MapGeometryProperties> {
    const config = new VicGeographiesConfig<
      StateIncomeDatum,
      MapGeometryProperties
    >();
    config.boundary = this.basemap.us;
    config.data = data;
    config.featureIndexAccessor = this.featureIndexAccessor;
    const noDataStatesConfig = this.getNoDataGeographyStatesConfig(data);
    config.noDataGeographiesConfigs = [
      this.basemap.usOutlineConfig,
      noDataStatesConfig,
    ];
    config.dataGeographyConfig = this.getDataGeographyConfig(data);
    return config;
  }

  getDataGeographyConfig(
    data: StateIncomeDatum[]
  ): VicDataGeographyConfig<StateIncomeDatum, MapGeometryProperties> {
    const config = new VicDataGeographyConfig<
      StateIncomeDatum,
      MapGeometryProperties
    >();
    config.geographies = this.getDataGeographyFeatures(data);
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
    config.labels = this.getGeographyLabelConfig();
    return config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataGeographyFeatures(data: StateIncomeDatum[]): any {
    const statesInData = data.map((x) => x.state);
    return this.basemap.states.features.filter((x) =>
      statesInData.includes(x.properties.name)
    );
  }

  getNoDataGeographyStatesConfig(
    data: StateIncomeDatum[]
  ): VicNoDataGeographyConfig<StateIncomeDatum, MapGeometryProperties> {
    const statesInData = data.map((x) => x.state);
    const features = this.basemap.states.features.filter(
      (x) => !statesInData.includes(x.properties.name)
    );
    const labels = this.getGeographyLabelConfig();
    return new VicNoDataGeographyConfig<
      StateIncomeDatum,
      MapGeometryProperties
    >({
      geographies: features,
      labels: labels,
      fill: 'lightgray',
    });
  }

  getGeographyLabelConfig(): VicGeographyLabelConfig<
    StateIncomeDatum,
    MapGeometryProperties
  > {
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
    const labelConfig = new VicGeographyLabelConfig<
      StateIncomeDatum,
      MapGeometryProperties
    >();
    labelConfig.valueAccessor = (d) => d.properties.id;
    labelConfig.display = (d) =>
      !unlabelledTerritories.includes(labelConfig.valueAccessor(d)) &&
      !smallSquareStates.includes(labelConfig.valueAccessor(d));

    labelConfig.position = (d, path, projection) => {
      if (labelConfig.valueAccessor(d) === 'HI') {
        return VicGeographiesLabelsPositioners.positionHawaiiOnGeoAlbersUsa(
          d as VicGeographiesFeature<MapGeometryProperties, MultiPolygon>,
          projection
        );
      } else if (polylabelStates.includes(labelConfig.valueAccessor(d))) {
        return VicGeographiesLabelsPositioners.positionWithPolylabel(
          d,
          projection
        );
      } else {
        return VicGeographiesLabelsPositioners.positionAtCentroid(d, path);
      }
    };
    const darkColor = 'rgb(22,80,225)';
    const lightColor = '#FFFFFF';
    labelConfig.color = (d, backgroundColor) =>
      VicColorUtilities.getHigherContrastColorForBackground(
        backgroundColor,
        darkColor,
        lightColor
      );
    labelConfig.fontWeight = (d, backgroundColor) =>
      VicColorUtilities.getHigherContrastColorForBackground(
        backgroundColor,
        darkColor,
        lightColor
      ) === darkColor
        ? 700
        : 400;

    return labelConfig;
  }

  updateTooltipForNewOutput(
    data: VicGeographiesEventOutput<StateIncomeDatum>,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data, tooltipEvent);
  }

  updateTooltipData(data: VicGeographiesEventOutput<StateIncomeDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: VicGeographiesEventOutput<StateIncomeDatum>,
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

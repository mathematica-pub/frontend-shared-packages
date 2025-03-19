import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import {
  BinStrategy,
  ChartConfig,
  ElementSpacing,
  EventAction,
  GeographiesAttributeDataLayerBuilder,
  GeographiesClickDirective,
  GeographiesClickEmitTooltipDataPauseHoverMoveActions,
  GeographiesConfig,
  GeographiesEventOutput,
  GeographiesFeature,
  GeographiesGeojsonPropertiesLayerBuilder,
  GeographiesHoverDirective,
  GeographiesHoverEmitTooltipData,
  GeographiesLabelsBuilder,
  HtmlTooltipConfig,
  VicChartConfigBuilder,
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicMapChartModule,
  VicMapLegendModule,
  valueFormat,
} from '@hsi/viz-components';
import { colors } from 'apps/demo-app/src/app/core/constants/colors.constants';
import { StateIncomeDatum } from 'apps/demo-app/src/app/core/models/data';
import { MapGeometryProperties } from 'apps/demo-app/src/app/core/services/basemap';
import { BasemapService } from 'apps/demo-app/src/app/core/services/basemap.service';
import { DataService } from 'apps/demo-app/src/app/core/services/data.service';
import { MultiPolygon } from 'geojson';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  shareReplay,
} from 'rxjs';

const polylabelStates = ['CA', 'ID', 'MN', 'LA', 'MI', 'KY', 'FL', 'VA', 'NY'];
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

interface ViewModel {
  chartConfig: ChartConfig;
  geographiesConfig: GeographiesConfig<StateIncomeDatum, MapGeometryProperties>;
}

@Component({
  selector: 'app-geographies-example',
  imports: [
    CommonModule,
    VicMapChartModule,
    VicGeographiesModule,
    VicMapLegendModule,
    MatSelectModule,
    VicHtmlTooltipModule,
    MatButtonToggleModule,
  ],
  templateUrl: './geographies-example.component.html',
  styleUrls: ['./geographies-example.component.scss'],
  providers: [
    VicChartConfigBuilder,
    VicGeographiesConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
})
export class GeographiesExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  width = 700;
  height = 400;
  margin: ElementSpacing = { top: 16, right: 40, bottom: 0, left: 40 };
  outlineColor = colors.base;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<GeographiesEventOutput<StateIncomeDatum>> =
    new BehaviorSubject<GeographiesEventOutput<StateIncomeDatum>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: EventAction<
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
  attributeDataBinType: BehaviorSubject<string> = new BehaviorSubject<string>(
    BinStrategy.equalValueRanges
  );
  attributeDataBinType$ = this.attributeDataBinType.asObservable();
  binTypes = [
    BinStrategy.none,
    BinStrategy.categorical,
    BinStrategy.equalValueRanges,
    BinStrategy.equalFrequencies,
    BinStrategy.customBreaks,
  ];

  clickActions: EventAction<
    GeographiesClickDirective<StateIncomeDatum, MapGeometryProperties>
  >[] = [
    new GeographiesClickEmitTooltipDataPauseHoverMoveActions<
      StateIncomeDatum,
      MapGeometryProperties
    >(),
  ];
  removeTooltipEvent: Subject<void> = new Subject<void>();
  removeTooltipEvent$ = this.removeTooltipEvent.asObservable();
  featureIndexAccessor = (d: GeographiesFeature<MapGeometryProperties>) =>
    d.properties.name;

  constructor(
    private dataService: DataService,
    private basemap: BasemapService,
    private chart: VicChartConfigBuilder,
    private geographies: VicGeographiesConfigBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    private tooltip: VicHtmlTooltipConfigBuilder
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

    this.vm$ = combineLatest([this.attributeDataBinType$, filteredData$]).pipe(
      map(([, data]) => ({
        chartConfig: this.getChartConfig(),
        geographiesConfig: this.getPrimaryMarksConfig(data),
      })),
      shareReplay(1)
    );
  }

  getChartConfig(): ChartConfig {
    return this.chart
      .margin(this.margin)
      .height(this.height)
      .width(this.width)
      .getConfig();
  }

  getPrimaryMarksConfig(
    data: StateIncomeDatum[]
  ): GeographiesConfig<StateIncomeDatum, MapGeometryProperties> {
    const config = this.geographies
      .boundary(this.basemap.us)
      .featureIndexAccessor(this.featureIndexAccessor)
      .geojsonPropertiesLayer((layer) => this.getUsOutlineConfig(layer))
      .geojsonPropertiesLayer((layer) => this.getNoDataLayer(data, layer))
      .attributeDataLayer((layer) => this.getDataLayer(data, layer))
      .getConfig();
    return config;
  }

  getUsOutlineConfig(
    layer: GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties>
  ): GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties> {
    return layer
      .geographies(this.basemap.us.features)
      .stroke((stroke) => stroke.color(colors.base).width(1))
      .fill((dimension) =>
        dimension.valueAccessor((d) => d.properties.name).range(['none'])
      );
  }

  getNoDataLayer(
    data: StateIncomeDatum[],
    layer: GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties>
  ): GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties> {
    const statesInData = data.map((x) => x.state);
    const features = this.basemap.states.features.filter(
      (x) => !statesInData.includes(x.properties.name)
    );
    const valueAccessor = (d: GeographiesFeature<MapGeometryProperties>) =>
      d.properties.id;
    return layer
      .geographies(features)
      .fill((dimension) =>
        dimension.range(['lightgray']).valueAccessor(this.featureIndexAccessor)
      )
      .labels((labels) =>
        labels
          .valueAccessor(valueAccessor)
          .display(
            (featureIndex) =>
              !unlabelledTerritories.includes(featureIndex) &&
              !smallSquareStates.includes(featureIndex)
          )
          .color('magenta')
          .fontWeight(700)
      )
      .enableEventActions(true);
  }

  getDataLayer(
    data: StateIncomeDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >
  ): GeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    const customFills = [
      {
        defId: this.patternName,
        shouldApply: (d) => !!d && d.population < 1000000,
      },
    ];
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .categoricalBins(
        this.attributeDataBinType.value === BinStrategy.categorical
          ? (dimension) =>
              dimension
                .valueAccessor((d) =>
                  d.income > 75000
                    ? 'high'
                    : d.income > 60000
                      ? 'middle'
                      : 'low'
                )
                .range([
                  'sandybrown',
                  'mediumseagreen',
                  colors.highlight.default,
                ])
          : null
      )
      .customBreaksBins(
        this.attributeDataBinType.value === BinStrategy.customBreaks
          ? (dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .formatSpecifier(`$${valueFormat.integer}`)
                .breakValues([45000, 55000, 65000, 75000, 100000])
                .range([colors.white, colors.highlight.default])
          : null
      )
      .equalValueRangesBins(
        this.attributeDataBinType.value === BinStrategy.equalFrequencies
          ? (dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .formatSpecifier(`$${valueFormat.integer}`)
                .numBins(6)
                .range([colors.white, colors.highlight.default])
          : null
      )
      .equalFrequenciesBins(
        this.attributeDataBinType.value === BinStrategy.equalValueRanges
          ? (dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .formatSpecifier(`$${valueFormat.integer}`)
                .numBins(6)
                .range([colors.white, colors.highlight.default])
          : null
      )
      .noBins(
        this.attributeDataBinType.value === BinStrategy.none
          ? (dimension) =>
              dimension
                .valueAccessor((d) => d.income)
                .formatSpecifier(`$${valueFormat.integer}`)
                .range([colors.white, colors.highlight.default])
          : null
      )
      .customFills(customFills)
      .labels((labels) => this.getLabels(labels));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataGeographiesFeatures(data: StateIncomeDatum[]): any {
    const statesInData = data.map((x) => x.state);
    return this.basemap.states.features.filter((x) =>
      statesInData.includes(x.properties.name)
    );
  }

  getLabels(
    labels: GeographiesLabelsBuilder<MapGeometryProperties>
  ): GeographiesLabelsBuilder<MapGeometryProperties> {
    const darkColor = 'rgb(22,80,225)';
    const lightColor = '#FFFFFF';
    const valueAccessor = (d) => d.properties.id;
    return labels
      .valueAccessor(valueAccessor)
      .display(
        (featureIndex) =>
          !unlabelledTerritories.includes(featureIndex) &&
          !smallSquareStates.includes(featureIndex)
      )
      .position((d, path, projection) => {
        if (valueAccessor(d) === 'HI') {
          return labels.positionHawaiiOnGeoAlbersUsa(
            d as GeographiesFeature<MapGeometryProperties, MultiPolygon>,
            projection
          );
        } else if (polylabelStates.includes(valueAccessor(d))) {
          return labels.positionWithPolylabel(d, projection);
        } else {
          return labels.positionAtCentroid(d, path);
        }
      })
      .color({
        default: darkColor,
        contrastAlternative: lightColor,
        pattern: darkColor,
      })
      .fontWeight({ default: 700, contrastAlternative: 400, pattern: 700 });
  }

  updateTooltipForNewOutput(
    data: GeographiesEventOutput<StateIncomeDatum>,
    tooltipEvent: 'hover' | 'click'
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data, tooltipEvent);
  }

  updateTooltipData(data: GeographiesEventOutput<StateIncomeDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(
    data: GeographiesEventOutput<StateIncomeDatum>,
    eventContext: 'hover' | 'click'
  ): void {
    const config = this.tooltip
      .size((size) => size.minWidth(130))
      .geographiesPosition(data?.origin, [
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - 16 : undefined,
        },
      ])
      .hasBackdrop(eventContext === 'click')
      .show(!!data)
      .getConfig();

    this.tooltipConfig.next(config);
  }

  setYear(change: MatButtonToggleChange): void {
    this.selectedYear.next(change.value);
  }

  setBinType(change: MatButtonToggleChange): void {
    this.attributeDataBinType.next(change.value);
  }

  onBackdropClick(): void {
    this.removeTooltipEvent.next();
  }
}

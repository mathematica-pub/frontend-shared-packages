import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import {
  BinStrategy,
  ElementSpacing,
  EventAction,
  FillDef,
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

@Component({
  selector: 'app-geographies-example',
  standalone: true,
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
  providers: [VicGeographiesConfigBuilder, VicHtmlTooltipConfigBuilder],
})
export class GeographiesExampleComponent implements OnInit {
  primaryMarksConfig$: Observable<
    GeographiesConfig<StateIncomeDatum, MapGeometryProperties>
  >;
  width = 700;
  height = 400;
  margin: ElementSpacing = { top: 0, right: 0, bottom: 0, left: 0 };
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

    this.primaryMarksConfig$ = combineLatest([
      this.attributeDataBinType$,
      filteredData$,
    ]).pipe(
      map(([, data]) => this.getPrimaryMarksConfig(data)),
      shareReplay(1)
    );
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
      .fillGeojsonProperties((dimension) =>
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
      .fillGeojsonProperties((dimension) =>
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
    const fillDefs = [
      {
        name: this.patternName,
        useDef: (d) => !!d && d.population < 1000000,
      },
    ];
    if (this.attributeDataBinType.value === BinStrategy.categorical) {
      return this.getCategoricalLayer(data, layer, fillDefs);
    } else if (this.attributeDataBinType.value === BinStrategy.customBreaks) {
      return this.getCustomBreaksLayer(data, layer, fillDefs);
    } else if (
      this.attributeDataBinType.value === BinStrategy.equalFrequencies
    ) {
      return this.getEqualFrequenciesLayer(data, layer, fillDefs);
    } else if (
      this.attributeDataBinType.value === BinStrategy.equalValueRanges
    ) {
      return this.getEqualValueRangesLayer(data, layer, fillDefs);
    } else {
      return this.getNoBinsLayer(data, layer, fillDefs);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataGeographiesFeatures(data: StateIncomeDatum[]): any {
    const statesInData = data.map((x) => x.state);
    return this.basemap.states.features.filter((x) =>
      statesInData.includes(x.properties.name)
    );
  }

  getCategoricalLayer(
    data: StateIncomeDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillDefs: FillDef<StateIncomeDatum>[]
  ): GeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .categoricalBins((dimension) =>
        dimension
          .valueAccessor((d) =>
            d.income > 75000 ? 'high' : d.income > 60000 ? 'middle' : 'low'
          )
          .range(['sandybrown', 'mediumseagreen', colors.highlight.default])
          .fillDefs(fillDefs)
      )
      .labels((labels) => this.getLabels(labels));
  }

  getCustomBreaksLayer(
    data: StateIncomeDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillDefs: FillDef<StateIncomeDatum>[]
  ): GeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .customBreaksBins((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .breakValues([45000, 55000, 65000, 75000, 100000])
          .range([colors.white, colors.highlight.default])
          .fillDefs(fillDefs)
      )
      .labels((labels) => this.getLabels(labels));
  }

  getEqualValueRangesLayer(
    data: StateIncomeDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillDefs: FillDef<StateIncomeDatum>[]
  ): GeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .equalValueRangesBins((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .numBins(6)
          .range([colors.white, colors.highlight.default])
          .fillDefs(fillDefs)
      )
      .labels((labels) => this.getLabels(labels));
  }

  getEqualFrequenciesLayer(
    data: StateIncomeDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillDefs: FillDef<StateIncomeDatum>[]
  ) {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .equalFrequenciesBins((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .numBins(6)
          .range([colors.white, colors.highlight.default])
          .fillDefs(fillDefs)
      )
      .labels((labels) => this.getLabels(labels));
  }

  getNoBinsLayer(
    data: StateIncomeDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillDefs: FillDef<StateIncomeDatum>[]
  ): GeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .noBins((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .range([colors.white, colors.highlight.default])
          .fillDefs(fillDefs)
      )
      .labels((labels) => this.getLabels(labels));
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
      .setSize((size) => size.minWidth(130))
      .createOffsetFromOriginPosition((position) =>
        position.offsetX(data?.positionX).offsetY(data?.positionY)
      )
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

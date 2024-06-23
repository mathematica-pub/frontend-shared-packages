import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MultiPolygon } from 'geojson';
import {
  EventEffect,
  GeographiesClickDirective,
  GeographiesClickEmitTooltipDataPauseHoverMoveEffects,
  GeographiesHoverDirective,
  GeographiesHoverEmitTooltipData,
  Vic,
  VicCategoricalAttributeDataDimension,
  VicColorUtilities,
  VicCustomBreaksAttributeDataDimension,
  VicElementSpacing,
  VicEqualNumObservationsAttributeDataDimension,
  VicEqualValuesAttributeDataDimension,
  VicFillPattern,
  VicGeographiesConfig,
  VicGeographiesDataLayer,
  VicGeographiesEventOutput,
  VicGeographiesFeature,
  VicGeographiesLabels,
  VicGeographiesLabelsPositioners,
  VicGeographiesNoDataLayer,
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
  VicNoBinsAttributeDataDimension,
  VicValuesBin,
  valueFormat,
} from 'projects/viz-components/src/public-api';
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

type AttributeData =
  | VicNoBinsAttributeDataDimension<StateIncomeDatum>
  | VicCategoricalAttributeDataDimension<StateIncomeDatum>
  | VicEqualValuesAttributeDataDimension<StateIncomeDatum>
  | VicEqualNumObservationsAttributeDataDimension<StateIncomeDatum>
  | VicCustomBreaksAttributeDataDimension<StateIncomeDatum>;

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
  attributeDataBinType: BehaviorSubject<string> = new BehaviorSubject<string>(
    VicValuesBin.equalValueRanges
  );
  attributeDataBinType$ = this.attributeDataBinType.asObservable();
  binTypes = [
    VicValuesBin.none,
    VicValuesBin.categorical,
    VicValuesBin.equalValueRanges,
    VicValuesBin.equalNumObservations,
    VicValuesBin.customBreaks,
  ];

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

    this.dataMarksConfig$ = combineLatest([
      this.attributeDataBinType$,
      filteredData$,
    ]).pipe(
      map(([, data]) => this.getDataMarksConfig(data)),
      shareReplay(1)
    );
  }

  getDataMarksConfig(
    data: StateIncomeDatum[]
  ): VicGeographiesConfig<StateIncomeDatum, MapGeometryProperties> {
    const config = Vic.geographies<StateIncomeDatum, MapGeometryProperties>({
      boundary: this.basemap.us,
      featureIndexAccessor: this.featureIndexAccessor,
      noDataLayers: [this.basemap.usOutlineConfig, this.getNoDataLayer(data)],
      dataLayer: this.getDataLayer(data),
    });
    return config;
  }

  getNoDataLayer(
    data: StateIncomeDatum[]
  ): VicGeographiesNoDataLayer<MapGeometryProperties> {
    const statesInData = data.map((x) => x.state);
    const features = this.basemap.states.features.filter(
      (x) => !statesInData.includes(x.properties.name)
    );
    return Vic.geographiesNoDataLayer<MapGeometryProperties>({
      geographies: features,
      categorical: Vic.dimensionCategorical({
        range: ['lightgray'],
        valueAccessor: this.featureIndexAccessor,
      }),
      labels: Vic.geographiesLabels({
        valueAccessor: (d) => d.properties.id,
        display: (featureIndex) =>
          !unlabelledTerritories.includes(featureIndex) &&
          !smallSquareStates.includes(featureIndex),
        color: () => 'magenta',
        fontWeight: () => 700,
      }),
    });
  }

  getDataLayer(
    data: StateIncomeDatum[]
  ): VicGeographiesDataLayer<StateIncomeDatum, MapGeometryProperties> {
    return Vic.geographiesDataLayer<StateIncomeDatum, MapGeometryProperties>({
      data,
      geographies: this.getDataGeographiesFeatures(data),
      attributeDimension: this.getAttributeDataDimension({
        geoAccessor: (d) => d.state,
        fillPatterns: [
          {
            name: this.patternName,
            usePattern: (d) => !!d && d.population < 1000000,
          },
        ],
      }),
      labels: this.getGeographyLabelConfig(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataGeographiesFeatures(data: StateIncomeDatum[]): any {
    const statesInData = data.map((x) => x.state);
    return this.basemap.states.features.filter((x) =>
      statesInData.includes(x.properties.name)
    );
  }

  getAttributeDataDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }): AttributeData {
    switch (this.attributeDataBinType.value) {
      case VicValuesBin.none:
        return this.getNoBinsDimension(properties);
      case VicValuesBin.categorical:
        return this.getCategoricalDimension(properties);
      case VicValuesBin.equalValueRanges:
        return this.getEqualValuesDimension(properties);
      case VicValuesBin.equalNumObservations:
        return this.getEqualNumObservationsDimension(properties);
      case VicValuesBin.customBreaks:
      default:
        return this.getCustomBreaksDimension(properties);
    }
  }

  getNoBinsDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }) {
    return Vic.geographiesDataDimensionNoBins<StateIncomeDatum>({
      valueAccessor: (d) => d.income,
      formatSpecifier: `$${valueFormat.integer}`,
      range: [colors.white, colors.highlight.default],
      geoAccessor: properties.geoAccessor,
      fillPatterns: properties.fillPatterns,
    });
  }

  getCategoricalDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }) {
    const config = Vic.geographiesDataDimensionCategorical<StateIncomeDatum>({
      valueAccessor: (d) =>
        d.income > 75000 ? 'high' : d.income > 60000 ? 'middle' : 'low',
      range: ['sandybrown', 'mediumseagreen', colors.highlight.default],
      geoAccessor: properties.geoAccessor,
      fillPatterns: properties.fillPatterns,
    });
    return config;
  }

  getEqualValuesDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }) {
    const config =
      Vic.geographiesDataDimensionEqualValueRanges<StateIncomeDatum>({
        valueAccessor: (d) => d.income,
        formatSpecifier: `$${valueFormat.integer}`,
        numBins: 6,
        range: [colors.white, colors.highlight.default],
        geoAccessor: properties.geoAccessor,
        fillPatterns: properties.fillPatterns,
      });
    return config;
  }

  getEqualNumObservationsDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }) {
    const config =
      Vic.geographiesDataDimensionEqualNumObservations<StateIncomeDatum>({
        valueAccessor: (d) => d.income,
        formatSpecifier: `$${valueFormat.integer}`,
        numBins: 6,
        range: [colors.white, colors.highlight.default],
        geoAccessor: properties.geoAccessor,
        fillPatterns: properties.fillPatterns,
      });
    return config;
  }

  getCustomBreaksDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }) {
    const config = Vic.geographiesDataDimensionCustomBreaks<StateIncomeDatum>({
      valueAccessor: (d) => d.income,
      formatSpecifier: `$${valueFormat.integer}`,
      breakValues: [45000, 55000, 65000, 75000, 100000],
      range: [colors.white, colors.highlight.default],
      geoAccessor: properties.geoAccessor,
      fillPatterns: properties.fillPatterns,
    });
    return config;
  }

  getGeographyLabelConfig(): VicGeographiesLabels<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    const darkColor = 'rgb(22,80,225)';
    const lightColor = '#FFFFFF';
    const valueAccessor = (d: VicGeographiesFeature<MapGeometryProperties>) =>
      d.properties.id;
    return Vic.geographiesLabels<StateIncomeDatum, MapGeometryProperties>({
      valueAccessor,
      display: (featureIndex) =>
        !unlabelledTerritories.includes(featureIndex) &&
        !smallSquareStates.includes(featureIndex),
      position: (d, path, projection) => {
        if (valueAccessor(d) === 'HI') {
          return VicGeographiesLabelsPositioners.positionHawaiiOnGeoAlbersUsa(
            d as VicGeographiesFeature<MapGeometryProperties, MultiPolygon>,
            projection
          );
        } else if (polylabelStates.includes(valueAccessor(d))) {
          return VicGeographiesLabelsPositioners.positionWithPolylabel(
            d,
            projection
          );
        } else {
          return VicGeographiesLabelsPositioners.positionAtCentroid(d, path);
        }
      },
      color: (d, backgroundColor) => {
        return backgroundColor.slice(0, 3) === 'url'
          ? darkColor
          : VicColorUtilities.getHigherContrastColorForBackground(
              backgroundColor,
              darkColor,
              lightColor
            );
      },
      fontWeight: (d, backgroundColor) => {
        return backgroundColor.slice(0, 3) === 'url'
          ? 700
          : VicColorUtilities.getHigherContrastColorForBackground(
              backgroundColor,
              darkColor,
              lightColor
            ) === darkColor
          ? 700
          : 400;
      },
    });
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

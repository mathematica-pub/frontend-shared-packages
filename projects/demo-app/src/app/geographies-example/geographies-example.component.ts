import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MultiPolygon } from 'geojson';
import { VicColorUtilities } from 'projects/viz-components/src/lib/core/utilities/colors';
import { VicGeographiesConfig } from 'projects/viz-components/src/lib/geographies/config/geographies-config';
import { VicGeographiesAttributeDataLayerBuilder } from 'projects/viz-components/src/lib/geographies/config/layers/attribute-data-layer/attribute-data-layer-builder';
import { VicGeographiesGeojsonPropertiesLayerBuilder } from 'projects/viz-components/src/lib/geographies/config/layers/geojson-properties-layer/geojson-properties-layer-builder';
import { VicGeographiesLabelsBuilder } from 'projects/viz-components/src/lib/geographies/config/layers/labels/geographies-labels-builder';
import {
  EventEffect,
  GeographiesClickDirective,
  GeographiesClickEmitTooltipDataPauseHoverMoveEffects,
  GeographiesHoverDirective,
  GeographiesHoverEmitTooltipData,
  VicElementSpacing,
  VicFillPattern,
  VicGeographiesBuilder,
  VicGeographiesEventOutput,
  VicGeographiesFeature,
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
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
  providers: [VicGeographiesBuilder],
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
    VicValuesBin.equalFrequencies,
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
    private basemap: BasemapService,
    private geographies: VicGeographiesBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >
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
    const config = this.geographies
      .boundary(this.basemap.us)
      .featureIndexAccessor(this.featureIndexAccessor)
      .createGeojsonPropertiesLayer((layer) => this.getUsOutlineConfig(layer))
      .createGeojsonPropertiesLayer((layer) => this.getNoDataLayer(data, layer))
      .createAttributeDataLayer((layer) => this.getDataLayer(data, layer))
      .build();
    return config;
  }

  getUsOutlineConfig(
    layer: VicGeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties>
  ): VicGeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties> {
    return layer
      .geographies(this.basemap.us.features)
      .strokeColor(colors.base)
      .strokeWidth('1')
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.properties.name).range(['none'])
      );
  }

  getNoDataLayer(
    data: StateIncomeDatum[],
    layer: VicGeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties>
  ): VicGeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties> {
    const statesInData = data.map((x) => x.state);
    const features = this.basemap.states.features.filter(
      (x) => !statesInData.includes(x.properties.name)
    );
    const valueAccessor = (d: VicGeographiesFeature<MapGeometryProperties>) =>
      d.properties.id;
    return layer
      .geographies(features)
      .createCategoricalDimension((dimension) =>
        dimension.range(['lightgray']).valueAccessor(this.featureIndexAccessor)
      )
      .createLabels((labels) =>
        labels
          .valueAccessor(valueAccessor)
          .display(
            (featureIndex) =>
              !unlabelledTerritories.includes(featureIndex) &&
              !smallSquareStates.includes(featureIndex)
          )
          .color(() => 'magenta')
          .fontWeight(() => 700)
      )
      .enableEffects(true);
  }

  getDataLayer(
    data: StateIncomeDatum[],
    layer: VicGeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >
  ): VicGeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    const fillPatterns = [
      {
        name: this.patternName,
        usePattern: (d) => !!d && d.population < 1000000,
      },
    ];
    if (this.attributeDataBinType.value === VicValuesBin.categorical) {
      return this.getCategoricalLayer(data, layer, fillPatterns);
    } else if (this.attributeDataBinType.value === VicValuesBin.customBreaks) {
      return this.getCustomBreaksLayer(data, layer, fillPatterns);
    } else if (
      this.attributeDataBinType.value === VicValuesBin.equalFrequencies
    ) {
      return this.getEqualFrequenciesLayer(data, layer, fillPatterns);
    } else if (
      this.attributeDataBinType.value === VicValuesBin.equalValueRanges
    ) {
      return this.getEqualValueRangesLayer(data, layer, fillPatterns);
    } else {
      return this.getNoBinsLayer(data, layer, fillPatterns);
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
    layer: VicGeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillPatterns: VicFillPattern<StateIncomeDatum>[]
  ): VicGeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .createCategoricalBinsDimension((dimension) =>
        dimension
          .valueAccessor((d) =>
            d.income > 75000 ? 'high' : d.income > 60000 ? 'middle' : 'low'
          )
          .range(['sandybrown', 'mediumseagreen', colors.highlight.default])
          .fillPatterns(fillPatterns)
      )
      .createLabels((labels) => this.getLabels(labels));
  }

  getCustomBreaksLayer(
    data: StateIncomeDatum[],
    layer: VicGeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillPatterns: VicFillPattern<StateIncomeDatum>[]
  ): VicGeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .createCustomBreaksBinsDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .breakValues([45000, 55000, 65000, 75000, 100000])
          .range([colors.white, colors.highlight.default])
          .fillPatterns(fillPatterns)
      )
      .createLabels((labels) => this.getLabels(labels));
  }

  getEqualValueRangesLayer(
    data: StateIncomeDatum[],
    layer: VicGeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillPatterns: VicFillPattern<StateIncomeDatum>[]
  ): VicGeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .createEqualValueRangesBinsDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .numBins(6)
          .range([colors.white, colors.highlight.default])
          .fillPatterns(fillPatterns)
      )
      .createLabels((labels) => this.getLabels(labels));
  }

  getEqualFrequenciesLayer(
    data: StateIncomeDatum[],
    layer: VicGeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillPatterns: VicFillPattern<StateIncomeDatum>[]
  ) {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .createEqualFrequenciesBinsDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .numBins(6)
          .range([colors.white, colors.highlight.default])
          .fillPatterns(fillPatterns)
      )
      .createLabels((labels) => this.getLabels(labels));
  }

  getNoBinsLayer(
    data: StateIncomeDatum[],
    layer: VicGeographiesAttributeDataLayerBuilder<
      StateIncomeDatum,
      MapGeometryProperties
    >,
    fillPatterns: VicFillPattern<StateIncomeDatum>[]
  ): VicGeographiesAttributeDataLayerBuilder<
    StateIncomeDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.getDataGeographiesFeatures(data))
      .geographyIndexAccessor((d) => d.state)
      .createNoBinsDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.income)
          .formatSpecifier(`$${valueFormat.integer}`)
          .range([colors.white, colors.highlight.default])
          .fillPatterns(fillPatterns)
      )
      .createLabels((labels) => this.getLabels(labels));
  }

  getLabels(
    labels: VicGeographiesLabelsBuilder<StateIncomeDatum, MapGeometryProperties>
  ): VicGeographiesLabelsBuilder<StateIncomeDatum, MapGeometryProperties> {
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
            d as VicGeographiesFeature<MapGeometryProperties, MultiPolygon>,
            projection
          );
        } else if (polylabelStates.includes(valueAccessor(d))) {
          return labels.positionWithPolylabel(d, projection);
        } else {
          return labels.positionAtCentroid(d, path);
        }
      })
      .color((d, backgroundColor) => {
        return backgroundColor.slice(0, 3) === 'url'
          ? darkColor
          : VicColorUtilities.getHigherContrastColorForBackground(
              backgroundColor,
              darkColor,
              lightColor
            );
      })
      .fontWeight((d, backgroundColor) => {
        return backgroundColor.slice(0, 3) === 'url'
          ? 700
          : VicColorUtilities.getHigherContrastColorForBackground(
              backgroundColor,
              darkColor,
              lightColor
            ) === darkColor
          ? 700
          : 400;
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

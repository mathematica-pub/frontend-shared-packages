import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MultiPolygon } from 'geojson';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { valueFormat } from 'projects/viz-components/src/lib/core/utilities/value-format';
import { VicFillPattern } from 'projects/viz-components/src/lib/data-dimensions/fill-pattern';
import { EventEffect } from 'projects/viz-components/src/lib/events/effect';
import { VicValuesBin } from 'projects/viz-components/src/lib/geographies/config/dimensions/attribute-data-bin-types';
import {
  VicCategoricalAttributeDataDimension,
  vicCategoricalAttributeDataDimension,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/categorical-bins';
import {
  VicCustomBreaksAttributeDataDimension,
  vicCustomBreaksAttributeDataDimension,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/custom-breaks-bins';
import {
  VicDataGeographies,
  vicDataGeographies,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/data-geographies';
import {
  VicEqualNumObservationsAttributeDataDimension,
  vicEqualNumObservationsAttributeDataDimension,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/equal-num-observations-bins';
import {
  VicEqualValuesAttributeDataDimension,
  vicEqualValuesAttributeDataDimension,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/equal-value-ranges-bins';
import {
  VicNoBinsAttributeDataDimension,
  vicNoBinsAttributeDataDimension,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/no-bins';
import {
  VicNoDataGeographies,
  vicNoDataGeographies,
} from 'projects/viz-components/src/lib/geographies/config/dimensions/no-data-geographies';
import { VicGeographiesLabels } from 'projects/viz-components/src/lib/geographies/config/geographies-labels';
import { VicGeographiesLabelsPositioners } from 'projects/viz-components/src/lib/geographies/config/geographies-labels-positioners';
import {
  VicGeographiesConfig,
  vicGeographies,
} from 'projects/viz-components/src/lib/geographies/config/geographies.config';
import { GeographiesClickEmitTooltipDataPauseHoverMoveEffects } from 'projects/viz-components/src/lib/geographies/geographies-click-effects';
import { GeographiesClickDirective } from 'projects/viz-components/src/lib/geographies/geographies-click.directive';
import { VicGeographiesFeature } from 'projects/viz-components/src/lib/geographies/geographies-feature';
import { GeographiesHoverEmitTooltipData } from 'projects/viz-components/src/lib/geographies/geographies-hover-effects';
import { GeographiesHoverDirective } from 'projects/viz-components/src/lib/geographies/geographies-hover.directive';
import { VicGeographiesEventOutput } from 'projects/viz-components/src/lib/geographies/geographies-tooltip-data';
import { VicColorUtilities } from 'projects/viz-components/src/lib/shared/color-utilities.class';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.config';
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
    const noDataStatesConfig = this.getNoDataGeographies(data);
    const config = vicGeographies<StateIncomeDatum, MapGeometryProperties>({
      boundary: this.basemap.us,
      data,
      noDataGeographies: [this.basemap.usOutlineConfig, noDataStatesConfig],
      dataGeographies: this.getDataGeographiesConfig(data),
    });
    return config;
  }

  getNoDataGeographies(
    data: StateIncomeDatum[]
  ): VicNoDataGeographies<StateIncomeDatum, MapGeometryProperties> {
    const statesInData = data.map((x) => x.state);
    const features = this.basemap.states.features.filter(
      (x) => !statesInData.includes(x.properties.name)
    );
    const labels = this.getGeographyLabelConfig();
    return vicNoDataGeographies<StateIncomeDatum, MapGeometryProperties>({
      geographies: features,
      labels: labels,
      fill: 'lightgray',
    });
  }

  getDataGeographiesConfig(
    data: StateIncomeDatum[]
  ): VicDataGeographies<StateIncomeDatum, MapGeometryProperties> {
    const config = vicDataGeographies<StateIncomeDatum, MapGeometryProperties>({
      geographies: this.getDataGeographiesFeatures(data),
      featureIndexAccessor: this.featureIndexAccessor,
      attributeData: this.getAttributeDataDimension({
        geoAccessor: (d) => d.state,
        fillPatterns: [
          {
            name: this.patternName,
            predicate: (d) => !!d && d.population < 1000000,
          },
        ],
      }),
      labels: this.getGeographyLabelConfig(),
    });
    return config;
  }

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
    return vicNoBinsAttributeDataDimension<StateIncomeDatum>({
      valueAccessor: (d) => d.income,
      valueFormat: `$${valueFormat.integer}`,
      range: [colors.white, colors.highlight.default],
      geoAccessor: properties.geoAccessor,
      fillPatterns: properties.fillPatterns,
    });
  }

  getCategoricalDimension(properties: {
    geoAccessor: (d: StateIncomeDatum) => string;
    fillPatterns: VicFillPattern<StateIncomeDatum>[];
  }) {
    const config = vicCategoricalAttributeDataDimension<StateIncomeDatum>({
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
    const config = vicEqualValuesAttributeDataDimension<StateIncomeDatum>({
      valueAccessor: (d) => d.income,
      valueFormat: `$${valueFormat.integer}`,
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
      vicEqualNumObservationsAttributeDataDimension<StateIncomeDatum>({
        valueAccessor: (d) => d.income,
        valueFormat: `$${valueFormat.integer}`,
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
    const config = vicCustomBreaksAttributeDataDimension<StateIncomeDatum>({
      valueAccessor: (d) => d.income,
      valueFormat: `$${valueFormat.integer}`,
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
    const labelConfig = new VicGeographiesLabels<
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

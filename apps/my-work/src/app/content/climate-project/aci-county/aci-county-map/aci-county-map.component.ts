import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ElementSpacing,
  GeographiesAttributeDataLayerBuilder,
  GeographiesConfig,
  GeographiesFeature,
  GeographiesGeojsonPropertiesLayerBuilder,
  GeographiesLabelsBuilder,
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
  VicMapChartModule,
  VicMapLegendModule,
} from '@hsi/viz-components';
import { colors } from 'apps/demo-app/src/app/core/constants/colors.constants';
import { MapGeometryProperties } from 'apps/demo-app/src/app/core/services/basemap';
import { BasemapService } from 'apps/demo-app/src/app/core/services/basemap.service';
import { ACICountyDatum } from '../aci-county.component';

@Component({
  selector: 'app-aci-county-map',
  standalone: true,
  imports: [
    CommonModule,
    VicMapChartModule,
    VicGeographiesModule,
    VicMapLegendModule,
  ],
  providers: [VicGeographiesConfigBuilder],
  templateUrl: './aci-county-map.component.html',
  styleUrls: ['../aci-county-charts.scss', './aci-county-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AciCountyMapComponent implements OnInit {
  @Input() data: ACICountyDatum[];
  chartHeight = 400;
  primaryMarksConfig: GeographiesConfig<ACICountyDatum, MapGeometryProperties>;
  width = 700;
  height = 400;
  margin: ElementSpacing = { top: 16, right: 40, bottom: 0, left: 40 };
  outlineColor = colors.base;
  featureIndexAccessor = (d: GeographiesFeature<MapGeometryProperties>) =>
    d.properties.name;

  constructor(
    // private bars: VicBarsConfigBuilder<ACICountyDatum, string>,
    // private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>,
    // private xOrdinalAxis: VicXOrdinalAxisConfigBuilder<string>
    private basemap: BasemapService,
    private geographies: VicGeographiesConfigBuilder<
      ACICountyDatum,
      MapGeometryProperties
    >
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.basemap.initMap();
    this.setProperties();
  }

  logFeatureProperties(): void {
    if (this.basemap.us && this.basemap.us.features.length > 0) {
      console.log(
        'Feature properties:',
        this.basemap.us.features[0].properties
      );
    } else {
      console.error('No features available to log properties.');
    }
  }

  setProperties(): void {
    if (!this.basemap.us) {
      console.error('Basemap US data is not initialized');
      return;
    }

    this.primaryMarksConfig = this.setPrimaryMarksConfig(this.data);
  }

  setPrimaryMarksConfig(
    data: ACICountyDatum[]
  ): GeographiesConfig<ACICountyDatum, MapGeometryProperties> {
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
      .stroke((stroke) => stroke.color(this.outlineColor).width(1))
      .fillGeojsonProperties((dimension) =>
        dimension.valueAccessor((d) => d.properties.name).range(['none'])
      );
  }

  getNoDataLayer(
    data: ACICountyDatum[],
    layer: GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties>
  ): GeographiesGeojsonPropertiesLayerBuilder<MapGeometryProperties> {
    const countiesInData = data.map((x) => x.countyFips);
    const features = this.basemap.counties.features.filter(
      (x) => !countiesInData.includes(x.properties.id)
    );
    return layer
      .geographies(features)
      .fillGeojsonProperties((dimension) =>
        dimension.range(['lightgray']).valueAccessor((d) => d.properties.id)
      )
      .labels((labels) =>
        labels
          .valueAccessor((d) => d.properties.id)
          .display(() => true)
          .color('magenta')
          .fontWeight(700)
      )
      .enableEventActions(true);
  }

  getDataLayer(
    data: ACICountyDatum[],
    layer: GeographiesAttributeDataLayerBuilder<
      ACICountyDatum,
      MapGeometryProperties
    >
  ): GeographiesAttributeDataLayerBuilder<
    ACICountyDatum,
    MapGeometryProperties
  > {
    return layer
      .data(data)
      .geographies(this.basemap.counties.features)
      .geographyIndexAccessor((d) => d.countyFips)
      .noBins((dimension) =>
        dimension
          .valueAccessor((d) => d.ACIOverall)
          .formatSpecifier(',.2f')
          .range(['#2cafb0'])
      )
      .labels((labels) => this.getLabels(labels));
  }

  getLabels(
    labels: GeographiesLabelsBuilder<MapGeometryProperties>
  ): GeographiesLabelsBuilder<MapGeometryProperties> {
    const darkColor = 'rgb(22,80,225)';
    const lightColor = '#FFFFFF';
    return labels
      .valueAccessor((d) => d.properties.id)
      .display(() => true)
      .position((d, path) => labels.positionAtCentroid(d, path))
      .color({
        default: darkColor,
        contrastAlternative: lightColor,
        pattern: darkColor,
      })
      .fontWeight({ default: 700, contrastAlternative: 400, pattern: 700 });
  }
}

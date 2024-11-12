import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BarsConfig,
  VicBarsConfigBuilder,
  VicBarsModule,
  VicOrdinalAxisConfig,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { EnergyIntensityDatum } from 'apps/my-work/src/app/content/examples/energy-intensity/energy-intensity.component';
import { DataService } from 'apps/my-work/src/app/core/services/data.service';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { map, Observable } from 'rxjs';
// import { DataService } from '../../../core/services/data.service';
// import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
// import { EnergyIntensityDatum } from '../../examples/energy-intensity/energy-intensity.component';

interface MyData {
  date: Date;
  industry: string;
  unemployed: number;
}

@Component({
  selector: 'app-my-chart',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    VicXyChartModule,
    VicYOrdinalAxisModule,
    VicBarsModule,
  ],
  providers: [VicBarsConfigBuilder, VicYOrdinalAxisConfigBuilder],
  templateUrl: './my-chart.component.html',
  styleUrl: './my-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyChartComponent implements OnInit {
  dataPath = 'content/data/industry_unemployment.json';
  data$: Observable<MyData>;
  config$: Observable<BarsConfig<any, any>>; // should eventually be typed
  chartHeight = 500;
  yAxisConfig: VicOrdinalAxisConfig<string>;
  sortedDataConfig: BarsConfig<EnergyIntensityDatum, string>;
  barsData$: Observable<EnergyIntensityDatum[]>;

  constructor(
    public dataService: DataService,
    private barsConfig: VicBarsConfigBuilder<any, string>, // should eventually be typed
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>
  ) {}

  ngOnInit() {
    this.yAxisConfig = this.yOrdinalAxis.getConfig();

    this.data$ = this.dataService
      .getDataFile(this.dataPath)
      .pipe(map((data: MyData[]) => (data as any).data));

    this.config$ = this.data$.pipe(
      map((data) => {
        return this.barsConfig
          .data(data as any)
          .orientation('horizontal')
          .createOrdinalDimension((dimension) =>
            dimension.valueAccessor((d) => d.industry)
          )
          .getConfig();
      })
    );

    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      map((data) => {
        const transformed: EnergyIntensityDatum[] = data.map((x) => {
          const obj: EnergyIntensityDatum = {
            category: x.category,
            geography: x.geography,
            date: new Date(x.date),
            units: x.units,
            name: x.name,
            value: x.value && !isNaN(x.value) ? +x.value : null,
          };
          return obj;
        });
        console.log('transformed', transformed);
        return transformed;
      })
    );

    this.barsData$ = data$.pipe(
      map((data) => data.filter((d) => d.date.getFullYear() === 2020))
    );

    const sortedData = [];
    // const sortedData = this.data
    //   .filter((x) => x.category === this.sortVar && x.value !== null)
    //   .slice()
    //   .sort((a, b) => {
    //     if (a.value > b.value) return -1;
    //     if (b.value > a.value) return 1;
    //     else return 0;
    //   });

    this.sortedDataConfig = this.barsConfig
      .data(sortedData)
      .orientation('horizontal')
      .createQuantitativeDimension((dimension) =>
        dimension
          .valueAccessor((d) => d.value * 1000)
          .formatSpecifier(',.0f')
          .domainPaddingPixels(16)
      )
      .createOrdinalDimension((dimension) =>
        dimension.valueAccessor((d) => d.geography)
      )
      .createCategoricalDimension((dimension) => dimension.range(['#2cafb0']))
      .createLabels((labels) =>
        labels
          .display(true)
          .color({ default: '#2cafb0', withinBarAlternative: 'white' })
      )
      .getConfig();
  }
}

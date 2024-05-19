import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  VicXOrdinalAxisConfig,
  vicXOrdinalAxis,
} from 'projects/viz-components/src/lib/axes/x-ordinal/x-ordinal-axis.config';
import {
  VicYQuantitativeAxisConfig,
  vicYQuantitativeAxis,
} from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { vicCategoricalDimension } from 'projects/viz-components/src/lib/data-marks/dimensions/categorical-dimension';
import { vicOrdinalDimension } from 'projects/viz-components/src/lib/data-marks/dimensions/ordinal-dimension';
import { vicQuantitativeDimension } from 'projects/viz-components/src/lib/data-marks/dimensions/quantitative-dimension';
import {
  VicStackedBarsConfig,
  vicVerticalStackedBars,
} from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars.config';
import {
  VicChartModule,
  VicStackedBarsModule,
  VicXOrdinalAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../../core/models/data';
import { DataService } from '../../core/services/data.service';
import { ExampleDisplayComponent } from '../../example-display/example-display.component';

interface ViewModel {
  dataConfig: VicStackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: VicXOrdinalAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  standalone: true,
  selector: 'app-stacked-bars-example',
  imports: [
    CommonModule,
    ExampleDisplayComponent,
    VicChartModule,
    VicStackedBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYQuantitativeAxisModule,
    VicXOrdinalAxisModule,
  ],
  templateUrl: './stacked-bars-example.component.html',
  styleUrls: ['./stacked-bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StackedBarsExampleComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: VicElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  folderName = 'stacked-bars-example';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.industryUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: IndustryUnemploymentDatum[]): ViewModel {
    const yearlyData = data.filter(
      (d) => d.date.getUTCDate() === 1 && d.date.getUTCMonth() === 0
    );
    const xAxisConfig = vicXOrdinalAxis<Date>({
      tickFormat: '%Y',
    });
    const yAxisConfig = vicYQuantitativeAxis<number>({
      tickFormat: ',.0f',
    });
    const dataConfig = vicVerticalStackedBars<IndustryUnemploymentDatum, Date>({
      data: yearlyData,
      ordinal: vicOrdinalDimension({
        valueAccessor: (d) => d.date,
      }),
      quantitative: vicQuantitativeDimension({
        valueAccessor: (d) => d.value,
      }),
      categorical: vicCategoricalDimension({
        valueAccessor: (d) => d.industry,
      }),
    });
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}

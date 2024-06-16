import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VicXOrdinalAxisConfig } from 'projects/viz-components/src/lib/axes/x-ordinal/x-ordinal-axis.config';
import { VicYQuantitativeAxisConfig } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.config';
import { VicElementSpacing } from 'projects/viz-components/src/lib/core/types/layout';
import { VicStackedBarsConfig } from 'projects/viz-components/src/lib/stacked-bars/config/stacked-bars.config';
import { Vic } from 'projects/viz-components/src/public-api';
import { Observable, filter, map } from 'rxjs';
import { IndustryUnemploymentDatum } from '../core/models/data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: VicStackedBarsConfig<IndustryUnemploymentDatum, Date>;
  xAxisConfig: VicXOrdinalAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-stacked-bars-example',
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
    const xAxisConfig = Vic.axisXOrdinal<Date>({
      tickFormat: '%Y',
    });
    const yAxisConfig = Vic.axisYQuantitative<number>({
      tickFormat: ',.0f',
    });
    const dataConfig = Vic.stackedBarsVertical<IndustryUnemploymentDatum, Date>(
      {
        data: yearlyData,
        ordinal: Vic.dimensionOrdinal({
          valueAccessor: (d) => d.date,
        }),
        quantitative: Vic.dimensionQuantitativeNumeric({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical({
          valueAccessor: (d) => d.industry,
        }),
      }
    );
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }
}

import { Component } from '@angular/core';
import {
  AxisConfig,
  BarsConfig,
  horizontalBarChartDimensionsConfig,
} from 'projects/viz-components/src/public-api';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
})
export class BarsComponent {
  data: any;
  xAxisConfig: any;
  yAxisConfig: any;
  dataConfig: any;
  width = 1000;
  height = 1000;

  constructor(dataService: DataService) {
    dataService.getEmploymentData().subscribe({
      next: (value) => {
        console.log(value);
        this.data = value;
        this.setChartProperties();
      },
      error: (error) => console.log(error),
    });
  }
  setChartProperties(): void {
    if (!this.data) return;
    const filteredData = this.data.filter(
      (d) => d.data.getFullYear() === 2008 && d.data.getMonth() === 3
    );
    this.xAxisConfig = new AxisConfig();
    this.xAxisConfig.tickFormat = '.1f';
    this.yAxisConfig = new AxisConfig();
    this.dataConfig = new BarsConfig();
    this.dataConfig.data = filteredData;
    this.dataConfig.dimensions = horizontalBarChartDimensionsConfig;
    this.dataConfig.ordinal.valueAccessor = (d) => d.division;
    this.dataConfig.quantitative.valueAccessor = (d) => d.value;
  }
}

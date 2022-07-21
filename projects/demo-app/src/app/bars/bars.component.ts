import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AxisConfig,
  BarsConfig,
  horizontalBarChartDimensionsConfig,
} from 'projects/viz-components/src/public-api';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
})
export class BarsComponent implements OnInit, OnChanges {
  @Input() data: any;
  xAxisConfig: any;
  yAxisConfig: any;
  dataConfig: any;
  width = 1000;
  height = 1000;

  constructor() {}

  ngOnInit(): void {
    this.setChartProperties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setChartProperties();
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

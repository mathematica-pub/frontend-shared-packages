import { Component, OnInit } from '@angular/core';
import {
  AxisConfig,
  ElementSpacing,
  LinesConfig,
  LinesTooltipData,
} from 'projects/viz-components/src/public-api';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { MetroUnemploymentDatum } from '../core/models/unemployement-data';
import { DataService } from '../core/services/data.service';

interface ViewModel {
  dataConfig: LinesConfig;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
  labels: string[];
}
@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
  vm$: Observable<ViewModel>;
  margin: ElementSpacing = {
    top: 8,
    right: 0,
    bottom: 36,
    left: 64,
  };
  tooltipData: BehaviorSubject<LinesTooltipData> =
    new BehaviorSubject<LinesTooltipData>(null);
  tooltipData$ = this.tooltipData.asObservable();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.vm$ = this.dataService.metroUnemploymentData$.pipe(
      filter((x) => !!x),
      map((x) => this.getViewModel(x))
    );
  }

  getViewModel(data: MetroUnemploymentDatum[]): ViewModel {
    const xAxisConfig = new AxisConfig();
    xAxisConfig.tickFormat = '%Y';
    const yAxisConfig = new AxisConfig();
    const dataConfig = new LinesConfig();
    dataConfig.data = data;
    dataConfig.x.valueAccessor = (d) => d.date;
    dataConfig.y.valueAccessor = (d) => d.value;
    dataConfig.category.valueAccessor = (d) => d.division;
    const labels = [...new Set(data.map((x) => x.division))].slice(0, 9);
    return {
      dataConfig,
      xAxisConfig,
      yAxisConfig,
      labels,
    };
  }

  processTooltipData(data: LinesTooltipData): void {
    console.log(data);
    this.tooltipData.next(data);
  }

  highlightLine(label: string): void {}
}

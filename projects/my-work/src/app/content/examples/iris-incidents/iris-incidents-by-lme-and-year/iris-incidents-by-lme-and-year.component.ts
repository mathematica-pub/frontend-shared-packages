import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  LinesConfig,
  VicChartModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisModule,
} from '@hsi/viz-components';
import { IrisIncident } from '../iris-incidents.component';

interface IrisIncidentGroup {
  lme: string;
  year: number;
  count: number;
}
@Component({
  selector: 'app-iris-incidents-by-lme-and-year',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicLinesModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
    VicXyChartModule,
  ],
  templateUrl: './iris-incidents-by-lme-and-year.component.html',
  styleUrl: './iris-incidents-by-lme-and-year.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VicLinesConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
})
export class IrisIncidentsByLmeAndYearComponent implements OnInit {
  @Input() data: IrisIncident[];
  xAxisConfig: VicQuantitativeAxisConfig<number>;
  yAxisConfig: VicQuantitativeAxisConfig<number>;
  linesConfig: LinesConfig<IrisIncidentGroup>;

  constructor(
    private lines: VicLinesConfigBuilder<IrisIncidentGroup>,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.setProperties();
  }

  setProperties(): void {
    const aggregated = {};

    this.data.forEach((incident) => {
      const key = `${incident.year}-${incident.lme}`;
      aggregated[key] ||= {
        year: incident.year,
        lme: incident.lme,
        count: 0,
      };

      aggregated[key].count++;
    });

    const rollupData = Object.values(aggregated) as IrisIncidentGroup[];
    this.linesConfig = this.lines
      .data(rollupData)
      .createXDateDimension((dimension) =>
        dimension.valueAccessor((d) => new Date(d.year, 0, 1))
      )
      .createYDimension((dimension) =>
        dimension.valueAccessor((d) => d.count).domainPaddingPixels(20)
      )
      .createCategoricalDimension((dimension) =>
        dimension.valueAccessor((d) => d.lme)
      )
      .getConfig();

    this.xAxisConfig = this.xQuantitativeAxis.tickFormat('%Y').getConfig();
    this.yAxisConfig = this.yQuantitativeAxis.getConfig();
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { Observable } from 'rxjs';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { dataPath } from '../data-paths.constants';
import {
  IcaDatum,
  IcaDotPlotComponent,
} from './ica-dot-plot/ica-dot-plot.component';

interface SelectionForm {
  measureCode: AbstractControl<string>;
  delivSys: AbstractControl<string>;
  stratVal: AbstractControl<string>;
}

@Component({
  selector: 'app-ica',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    IcaDotPlotComponent,
    ReactiveFormsModule,
  ],
  providers: [CaChartService],
  templateUrl: './ica.component.html',
  styleUrl: './ica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IcaComponent implements OnInit {
  dataPath = dataPath.csa;
  data$: Observable<IcaDatum[]>;
  filter$: Observable<FormGroup<SelectionForm>>;
  filteredData$: Observable<IcaDatum[]>;
  myForm: FormGroup;
  filters = {
    delivSyss: [],
    measureCodes: [],
    stratVals: [],
  };
  filterTypes = ['delivSys', 'measureCode', 'stratVal'];

  constructor(public caChartService: CaChartService) {}

  ngOnInit(): void {
    const caChartDataConfig: CaChartDataConfig = {
      filters: this.filters,
      filterTypes: this.filterTypes,
      dataPath: this.dataPath,
      getTransformedData: this.getTransformedData.bind(this),
    };
    this.caChartService.init(caChartDataConfig);
  }

  getTransformedData(x: IcaDatum[]): IcaDatum[] {
    const transformed: IcaDatum[] = x.map((x: any) => {
      let county = x.County === 'NULL' ? x.MCP_RepUnit : x.County;
      county = county === 'Riverside/San Bernardino' ? 'Riverside/SB' : county;
      const obj: IcaDatum = {
        series: 'percentile',
        size: x.County_Size,
        county: county,
        measureCode: x.Measure_Code,
        stratVal: this.getStratVal(x),
        delivSys: x.DelivSys,
        units: x.Units,
        value: null,
        planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
        ica_25: x.ICA_25 && !isNaN(x.ICA_25) ? +x.ICA_25 : null,
        ica_75: x.ICA_75 && !isNaN(x.ICA_75) ? +x.ICA_75 : null,
        directionality: x.Directionality,
        plans: [],
      };
      return obj;
    });
    return transformed;
  }

  getStratVal(x: any): string {
    return x.StratVal;
  }
}

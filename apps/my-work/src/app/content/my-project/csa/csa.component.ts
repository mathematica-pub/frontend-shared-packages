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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataService } from 'apps/my-work/src/app/core/services/data.service';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { ascending } from 'd3';
import { combineLatest, debounceTime, filter, map, Observable } from 'rxjs';
import {
  CsaDatum,
  CsaDotPlotComponent,
} from './csa-dot-plot/csa-dot-plot.component';

interface SelectionForm {
  measureCode: AbstractControl<string>;
  delivSys: AbstractControl<string>;
  stratVal: AbstractControl<string>;
}

interface Option {
  name: string;
  disabled: boolean;
}

@Component({
  selector: 'app-csa',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    CsaDotPlotComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './csa.component.html',
  styleUrl: './csa.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CsaComponent implements OnInit {
  dataPath = 'content/data/Mock_Statistical_Results.csv';
  data$: Observable<CsaDatum[]>;
  filter$: Observable<FormGroup<SelectionForm>>;
  filteredData$: Observable<CsaDatum[]>;
  myForm: FormGroup;
  measureCodes: Option[] = [];
  stratVals: Option[] = [];
  delivSyss: Option[] = [];
  filterTypes = ['delivSys', 'measureCode', 'stratVal'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.setData();
    this.setForm();
  }

  setData(): void {
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      filter((data) => data.length > 0),
      map((data) => {
        const transformed: CsaDatum[] = data.map((x: any) => {
          const obj: CsaDatum = {
            series: 'percentile',
            size: x.County_Size,
            measureCode: x.Measure_Code,
            stratVal: x.StratVal,
            delivSys: x.DelivSys,
            units: x.Units,
            value:
              x.CSA_25 && !isNaN(x.CSA_25) && x.CSA_75 && !isNaN(x.CSA_75)
                ? Math.abs(x.CSA_75 - x.CSA_25)
                : null,
            planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
            csa_25: x.CSA_25 && !isNaN(x.CSA_25) ? +x.CSA_25 : null,
            csa_75: x.CSA_75 && !isNaN(x.CSA_75) ? +x.CSA_75 : null,
            CSA_CompVal:
              x.CSA_CompVal && !isNaN(x.CSA_CompVal) ? +x.CSA_CompVal : null,
            CSA_CompVal_Desc: x.CSA_CompVal_Desc,
            directionality: x.Directionality,
            CSA_PctBelowComp:
              x.CSA_PctBelowComp && !isNaN(x.CSA_PctBelowComp)
                ? +x.CSA_PctBelowComp
                : null,
            plans: [],
          };
          return obj;
        });
        return transformed;
      })
    );

    this.data$ = data$.pipe(
      map((data: CsaDatum[]) => {
        this.setOptions(data);
        this.filterTypes.forEach((type: string) => {
          this.myForm.controls[type].setValue(this[`${type}s`][0].name);
        });
        return data;
      })
    );
  }

  setOptions(data: CsaDatum[]): void {
    this.filterTypes.forEach((type: string) => {
      this[`${type}s`] = this.getOptions(data, type);
    });
  }

  setForm(): void {
    const controls = {};
    this.filterTypes.forEach((type: string) => {
      controls[type] = new FormControl();
    });
    this.myForm = new FormGroup(controls);

    this.filter$ = this.myForm.valueChanges.pipe(
      filter((form) => form !== undefined)
    );

    this.filteredData$ = combineLatest([this.data$, this.filter$]).pipe(
      debounceTime(10),
      map(([data, filters]) => this.getFilteredData(data, filters))
    );
  }

  getFilteredData(data: CsaDatum[], filters: any): CsaDatum[] {
    this.setOptions(data);
    this.setValidValues();
    let filteredData = data;
    this.filterTypes.forEach((type: string) => {
      filteredData = filteredData.filter(
        (plan) => plan[type] === filters[type]
      );
    });
    return filteredData;
  }

  getOptions(data: CsaDatum[], type: string): Option[] {
    const options = [...new Set(data.map((x) => x[type]).sort(ascending))].map(
      (x: string) => ({
        name: x,
        disabled: this.getDisabled(data, type, x),
      })
    );
    return options;
  }

  getDisabled(data: CsaDatum[], type: string, selectedOption: string): boolean {
    const type1 = this.myForm.controls[this.filterTypes[0]].value;
    let count = Infinity;
    if (type === this.filterTypes[1]) {
      count = data.filter(
        (y) =>
          y[this.filterTypes[0]] === type1 &&
          y[this.filterTypes[1]] === selectedOption
      ).length;
    } else if (type === this.filterTypes[2]) {
      const type2 = this.myForm.controls[this.filterTypes[1]].value;
      count = data.filter(
        (y) =>
          y[this.filterTypes[0]] === type1 &&
          y[this.filterTypes[1]] === type2 &&
          y[this.filterTypes[2]] === selectedOption
      ).length;
    }
    return count === 0;
  }

  setValidValues(): void {
    this.filterTypes.slice(1).forEach((type: string) => {
      const selectedOption = this[`${type}s`].find(
        (x: Option) => x.name === this.myForm.controls[type].value
      );
      const validSelection = this[`${type}s`].find(
        (x: Option) => x.disabled === false
      )?.name;
      if (selectedOption?.disabled || !selectedOption?.name) {
        this.myForm.controls[type].setValue(validSelection);
      }
    });
  }
}

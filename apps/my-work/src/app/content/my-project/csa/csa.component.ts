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

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.setData();
    this.setForm();
  }

  setData(): void {
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      filter((data) => data.length > 0),
      map((data) => {
        const transformed: CsaDatum[] = data.map((x) => {
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
        this.myForm.controls['delivSys'].setValue(this.delivSyss[0].name);
        this.myForm.controls['measureCode'].setValue(this.measureCodes[0].name);
        this.myForm.controls['stratVal'].setValue(this.stratVals[0].name);
        return data;
      })
    );
  }

  setOptions(data: CsaDatum[]): void {
    this.delivSyss = this.getOptions(data, 'delivSys');
    this.measureCodes = this.getOptions(data, 'measureCode');
    this.stratVals = this.getOptions(data, 'stratVal');
  }

  setForm(): void {
    this.myForm = new FormGroup({
      delivSys: new FormControl(),
      measureCode: new FormControl(),
      stratVal: new FormControl(),
    });

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
    return data.filter(
      (plan) =>
        plan.delivSys === filters.delivSys &&
        plan.measureCode === filters.measureCode &&
        plan.stratVal === filters.stratVal
    );
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
    const delivSys = this.myForm.controls['delivSys'].value;
    let count = Infinity;
    if (type === 'measureCode') {
      count = data.filter(
        (y) => y.delivSys === delivSys && y.measureCode === selectedOption
      ).length;
    } else if (type === 'stratVal') {
      const measureCode = this.myForm.controls['measureCode'].value;
      count = data.filter(
        (y) =>
          y.delivSys === delivSys &&
          y.measureCode === measureCode &&
          y.stratVal === selectedOption
      ).length;
    }
    return count === 0;
  }

  setValidValues(): void {
    const types = ['measureCode', 'stratVal'];
    types.forEach((type: string) => {
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

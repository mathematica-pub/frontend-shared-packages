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
import { combineLatest, filter, map, Observable, startWith } from 'rxjs';
import {
  CsaDatum,
  CsaDotPlotComponent,
} from './csa-dot-plot/csa-dot-plot.component';

interface SelectionForm {
  measureCode: AbstractControl<string>;
  delivSys: AbstractControl<string>;
  stratVal: AbstractControl<string>;
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
  filteredData$: Observable<CsaDatum[]>;
  filter$: Observable<FormGroup<SelectionForm>>;
  myForm: FormGroup;
  measureCodes: string[] = [];
  stratVals: string[] = [];
  delivSyss: string[] = [];

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
      map((data) => {
        this.measureCodes = [
          ...new Set(data.map((x) => x.measureCode).sort(ascending)),
        ];
        this.stratVals = [
          ...new Set(data.map((x) => x.stratVal).sort(ascending)),
        ];
        this.delivSyss = [
          ...new Set(data.map((x) => x.delivSys).sort(ascending)),
        ];

        this.myForm.controls['measureCode'].setValue(this.measureCodes[0]);
        this.myForm.controls['stratVal'].setValue(this.stratVals[0]);
        this.myForm.controls['delivSys'].setValue(this.delivSyss[0]);

        return data;
      })
    );
  }

  setForm(): void {
    this.myForm = new FormGroup({
      measureCode: new FormControl(),
      stratVal: new FormControl(),
      delivSys: new FormControl(),
    });

    this.filter$ = this.myForm.valueChanges.pipe(
      startWith(this.myForm.value),
      filter((form) => form !== undefined)
    );

    const dataAndFilter$: Observable<[CsaDatum[], FormGroup<SelectionForm>]> =
      combineLatest([this.data$, this.filter$.pipe(startWith(this.myForm))]);

    this.filteredData$ = dataAndFilter$.pipe(
      map(([data, filters]) => this.getFilteredData(data, filters))
    );
  }

  getFilteredData(data: CsaDatum[], filters: any): CsaDatum[] {
    return data.filter(
      (plan) =>
        plan.measureCode === filters.measureCode &&
        plan.stratVal === filters.stratVal &&
        plan.delivSys === filters.delivSys
    );
  }
}

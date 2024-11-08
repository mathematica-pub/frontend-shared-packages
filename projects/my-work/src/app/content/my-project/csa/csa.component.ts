/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { combineLatest, filter, map, Observable, startWith } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
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
})
export class CsaComponent implements OnInit {
  dataPath = 'content/data/Mock_Statistical_Results.csv';
  data$: Observable<CsaDatum[]>;
  filteredData$: Observable<CsaDatum[]>;
  filter$: Observable<FormGroup<SelectionForm>>;
  rollupData$: Observable<CsaDatum[]>;
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
                ? x.CSA_75 - x.CSA_25
                : null,
            planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
            csa_25: x.CSA_25 && !isNaN(x.CSA_25) ? +x.CSA_25 : null,
            csa_75: x.CSA_75 && !isNaN(x.CSA_75) ? +x.CSA_75 : null,
            plans: [],
          };
          return obj;
        });
        return transformed;
      })
    );

    this.data$ = data$.pipe(
      map((data) => {
        this.measureCodes = [...new Set(data.map((x) => x.measureCode))];
        this.stratVals = [...new Set(data.map((x) => x.stratVal))];
        this.delivSyss = [...new Set(data.map((x) => x.delivSys))];
        return data;
      })
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

  setForm(): void {
    this.myForm = new FormGroup({
      measureCode: new FormControl('AOGX'),
      stratVal: new FormControl('Child'),
      delivSys: new FormControl('PZIL'),
    });

    this.filter$ = this.myForm.valueChanges.pipe(
      startWith(this.myForm.value),
      filter((form) => form !== undefined)
    );

    const dataAndFilter$: Observable<[CsaDatum[], FormGroup<SelectionForm>]> =
      combineLatest([this.data$, this.filter$.pipe(startWith(this.myForm))]);

    this.filteredData$ = dataAndFilter$.pipe(
      map(([data, filters]) => {
        return this.getFilteredData(data, filters);
      })
    );
  }
}

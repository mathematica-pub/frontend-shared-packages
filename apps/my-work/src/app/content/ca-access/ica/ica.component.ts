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
import { ascending, extent } from 'd3';
import { combineLatest, debounceTime, filter, map, Observable } from 'rxjs';
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

interface Option {
  name: string;
  disabled: boolean;
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
        const transformed: IcaDatum[] = data.map((x: any) => {
          const filteredPlans = data.filter(
            (plan: any) =>
              plan.County === x.County &&
              plan.DelivSys === x.DelivSys &&
              plan.Measure_Code === x.Measure_Code &&
              plan.StratVal === x.StratVal
          );
          const extents = extent(filteredPlans.map((plan: any) => plan.Value));
          const obj: IcaDatum = {
            series: 'percentile',
            size: x.County_Size,
            county: x.County,
            measureCode: x.Measure_Code,
            stratVal: x.StratVal,
            delivSys: x.DelivSys,
            units: x.Units,
            value: +extents[1] - +extents[0],
            planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
            directionality: x.Directionality,
            plans: [],
          };
          return obj;
        });
        return transformed;
      })
    );

    this.data$ = data$.pipe(
      map((data: IcaDatum[]) => {
        this.setOptions(data);
        this.filterTypes.forEach((type: string) => {
          this.myForm.controls[type].setValue(this[`${type}s`][0].name);
        });
        return data;
      })
    );
  }

  setOptions(data: IcaDatum[]): void {
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

  getFilteredData(data: IcaDatum[], filters: any): IcaDatum[] {
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

  getOptions(data: IcaDatum[], type: string): Option[] {
    const options = [...new Set(data.map((x) => x[type]).sort(ascending))].map(
      (x: string) => ({
        name: x,
        disabled: this.getDisabled(data, type, x),
      })
    );
    return options;
  }

  getDisabled(data: IcaDatum[], type: string, selectedOption: string): boolean {
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

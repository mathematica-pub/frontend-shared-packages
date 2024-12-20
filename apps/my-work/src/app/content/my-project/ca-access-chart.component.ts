import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { CaAccessDotPlotComponent } from './ca-access-dot-plot.component';
import { CaDatum } from './ca-access-stacked-bars.component';

interface SelectionForm {
  measureCode: AbstractControl<string>;
  delivSys: AbstractControl<string>;
}

interface Option {
  name: string;
  disabled: boolean;
}

@Component({
  selector: 'app-ca-access-chart',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    CaAccessDotPlotComponent,
    ReactiveFormsModule,
  ],
  templateUrl: 'ca-access-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaAccessChartComponent implements OnInit {
  dataPath: string;
  data$: Observable<CaDatum[]>;
  filter$: Observable<FormGroup<SelectionForm>>;
  filteredData$: Observable<CaDatum[]>;
  myForm: FormGroup;
  filters: Record<string, Option[]> = {};
  filterTypes: string[];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.setData();
    this.setForm();
  }

  setData(): void {
    const data$ = this.dataService.getDataFile(this.dataPath).pipe(
      filter((data) => data.length > 0),
      map((data) => {
        return this.getTransformedData(data);
      })
    );

    this.data$ = data$.pipe(
      map((data: CaDatum[]) => {
        this.setOptions(data);
        this.filterTypes.forEach((type: string) => {
          this.myForm.controls[type].setValue(this.filters[`${type}s`][0].name);
        });
        return data;
      })
    );
  }

  getTransformedData(data: CaDatum[]): CaDatum[] {
    console.log('override getTransformedData');
    return data;
  }

  setOptions(data: CaDatum[]): void {
    this.filterTypes.forEach((type: string) => {
      this.filters[`${type}s`] = this.getOptions(data, type);
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

  getFilteredData(
    data: CaDatum[],
    filters: FormGroup<SelectionForm>
  ): CaDatum[] {
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

  getOptions(data: CaDatum[], type: string): Option[] {
    const options = [...new Set(data.map((x) => x[type]).sort(ascending))].map(
      (x: string) => ({
        name: x,
        disabled: this.getDisabled(data, type, x),
      })
    );
    return options;
  }

  getDisabled(data: CaDatum[], type: string, selectedOption: string): boolean {
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
      const selectedOption = this.filters[`${type}s`].find(
        (x: Option) => x.name === this.myForm.controls[type].value
      );
      const validSelection = this.filters[`${type}s`].find(
        (x: Option) => x.disabled === false
      )?.name;
      if (selectedOption?.disabled || !selectedOption?.name) {
        this.myForm.controls[type].setValue(validSelection);
      }
    });
  }
}

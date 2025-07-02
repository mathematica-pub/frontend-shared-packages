/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ascending } from 'd3';
import { combineLatest, debounceTime, filter, map, Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';

export interface SelectionForm {
  measureCode: AbstractControl<string>;
  delivSys: AbstractControl<string>;
  stratVal?: AbstractControl<string>;
}

interface Option {
  name: string;
  disabled: boolean;
}

@Injectable()
export class CaChartService {
  data$: Observable<any[]>;
  filter$: Observable<FormGroup<SelectionForm>>;
  filteredData$: Observable<any[]>;
  myForm: FormGroup;
  filters: Record<string, Option[]> = {};
  filterTypes: string[];

  constructor(private dataService: DataService) {}

  init(
    filters: Record<string, Option[]>,
    filterTypes: string[],
    dataPath: string,
    getTransformedData: (data: any[]) => any[]
  ): void {
    this.setData(dataPath, getTransformedData);
    this.filters = filters;
    this.filterTypes = filterTypes;
    this.setForm();
  }

  setData(dataPath: string, getTransformedData: (data: any[]) => any[]): void {
    const data$ = this.dataService.getDataFile(dataPath).pipe(
      filter((data) => data.length > 0),
      map((data) => {
        return getTransformedData(data);
      })
    );

    this.setDataObservable(data$);
  }

  setDataObservable(data$: Observable<any>): void {
    this.data$ = data$.pipe(
      map((data: any[]) => {
        this.setOptions(data);
        this.filterTypes.forEach((type: string) => {
          this.myForm.controls[type].setValue(this.filters[`${type}s`][0].name);
        });
        return data;
      })
    );
  }

  setOptions(data: any[]): void {
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

  getFilteredData(data: any[], filters: FormGroup<SelectionForm>): any[] {
    this.setOptions(data);
    this.setValidValues();
    let filteredData = data;
    this.filterTypes.forEach((type: string) => {
      filteredData = filteredData.filter((d) => d[type] === filters[type]);
    });
    return filteredData;
  }

  getOptions(data: any[], type: string): Option[] {
    const options = [...new Set(data.map((x) => x[type]).sort(ascending))].map(
      (x: string) => ({
        name: x,
        disabled: this.getDisabled(data, type, x),
      })
    );
    return options;
  }

  getDisabled(data: any[], type: string, selectedOption: string): boolean {
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

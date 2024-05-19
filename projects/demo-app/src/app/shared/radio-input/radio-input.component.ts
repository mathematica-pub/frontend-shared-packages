/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, map, merge, of } from 'rxjs';

let nextUniqueId = 0;

@Component({
  standalone: true,
  selector: 'app-radio-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class RadioInputComponent implements OnInit {
  _uniqueId = ++nextUniqueId;
  @Input() formControlName: string;
  @Input() value: string | number;
  @Input() styleAsRadio = false;
  @Input() disabled = false;
  @Input() disabledMessage?: string;
  @Input() id?: string;
  uniqueId: string;
  selected$: Observable<boolean>;

  constructor(@Self() @Optional() public ngControl: NgControl) {
    this.ngControl.valueAccessor = {
      writeValue(): void {},
      registerOnChange(): void {},
      registerOnTouched(): void {},
    };
  }

  ngOnInit(): void {
    this.setUniqueId();
    this.setSelected();
  }

  setSelected(): void {
    this.selected$ = merge(
      of(this.ngControl.control.value),
      this.ngControl.control.valueChanges
    ).pipe(map((value) => value === this.value));
  }

  setUniqueId(): void {
    this.uniqueId = this.id || `covid-cohort-radio-input-${this._uniqueId}`;
  }
}

import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SelectionOption } from './radio-input.model';

let nextUniqueId = 0;

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class RadioInputComponent implements OnInit, OnDestroy {
  _uniqueId = ++nextUniqueId;
  @Input() formControlName: string;
  @Input() option: SelectionOption;
  @Input() id?: string;
  @Input() isStyledRadio?: boolean = false;
  uniqueId: string;
  label: string;
  value: string | number;
  selected: boolean;
  unsubscribe: Subject<void> = new Subject();
  disabledMessage: string = 'disabled';

  constructor(@Self() @Optional() public ngControl: NgControl) {
    this.ngControl.valueAccessor = {
      writeValue(): void {},
      registerOnChange(): void {},
      registerOnTouched(): void {},
    };
  }

  ngOnInit(): void {
    this.setUniqueId();
    this.parseOption();
    this.setSelected();
    this.setFormListener();
  }

  setFormListener(): void {
    this.ngControl.control.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.setSelected();
      });
  }

  setUniqueId(): void {
    this.uniqueId = this.id || `nc-dash-radio-input-${this._uniqueId}`;
  }

  parseOption(): void {
    this.label = this.option.label;
    this.value = this.option.value ?? this.option.label;
  }

  setSelected(): void {
    this.selected = this.ngControl.control.value === this.value;
  }

  getIconName(): string {
    return this.isStyledRadio && this.selected
      ? 'radio-selected'
      : 'radio-unselected';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

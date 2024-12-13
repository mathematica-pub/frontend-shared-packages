import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { OptionAction } from '../combobox.service';
import { EditableTextboxComponent } from '../editable-textbox/editable-textbox.component';

@Component({
  selector: 'hsi-ui-ng-form-editable-textbox',
  templateUrl: './ng-form-editable-textbox.component.html',
  styleUrls: ['./ng-form-editable-textbox.component.scss'],
})
export class NgFormEditableTextboxComponent
  extends EditableTextboxComponent
  implements OnInit
{
  override displaySelected = false;
  @ViewChild('box') boxElRef: ElementRef<HTMLInputElement>;
  @Input({ required: true }) formControl: FormControl<string>;
  override textboxValue: never;

  override ngOnInit(): void {
    super.ngOnInit();
    this.setTextboxValueChangeHandling();
  }

  override setInputValue(value: string): void {
    this.formControl.setValue(value);
    if (value === '') {
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    }
  }

  override onInputChange(): void {
    return;
  }

  setTextboxValueChangeHandling(): void {
    this.formControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (this.autoSelect) {
          if (value === '') {
            this.setAutoSelectWhenInputIsEmpty();
          } else {
            this.service.shouldAutoSelectOnListboxClose = this.autoSelect;
          }
        }
      });
  }
}

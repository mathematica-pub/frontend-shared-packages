import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs';
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
  @Input({ required: true }) inputControl: FormControl<string>;
  override textboxValue: never;

  override ngOnInit(): void {
    super.ngOnInit();
    this.setEmptyTextboxHandling();
  }

  override setInputValue(value: string): void {
    this.inputControl.setValue(value);
    if (value === '') {
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    }
  }

  override onInputChange(): void {
    return;
  }

  setEmptyTextboxHandling(): void {
    this.inputControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => value === '')
      )
      .subscribe(() => {
        const optionAction =
          this.autoSelectTrigger === 'any'
            ? OptionAction.zeroActiveIndex
            : OptionAction.nullActiveIndex;
        this.service.emitOptionAction(optionAction);
      });
  }
}

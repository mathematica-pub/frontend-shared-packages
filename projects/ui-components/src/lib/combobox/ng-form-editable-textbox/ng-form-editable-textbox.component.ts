import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionAction } from '../combobox.service';
import { EditableTextboxComponent } from '../editable-textbox/editable-textbox.component';

@Component({
  standalone: true,
  selector: 'hsi-ui-ng-form-editable-textbox',
  templateUrl: './ng-form-editable-textbox.component.html',
  styleUrls: ['./ng-form-editable-textbox.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class NgFormEditableTextboxComponent
  extends EditableTextboxComponent
  implements OnInit
{
  override displaySelected = false;
  @ViewChild('box') boxElRef: ElementRef<HTMLInputElement>;
  @Input({ required: true }) inputControl: FormControl<string>;
  override inputValue: never;

  override setInputValue(value: string): void {
    this.inputControl.setValue(value);
    if (value === '') {
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    }
  }

  override onInputChange(): void {
    return;
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { OptionAction } from '../combobox.service';
import { EditableTextboxComponent } from '../editable-textbox/editable-textbox.component';

/**
 * Editable textbox with Angular Reactive Forms integration.
 * Takes a FormControl as an input and binds to it directly.
 *
 * @example
 * <hsi-ui-form-editable-textbox
 *   [control]="myControl"
 *   [autoSelect]="true"
 *   placeholder="Search...">
 * </hsi-ui-form-editable-textbox>
 */
@Component({
  selector: 'hsi-ui-form-editable-textbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-editable-textbox.component.html',
  styleUrls: ['../editable-textbox/editable-textbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'hsi-ui-editable-textbox',
  },
})
export class FormEditableTextboxComponent
  extends EditableTextboxComponent
  implements OnInit
{
  @ViewChild('box') override inputElRef: ElementRef<HTMLInputElement>;
  @Input({ required: true }) control: FormControl<string>;

  override displaySelected = false;

  override ngOnInit(): void {
    super.ngOnInit();
    this.setupControlListener();
  }

  override onSelectionChange(selectedOptions: any[]): void {
    // When displaySelected is false (default for forms), clear the textbox
    if (!this.displaySelected) {
      this.control.setValue('');
      return;
    }
    // Otherwise use the default behavior (set to selected label)
    if (this.service.isMultiSelect) {
      this.control.setValue('');
    } else {
      const label = selectedOptions.length
        ? selectedOptions[0].label?.nativeElement.innerText.trim()
        : '';
      this.control.setValue(label);
    }
  }

  override setAndEmitValue(value: string): void {
    this.control.setValue(value);
  }

  override emitValue(value: string): void {
    this.control.setValue(value);
  }

  override setValue(value: string): void {
    // For form components, we set through the control, not the internal value BehaviorSubject
    this.control.setValue(value, { emitEvent: false });
  }

  override handleBlur(event: FocusEvent): void {
    super.handleBlur(event);
    this.control.markAsTouched();
  }

  private setupControlListener(): void {
    this.control.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => value === '')
      )
      .subscribe(() => {
        const optionAction =
          this.autoSelect && this.autoSelectTrigger === 'any'
            ? OptionAction.zeroActiveIndex
            : OptionAction.nullActiveIndex;
        this.service.emitOptionAction(optionAction);
      });
  }
}

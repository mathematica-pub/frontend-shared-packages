import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ActiveIndexService } from '../listbox/active-index.service';
import { ListboxFilteringService } from '../listbox/listbox-filtering.service';
import { ListboxScrollService } from '../listbox/listbox-scroll.service';
import { ListboxComponent } from '../listbox/listbox.component';

/**
 * Multi-select listbox with boolean array form integration.
 * This is a compatibility adapter for apps that use FormArray<FormControl<boolean>>
 * where each boolean represents whether the option at that index is selected.
 *
 * Takes a FormArray as an input and binds to it directly.
 * Each element in the array corresponds to whether the option at that index is selected.
 *
 * @example
 * // In component: myControl = new FormArray([new FormControl(false), new FormControl(true)])
 * <hsi-ui-form-listbox-multi-boolean [control]="myControl">
 *   <hsi-ui-listbox-option [value]="1">Option 1</hsi-ui-listbox-option>
 *   <hsi-ui-listbox-option [value]="2">Option 2</hsi-ui-listbox-option>
 * </hsi-ui-form-listbox-multi-boolean>
 */
@Component({
  selector: 'hsi-ui-form-listbox-multi-boolean',
  standalone: true,
  imports: [CommonModule],
  providers: [
    ListboxFilteringService,
    ListboxScrollService,
    ActiveIndexService,
  ],
  templateUrl: '../listbox/listbox.component.html',
  styleUrls: ['../listbox/listbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'hsi-ui-listbox-component',
  },
})
export class FormListboxMultiBooleanComponent
  extends ListboxComponent
  implements OnInit
{
  @Input({ required: true }) control: FormArray<FormControl<boolean>>;

  override isMultiSelect = true;
  private isWritingValue = false;

  constructor() {
    super();
    this.service.isMultiSelect = true;
  }

  ngOnInit(): void {
    this.setupControlListener();
  }

  override emitValue(): void {
    if (this.isWritingValue) {
      return;
    }

    const booleanArray = this.getBooleanSelectedArray();

    // Update the FormArray to match the boolean array
    for (let i = 0; i < booleanArray.length; i++) {
      if (this.control.at(i)) {
        this.control.at(i).setValue(booleanArray[i], { emitEvent: false });
      }
    }

    // Trigger a single valueChanges event for the entire array
    this.control.updateValueAndValidity();
    this.control.markAsTouched();
  }

  private setupControlListener(): void {
    this.control.valueChanges.subscribe((value) => {
      this.writeValue(value);
    });

    // Set initial value
    const initialValue = this.control.value;
    if (initialValue && initialValue.length > 0) {
      setTimeout(() => this.writeValue(initialValue), 0);
    }
  }

  private writeValue(value: boolean[] | null): void {
    const booleanArray = Array.isArray(value) ? value : [];

    if (!this.service.allOptions || this.service.allOptions.length === 0) {
      // Options not ready yet, wait for ngAfterContentInit
      setTimeout(() => this.writeValue(value), 0);
      return;
    }

    this.isWritingValue = true;
    try {
      const options = this.service.allOptions;

      options.forEach((option, index) => {
        const shouldSelect = booleanArray[index] === true;

        if (shouldSelect && !option.isSelected()) {
          option.select();
        } else if (!shouldSelect && option.isSelected()) {
          option.deselect();
        }
      });

      this.updateSelectedOptionsToEmit(options);
    } finally {
      this.isWritingValue = false;
    }
  }

  private getBooleanSelectedArray(): boolean[] {
    const options = this.service.allOptions || [];
    const output: boolean[] = [];

    for (const option of options) {
      output.push(option.isSelected());
    }

    return output;
  }
}

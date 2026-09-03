import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActiveIndexService } from '../listbox/active-index.service';
import { ListboxFilteringService } from '../listbox/listbox-filtering.service';
import { ListboxScrollService } from '../listbox/listbox-scroll.service';
import { ListboxComponent } from '../listbox/listbox.component';

/**
 * Multi-select listbox with Angular Reactive Forms integration.
 * Takes a FormControl as an input and binds to it directly.
 * Emits an array of selected values.
 *
 * @example
 * <hsi-ui-form-listbox-multi [control]="myControl" [compareWith]="compareFn">
 *   <hsi-ui-listbox-option [value]="1">Option 1</hsi-ui-listbox-option>
 *   <hsi-ui-listbox-option [value]="2">Option 2</hsi-ui-listbox-option>
 *   <hsi-ui-listbox-option [value]="3">Option 3</hsi-ui-listbox-option>
 * </hsi-ui-form-listbox-multi>
 */
@Component({
  selector: 'hsi-ui-form-listbox-multi',
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
export class FormListboxMultiComponent
  extends ListboxComponent
  implements OnInit
{
  @Input({ required: true }) control: FormControl<unknown[]>;

  /**
   * Custom comparison function to determine option equality.
   * Defaults to Object.is for reference/primitive equality.
   * Useful for comparing objects by ID or other properties.
   */
  @Input() compareWith: (a: unknown, b: unknown) => boolean = Object.is;

  override isMultiSelect = true;
  private isWritingValue = false;

  constructor() {
    super();
    this.service.isMultiSelect = true;
  }

  ngOnInit(): void {
    this.setupControlListener();
  }

  override emitValue(selections: unknown[]): void {
    if (this.isWritingValue) {
      return;
    }

    const values = Array.isArray(selections) ? selections : [];
    this.control.setValue(values);
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

  private writeValue(value: unknown[] | null): void {
    const values = Array.isArray(value) ? value : [];

    if (!this.service.allOptions || this.service.allOptions.length === 0) {
      // Options not ready yet, wait for ngAfterContentInit
      setTimeout(() => this.writeValue(value), 0);
      return;
    }

    this.isWritingValue = true;
    try {
      const options = this.service.allOptions;

      for (const option of options) {
        const optionValue = option.valueToEmit;
        const shouldSelect = values.some((val) =>
          this.compareWith(optionValue, val)
        );

        if (shouldSelect && !option.isSelected()) {
          option.select();
        } else if (!shouldSelect && option.isSelected()) {
          option.deselect();
        }
      }

      this.updateSelectedOptionsToEmit(options);
    } finally {
      this.isWritingValue = false;
    }
  }
}

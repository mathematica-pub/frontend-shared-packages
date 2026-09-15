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
 * Single-select listbox with Angular Reactive Forms integration.
 * Takes a FormControl as an input and binds to it directly.
 *
 * @example
 * <hsi-ui-form-listbox-single [control]="myControl" [compareWith]="compareFn">
 *   <hsi-ui-listbox-option [value]="1">Option 1</hsi-ui-listbox-option>
 *   <hsi-ui-listbox-option [value]="2">Option 2</hsi-ui-listbox-option>
 * </hsi-ui-form-listbox-single>
 */
@Component({
  selector: 'hsi-ui-form-listbox-single',
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
export class FormListboxSingleComponent
  extends ListboxComponent
  implements OnInit
{
  @Input({ required: true }) control: FormControl<unknown>;

  /**
   * Custom comparison function to determine option equality.
   * Defaults to Object.is for reference/primitive equality.
   * Useful for comparing objects by ID or other properties.
   */
  @Input() compareWith: (a: unknown, b: unknown) => boolean = Object.is;

  override isMultiSelect = false;
  private isWritingValue = false;

  constructor() {
    super();
    this.service.isMultiSelect = false;
  }

  ngOnInit(): void {
    this.setupControlListener();
  }

  override emitValue(selections: unknown[]): void {
    if (this.isWritingValue) {
      return;
    }

    const value = selections.length > 0 ? selections[0] : null;
    this.control.setValue(value);
    this.control.markAsTouched();
  }

  private setupControlListener(): void {
    this.control.valueChanges.subscribe((value) => {
      this.writeValue(value);
    });

    // Set initial value
    if (this.control.value !== null && this.control.value !== undefined) {
      setTimeout(() => this.writeValue(this.control.value), 0);
    }
  }

  private writeValue(value: unknown): void {
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
        const shouldSelect =
          value !== null && this.compareWith(optionValue, value);

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

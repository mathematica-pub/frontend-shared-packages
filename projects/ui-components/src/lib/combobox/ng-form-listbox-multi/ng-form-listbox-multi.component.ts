import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ListboxComponent } from '../listbox/listbox.component';

@Component({
  standalone: true,
  selector: 'hsi-ui-ng-form-listbox-multi',
  templateUrl: '../listbox/listbox.component.html',
  providers: [ListboxFilteringService, ListboxScrollService],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
  imports: [CommonModule],
})
export class NgFormListboxMultiComponent<T>
  extends ListboxComponent<T>
  implements OnInit
{
  @Input() control: FormArray<FormControl<boolean>>;
  override isMultiSelect = true;

  override emitValue(): void {
    this.control.setValue(this.getBooleanSelectedArray());
  }

  getBooleanSelectedArray(): boolean[] {
    const array = [];
    for (const option of this.allOptionsArray) {
      array.push(this.selectedOptions.value.includes(option));
    }
    return array;
  }
}

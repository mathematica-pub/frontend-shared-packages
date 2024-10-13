import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ListboxComponent } from '../listbox/listbox.component';

@Component({
  selector: 'hsi-ui-ng-form-listbox-multi',
  templateUrl: '../listbox/listbox.component.html',
  providers: [ListboxFilteringService, ListboxScrollService],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
})
export class NgFormListboxMultiComponent<T>
  extends ListboxComponent<T>
  implements OnInit
{
  @Input() control: FormControl<T[]>;
  override isMultiSelect = true;

  override emitValue(): void {
    this.control.setValue(this.selectedOptions.value.map((x) => x.value));
  }
}

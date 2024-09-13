import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import {
  ListboxComponent,
  SingleSelectListboxValue,
} from '../listbox/listbox.component';

@Component({
  selector: 'hsi-ui-ng-form-listbox-single',
  templateUrl: '../listbox/listbox.component.html',
  providers: [ListboxFilteringService, ListboxScrollService],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
})
export class NgFormListboxSingleComponent<T> extends ListboxComponent<T> {
  @Input() control: FormControl<SingleSelectListboxValue<T>>;
  override isMultiSelect = false;
  override valueChanges: never;

  override emitValue(selected: SingleSelectListboxValue<T>): void {
    this.control.setValue(selected as SingleSelectListboxValue<T>);
  }
}

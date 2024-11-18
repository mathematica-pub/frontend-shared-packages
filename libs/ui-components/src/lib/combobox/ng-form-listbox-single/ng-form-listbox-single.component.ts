import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ListboxComponent } from '../listbox/listbox.component';

@Component({
  selector: 'hsi-ui-ng-form-listbox-single',
  templateUrl: '../listbox/listbox.component.html',
  providers: [ListboxFilteringService, ListboxScrollService],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
})
export class NgFormListboxSingleComponent extends ListboxComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() control: FormControl<any>;
  override isMultiSelect = false;
  override valueChanges: never;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override emitValue(selected: any[]): void {
    this.control.setValue(selected[0]);
  }
}

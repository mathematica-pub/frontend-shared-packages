import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { Observable, map, merge, startWith } from 'rxjs';
import { ComboboxService } from '../combobox.service';
import { ListboxLabelComponent } from '../listbox-label/listbox-label.component';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';

@Component({
  selector: 'hsi-ui-listbox-group',
  template: `<ng-content></ng-content>`,
})
export class ListboxGroupComponent<T> implements AfterContentInit {
  @ContentChild(ListboxLabelComponent)
  label: ListboxLabelComponent;
  @ContentChildren(ListboxOptionComponent) options: QueryList<
    ListboxOptionComponent<T>
  >;
  options$: Observable<ListboxOptionComponent<T>[]>;

  constructor(public service: ComboboxService) {}

  ngAfterContentInit(): void {
    this.options$ = merge(
      this.options.changes,
      this.service.optionChanges$
    ).pipe(
      startWith(''),
      map(() => this.options.toArray())
    );
  }
}

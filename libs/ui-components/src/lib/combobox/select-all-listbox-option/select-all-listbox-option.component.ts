import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  forwardRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, map, merge, mergeAll, switchMap } from 'rxjs';
import { ComboboxService } from '../combobox.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { ListboxComponent } from '../listbox/listbox.component';

@Component({
  selector: 'hsi-ui-select-all-listbox-option',
  templateUrl: '../listbox-option/listbox-option.component.html',
  styleUrls: ['../listbox-option/listbox-option.component.scss'],
  providers: [
    {
      provide: ListboxOptionComponent,
      useExisting: forwardRef(() => SelectAllListboxOptionComponent),
    },
  ],
})
export class SelectAllListboxOptionComponent
  extends ListboxOptionComponent
  implements OnChanges, AfterViewInit
{
  @Input() override boxDisplayLabel = 'Select all';
  currentControlledOptions: ListboxOptionComponent[] = [];

  constructor(
    service: ComboboxService,
    private listboxComponent: ListboxComponent,
    private destroyRef: DestroyRef
  ) {
    super(service);
  }

  ngAfterViewInit(): void {
    this.listenForOptionSelections();
    this.updateSelectAllSelected();
  }

  protected override updateSelected(selected: boolean): void {
    this._selected.next(selected);
  }

  // automatically updates "selected" based on controlled options
  listenForOptionSelections(): void {
    const optionSelectionChanges$ = this.listboxComponent.allOptions$.pipe(
      map((options) => options.filter((o) => o !== this)),
      switchMap((options) => merge(options.map((o) => o.selected$))),
      mergeAll()
    );

    optionSelectionChanges$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(0))
      .subscribe(() => {
        this.updateSelectAllSelected();
      });
  }

  updateSelectAllSelected(): void {
    const controlledOptions = this.getControlledOptions();
    const allControlledOptionsSelected = controlledOptions.every((option) =>
      option.isSelected()
    );
    this.updateSelected(allControlledOptionsSelected);
  }

  getControlledOptions(): ListboxOptionComponent[] {
    // Currently if there are groups, select all can only work for its own group
    if (this.listboxComponent.groups.toArray().length > 0) {
      const groupId = this.listboxComponent.getGroupIndexFromOptionIndex(
        this.id
      );
      if (groupId > -1) {
        return this.listboxComponent.groups
          .toArray()
          [groupId].options.toArray();
      } else {
        return [];
      }
    } else {
      return this.listboxComponent.options
        .toArray()
        .filter((option) => option.boxDisplayLabel !== this.boxDisplayLabel);
    }
  }

  override toggleSelected(): void {
    this.updateSelected(!this._selected.value);
    const controlledOptions = this.getControlledOptions();
    if (this._selected.value) {
      controlledOptions.forEach((option) => option.select());
    } else {
      controlledOptions.forEach((option) => option.deselect());
    }
  }
}

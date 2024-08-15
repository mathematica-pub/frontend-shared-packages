import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  forwardRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { ComboboxService } from '../combobox.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { ListboxComponent } from '../listbox/listbox.component';

@Component({
  standalone: true,
  selector: 'hsi-ui-select-all-listbox-option',
  templateUrl: '../listbox-option/listbox-option.component.html',
  styleUrls: ['../listbox-option/listbox-option.component.scss'],
  providers: [
    {
      provide: ListboxOptionComponent,
      useExisting: forwardRef(() => SelectAllListboxOptionComponent),
    },
  ],
  imports: [CommonModule],
})
export class SelectAllListboxOptionComponent<T>
  extends ListboxOptionComponent<T>
  implements OnChanges, AfterViewInit
{
  @Input() override boxDisplayLabel = 'Select all';

  constructor(
    service: ComboboxService,
    private listboxComponent: ListboxComponent<T>
  ) {
    super(service);
  }

  ngAfterViewInit(): void {
    this.listenForOptionSelections();
    this.updateSelectAllSelected();
  }

  getControlledOptions(): ListboxOptionComponent<T>[] {
    if (this.listboxComponent.groups.toArray().length > 0) {
      return this.getControlledOptionsForGroup();
    } else {
      return this.listboxComponent.options
        .toArray()
        .filter(
          (option) =>
            option.boxDisplayLabel !== this.boxDisplayLabel &&
            !option.isDisabled()
        );
    }
  }

  getControlledOptionsForGroup(): ListboxOptionComponent<T>[] {
    // If there are groups, select all only works for its own group
    const groupId = this.listboxComponent.getGroupIndexFromOptionIndex(this.id);
    if (groupId > -1) {
      return this.listboxComponent.groups
        .toArray()
        [groupId].options.toArray()
        .filter((option) => !option.isDisabled());
    } else {
      return [];
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

  // automatically updates "selected" based on controlled options
  listenForOptionSelections(): void {
    merge(
      this.listboxComponent.selectedOptions$,
      this.listboxComponent.groups$,
      this.listboxComponent.options$
    )
      .pipe(takeUntilDestroyed())
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
}

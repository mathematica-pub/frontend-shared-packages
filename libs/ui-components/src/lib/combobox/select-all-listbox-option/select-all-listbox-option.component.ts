import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  forwardRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
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

  getControlledOptions(): ListboxOptionComponent[] {
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

  getControlledOptionsForGroup(): ListboxOptionComponent[] {
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
    combineLatest([
      this.listboxComponent.selectedOptions$,
      this.listboxComponent.groups$,
      this.listboxComponent.options$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateSelectAllSelected();
      });
  }

  updateSelectAllSelected(): void {
    const controlledOptions = this.getControlledOptions();
    const controlledOptionsValues = controlledOptions
      .map((x) => x.value)
      .sort();
    const currentControlledOptionsValues = this.currentControlledOptions
      .map((x) => x.value)
      .sort();
    if (
      this._selected.value === true &&
      (controlledOptionsValues.length !==
        currentControlledOptionsValues.length ||
        controlledOptionsValues.some(
          (x, i) => x !== currentControlledOptionsValues[i]
        ))
    ) {
      controlledOptions.forEach((option) => option.select());
      this.listboxComponent.emitValue(controlledOptions.map((x) => x.value));
    } else {
      const allControlledOptionsSelected = controlledOptions.every((option) =>
        option.isSelected()
      );
      this.updateSelected(allControlledOptionsSelected);
    }
    this.currentControlledOptions = controlledOptions;
  }
}

import {
  AfterViewInit,
  Component,
  DestroyRef,
  forwardRef,
  Input,
  OnChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  map,
  merge,
  mergeAll,
  Observable,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ComboboxService } from '../combobox.service';
import { ListboxGroupComponent } from '../listbox-group/listbox-group.component';
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
  standalone: false,
})
export class SelectAllListboxOptionComponent
  extends ListboxOptionComponent
  implements OnChanges, AfterViewInit
{
  @Input() override boxDisplayLabel = 'Select all';
  controlledOptions$: Observable<ListboxOptionComponent[]>;
  controlledOptions: ListboxOptionComponent[];

  constructor(
    service: ComboboxService,
    private listboxComponent: ListboxComponent,
    private destroyRef: DestroyRef
  ) {
    super(service);
  }

  // select all will not respond to changes in selected or disabled properties
  // users should not attempt to change these properties
  // TODO: better architecture for this
  override ngOnChanges(): void {
    return;
  }

  ngAfterViewInit(): void {
    this.setControlledOptions();
    this.listenForOptionSelections();
  }

  protected override updateSelected(selected: boolean): void {
    this._selected.next(selected);
  }

  setControlledOptions(): void {
    this.controlledOptions$ = this.service.groups$.pipe(
      map((groups) => this.getControlledOptionsFromGroups(groups))
    );

    this.controlledOptions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((controlledOptions) => {
        this.controlledOptions = controlledOptions;
      });
  }

  getControlledOptionsFromGroups(
    groups: ListboxGroupComponent[]
  ): ListboxOptionComponent[] {
    let controlledOptions: ListboxOptionComponent[] = [];
    if (groups.length > 0) {
      const groupId = groups.findIndex((group) => {
        return group.options.some((option) => option.id === this.id);
      });
      if (groupId > -1) {
        controlledOptions = groups[groupId].options.filter((o) => o !== this);
      }
    } else {
      controlledOptions = this.listboxComponent.options.filter(
        (option) => option !== this
      );
    }
    return controlledOptions;
  }

  listenForOptionSelections(): void {
    const optionSelectionChanges$ = this.controlledOptions$.pipe(
      switchMap((options) => merge(options.map((o) => o.selected$))),
      mergeAll()
    );

    optionSelectionChanges$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(0),
        withLatestFrom(this.controlledOptions$)
      )
      .subscribe(([, controlledOptions]) => {
        this.updateSelectAllSelected(controlledOptions);
      });
  }

  updateSelectAllSelected(controlledOptions: ListboxOptionComponent[]): void {
    const allControlledOptionsSelected = controlledOptions.every((option) =>
      option.isSelected()
    );
    this.updateSelected(allControlledOptionsSelected);
  }

  override toggleSelected(): void {
    this.updateSelected(!this._selected.value);
    if (this._selected.value) {
      this.controlledOptions.forEach((option) => option.select());
    } else {
      this.controlledOptions.forEach((option) => option.deselect());
    }
  }
}

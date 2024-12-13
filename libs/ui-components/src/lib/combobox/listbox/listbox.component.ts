import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  filter,
  map,
  merge,
  mergeAll,
  Observable,
  pairwise,
  shareReplay,
  skip,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import {
  ComboboxService,
  OptionAction,
  VisualFocus,
} from '../combobox.service';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxGroupComponent } from '../listbox-group/listbox-group.component';
import { ListboxLabelComponent } from '../listbox-label/listbox-label.component';
import {
  ListboxOptionComponent,
  ListboxOptionPropertyChange,
} from '../listbox-option/listbox-option.component';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { SelectAllListboxOptionComponent } from '../select-all-listbox-option/select-all-listbox-option.component';
import { ActiveIndexService } from './active-index.service';

export type CountSelectedLabel = {
  singular: string;
  plural: string;
};

@Component({
  selector: 'hsi-ui-listbox',
  templateUrl: './listbox.component.html',
  providers: [
    ListboxFilteringService,
    ListboxScrollService,
    ActiveIndexService,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
})
export class ListboxComponent
  implements OnInit, AfterContentInit, AfterViewInit
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() formControl: FormControl<any | any[]>;
  @Input() findsOptionOnTyping = true;
  @Input() isMultiSelect = false;
  @Input() maxHeight = 300;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() valueChanges = new EventEmitter<any | any[]>();
  @ViewChild('scrollContent') scrollContentRef: ElementRef<HTMLDivElement>;
  @ContentChild(ListboxLabelComponent, { descendants: false })
  label: ListboxLabelComponent;
  @ContentChildren(ListboxOptionComponent, { descendants: false })
  options: QueryList<ListboxOptionComponent>;
  @ContentChildren(ListboxGroupComponent)
  groups: QueryList<ListboxGroupComponent>;
  allOptions$: Observable<ListboxOptionComponent[]>;
  groups$: Observable<ListboxGroupComponent[]>;
  optionPropertyChanges$: Observable<ListboxOptionPropertyChange>;
  selectedOptionsToEmit: BehaviorSubject<ListboxOptionComponent[]> =
    new BehaviorSubject([]);
  selectedOptionsToEmit$ = this.selectedOptionsToEmit.asObservable();

  constructor(
    public service: ComboboxService,
    public activeIndex: ActiveIndexService,
    protected filtering: ListboxFilteringService,
    protected scrolling: ListboxScrollService,
    protected destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.service.isMultiSelect = this.isMultiSelect;
  }

  ngAfterContentInit(): void {
    this.setProjectedContent();
    this.activeIndex.init(this.allOptions$, this.destroyRef);
    this.setSelectedEmitting();
    this.setOnBlurEvent();
    this.setOptionAction();
    setTimeout(() => {
      this.setBoxLabel();
      this.updateActiveIndexOnExternalChanges();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.activeIndex.setScrollContentRef(this.scrollContentRef);
    this.setResetOnClose();
  }

  setProjectedContent(): void {
    this.groups$ = this.groups.changes.pipe(
      startWith(''),
      map(() => this.groups.toArray()),
      delay(0)
    );

    // will not track changes to properties, just if the list of options changes
    const options$ = this.options.changes.pipe(
      startWith(''),
      map(() => this.options.toArray()),
      delay(0)
    );

    this.allOptions$ =
      this.groups.length > 0
        ? this.groups$.pipe(
            map((groups) => groups.flatMap((group) => group.options.toArray()))
          )
        : options$;

    this.optionPropertyChanges$ = this.allOptions$.pipe(
      switchMap((options) =>
        merge(options.map((o) => o.externalPropertyChanges$))
      ),
      mergeAll(),
      shareReplay(1)
    );
  }

  setSelectedEmitting(): void {
    this.selectedOptionsToEmit$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        map((options) => {
          const selections = [];
          for (const option of options) {
            const value = option.valueToEmit;
            selections.push(value);
          }
          // Add any previous selections that the user may have made that may not be in options anymore due to filtering
          // For example, the user selects MA, ME, MI, then applies a filter to see only New England states (MI is removed) -- then removes the filter -- this ensures that MI is still selected
          for (const value of this.service.selectedOptionValues) {
            if (!selections.includes(value)) {
              selections.push(value);
            }
          }
          return selections;
        })
      )
      .subscribe((value) => {
        this.emitValue(value);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emitValue(selections: any[]): void {
    const value = this.isMultiSelect ? selections : selections[0];
    if (this.formControl) {
      this.formControl.setValue(value);
    } else {
      this.valueChanges.emit(value);
    }
  }

  setOnBlurEvent() {
    this.service.blurEvent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(
          combineLatest([this.service.isOpen$, this.activeIndex.activeIndex$]),
          this.allOptions$
        ),
        filter(([, [isOpen]]) => isOpen)
      )
      .subscribe(([, [isOpen, activeIndex], options]) => {
        if (isOpen) {
          if (this.shouldAutoSelectOptionOnBlur(activeIndex, options)) {
            const index = activeIndex ?? 0;
            this.selectOptionFromIndex(index, options);
          }
          this.service.closeListbox();
        }
      });
  }

  shouldAutoSelectOptionOnBlur(
    activeIndex: number,
    options: ListboxOptionComponent[]
  ): boolean {
    const activeIndexOptionIsSelected = options[activeIndex]?.isSelected();
    return (
      this.service.shouldAutoSelectOnListboxClose &&
      !activeIndexOptionIsSelected
    );
  }

  setOptionAction() {
    this.service.optionAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.activeIndex.activeIndex$, this.allOptions$)
      )
      .subscribe(([action, activeIndex, options]) => {
        if (options.length === 0) {
          this.service.setVisualFocus(VisualFocus.textbox);
          return;
        }
        if (!this.actionIsTypingChar(action)) {
          if (action === OptionAction.select) {
            this.selectOptionFromIndex(activeIndex, options);
          }
          //double check because typesafety on this kind of sucks, could add && str.match(/\S| /)
        } else if (action.length === 1) {
          this.activeIndex.updateActiveIndexFromKeyChar(action, options);
        } else {
          throw new Error(`Invalid action: ${action}`);
        }
      });
  }

  actionIsTypingChar(action: OptionAction | string): boolean {
    return !(Object.values(OptionAction) as string[]).includes(action);
  }

  setResetOnClose(): void {
    this.service.isOpen$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        filter((isOpen) => !isOpen),
        withLatestFrom(this.allOptions$)
      )
      .subscribe(([, options]) => {
        this.activeIndex.setActiveIndexToFirstSelectedOrDefault(options);
        this.resetScroll();
      });
  }

  resetScroll(): void {
    if (this.scrolling.isScrollable(this.scrollContentRef.nativeElement)) {
      this.scrolling.scrollToTop(
        this.scrollContentRef.nativeElement.parentElement
      );
    }
  }

  setBoxLabel(): void {
    if (this.service.dynamicLabel) {
      combineLatest([
        this.service.touched$,
        this.allOptions$, // when options (not properties) change
        this.selectedOptionsToEmit$, // when a user clicks
        this.optionPropertyChanges$.pipe(startWith(null)), // on an outside change,
      ])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([touched, options]) => {
          const selectedOptions = this.getSelectedOptions(options);
          let label = '';
          const numSelected = selectedOptions?.length;
          if (
            this.service.useListboxLabelAsBoxPlaceholder &&
            ((!numSelected &&
              !this.service.countSelectedLabel &&
              !this.service.customTextboxLabel) ||
              (!numSelected && !touched))
          ) {
            label = this.label?.label?.nativeElement.innerText || '';
          } else if (
            this.service.customTextboxLabel &&
            this.service.countSelectedLabel
          ) {
            label = this.service.customTextboxLabel(
              selectedOptions,
              this.service.countSelectedLabel
            );
          } else if (this.service.customTextboxLabel) {
            label = this.service.customTextboxLabel(selectedOptions);
          } else if (this.service.countSelectedLabel) {
            if (numSelected === 1) {
              label = `${numSelected} ${this.service.countSelectedLabel.singular} selected`;
            } else {
              label = `${numSelected} ${this.service.countSelectedLabel.plural} selected`;
            }
          } else {
            label = this.getBoxValuesLabel(selectedOptions);
          }
          this.service.updateBoxLabel(label);
        });
    }
  }

  getBoxValuesLabel(selectedOptions: ListboxOptionComponent[]): string {
    let label = '';
    if (selectedOptions) {
      label = selectedOptions
        .reduce((acc, option) => {
          const value =
            option.boxDisplayLabel ?? option.label?.nativeElement.innerText;
          if (value) {
            acc.push(value);
          }
          return acc;
        }, [])
        .join(', ');
    }
    return label;
  }

  selectOptionFromIndex(
    index: number,
    options: ListboxOptionComponent[]
  ): void {
    this.handleOptionSelect(index, options);
  }

  handleOptionClick(
    event: MouseEvent,
    options: ListboxOptionComponent[],
    optionIndex: number,
    groupIndex?: number
  ): void {
    event.stopPropagation();
    this.handleOptionSelect(optionIndex, options, groupIndex);
    if (!this.isMultiSelect) {
      this.service.closeListbox();
    }
    this.service.setVisualFocus(VisualFocus.textbox);
  }

  handleOptionSelect(
    optionIndex: number,
    options: ListboxOptionComponent[],
    groupIndex?: number
  ): void {
    const index = groupIndex
      ? this.getOptionIndexFromGroups(groupIndex, optionIndex)
      : optionIndex;
    const option = options[index];
    if (!option || option.isDisabled()) return;
    this.toggleOptionSelected(option, options);
    this.activeIndex.setActiveIndex(index, null, options);
  }

  toggleOptionSelected(
    option: ListboxOptionComponent,
    options: ListboxOptionComponent[]
  ): void {
    if (!option || option.isDisabled()) {
      this.service.setVisualFocus(VisualFocus.textbox);
      return;
    }
    if (this.isMultiSelect) {
      option.toggleSelected();
      this.updateSelectedOptionsToEmit(options);
    } else {
      this.selectSingleSelectOption(option, options);
    }
  }

  updateSelectedOptionsToEmit(options: ListboxOptionComponent[]): void {
    const selected = this.getSelectedOptions(options);
    this.selectedOptionsToEmit.next(selected);
  }

  selectSingleSelectOption(
    option: ListboxOptionComponent,
    options: ListboxOptionComponent[]
  ): void {
    if (option.isSelected()) return;
    options.forEach((o) => {
      if (o !== option) {
        o.deselect();
      }
    });
    option.select();
    this.updateSelectedOptionsToEmit(options);
  }

  isSelectAllListboxOption(
    option: ListboxOptionComponent
  ): option is SelectAllListboxOptionComponent {
    return option instanceof SelectAllListboxOptionComponent;
  }

  getOptionIndexFromGroups(groupIndex: number, optionIndex: number): number {
    return (
      this.groups
        .toArray()
        .slice(0, groupIndex)
        .reduce((acc, curr) => acc + curr.options.toArray().length, 0) +
      optionIndex
    );
  }

  getGroupIndexFromOptionIndex(optionIndex: number): number {
    for (const [index, group] of this.groups.toArray().entries()) {
      optionIndex -= group.options.toArray().length;
      if (optionIndex < 0) {
        return index;
      }
    }
    console.log('Error: could not find group index for option');
    return -1;
  }

  getSelectedOptions(
    options: ListboxOptionComponent[]
  ): ListboxOptionComponent[] {
    return options?.filter(
      (option) => !this.isSelectAllListboxOption(option) && option.isSelected()
    );
  }

  updateActiveIndexOnExternalChanges(): void {
    this.optionPropertyChanges$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        pairwise(),
        filter(([prev, curr]) => {
          return !!prev && !!curr && prev.optionValue !== curr.optionValue;
        }),
        withLatestFrom(this.allOptions$, this.activeIndex.activeIndex$)
      )
      .subscribe(([, options]) => {
        this.activeIndex.setActiveIndexToFirstSelectedOrDefault(options);
      });
  }

  handleOptionMousedown(): void {
    this.service.ignoreBlur = true;
  }
}

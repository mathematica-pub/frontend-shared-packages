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
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
  map,
  merge,
  mergeAll,
  pairwise,
  shareReplay,
  skip,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import {
  AutoComplete,
  ComboboxService,
  OptionAction,
  OptionActionType,
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

export type SingleSelectListboxValue<T> = string | T;
export type MultiSelectListboxValue<T> = (string | T)[];
export type ListboxValue<T> =
  | SingleSelectListboxValue<T>
  | MultiSelectListboxValue<T>;
export type CountSelectedOptionsLabel = {
  singular: string;
  plural: string;
};

@Component({
  selector: 'hsi-ui-listbox',
  templateUrl: './listbox.component.html',
  providers: [ListboxFilteringService, ListboxScrollService],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'combobox-listbox-component',
  },
})
export class ListboxComponent<T>
  implements OnInit, AfterContentInit, AfterViewInit
{
  @Input() maxHeight = 300;
  @Input() isMultiSelect = false;
  @Input() labelIsBoxPlaceholder = false;
  @Input() findsOptionOnTyping = true;
  @Input() countSelectedOptionsLabel?: CountSelectedOptionsLabel;
  @Input() customTextboxLabel?: (
    options: ListboxOptionComponent<T>[],
    countSelectedOptionsLabel?: CountSelectedOptionsLabel
  ) => string;
  @Output() valueChanges = new EventEmitter<ListboxValue<T>>();
  @ViewChild('listboxEl') listboxElRef: ElementRef;
  @ContentChild(ListboxLabelComponent, { descendants: false })
  label: ListboxLabelComponent;
  @ContentChildren(ListboxOptionComponent, { descendants: false })
  options: QueryList<ListboxOptionComponent<T>>;
  @ContentChildren(ListboxGroupComponent)
  groups: QueryList<ListboxGroupComponent<T>>;
  labels$: Observable<ListboxLabelComponent[]>;
  options$: Observable<ListboxOptionComponent<T>[]>;
  selectedOptions: BehaviorSubject<ListboxOptionComponent<T>[]> =
    new BehaviorSubject([]);
  selectedOptions$ = this.selectedOptions.asObservable();
  optionPropertyChanges$: Observable<ListboxOptionPropertyChange<T>>;
  groups$: Observable<ListboxGroupComponent<T>[]>;
  activeIndex: BehaviorSubject<number> = new BehaviorSubject(null);
  activeIndex$ = this.activeIndex.asObservable().pipe(distinctUntilChanged());
  visuallyFocused: boolean;

  get allOptionsArray(): ListboxOptionComponent<T>[] {
    if (this.groups.length > 0) {
      return this.groups
        .toArray()
        .map((group) => group.options.toArray())
        .flat();
    } else {
      return this.options.toArray();
    }
  }

  constructor(
    public service: ComboboxService,
    protected filtering: ListboxFilteringService<T>,
    protected scrolling: ListboxScrollService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.service.isMultiSelect = this.isMultiSelect;
    this.setActiveDescendant();
  }

  ngAfterContentInit(): void {
    this.setProjectedContent();
    this.setSelectedEmitting();
    this.setOnBlurEvent();
    this.setOptionAction();
    setTimeout(() => {
      this.setBoxLabel();
      this.setActiveIndexToFirstSelected(true);
      this.updateActiveIndexOnExternalChanges();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.setResetOnClose();
  }

  setActiveDescendant(): void {
    const activeDescendant$ = this.activeIndex$.pipe(
      map((i) => {
        if (i === null || i < 0) {
          return null;
        } else {
          return `${this.service.id}-listbox-option-${i}`;
        }
      })
    );
    this.service.initActiveDescendant(activeDescendant$);
  }

  setProjectedContent(): void {
    this.groups$ = this.groups.changes.pipe(
      startWith(''),
      map(() => this.groups.toArray()),
      delay(0)
    );

    this.options$ = this.options.changes.pipe(
      startWith(''),
      map(() => this.options.toArray()),
      delay(0)
    );

    const allOptions$ =
      this.groups.length > 0
        ? this.groups$.pipe(
            map((groups) => groups.flatMap((group) => group.options.toArray()))
          )
        : this.options$;

    this.optionPropertyChanges$ = allOptions$.pipe(
      switchMap((options) => merge(options.map((o) => o.changes$))),
      mergeAll(),
      shareReplay(1)
    );
  }

  setSelectedEmitting(): void {
    this.selectedOptions$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        map((options) => {
          const selections = [];
          for (const option of options) {
            const value = option.value
              ? option.value
              : option.label?.nativeElement.innerText.trim();
            selections.push(value);
          }
          const selected = this.isMultiSelect ? selections : selections[0];
          return selected;
        })
      )
      .subscribe((value) => {
        this.emitValue(value);
      });
  }

  emitValue(selections: ListboxValue<T>): void {
    this.valueChanges.emit(selections);
  }

  setOnBlurEvent() {
    this.service.blurEvent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(
          combineLatest([this.service.isOpen$, this.activeIndex$])
        ),
        filter(([, [isOpen]]) => isOpen)
      )
      .subscribe(([, [isOpen, activeIndex]]) => {
        if (isOpen) {
          if (this.shouldSelectActiveIndexOptionOnBlur(activeIndex)) {
            const index = activeIndex ?? 0;
            this.selectOptionFromIndex(index);
          }
          this.service.closeListbox();
        }
      });
  }

  shouldSelectActiveIndexOptionOnBlur(activeIndex: number) {
    return (
      activeIndex !== null || (this.service.autoSelect && activeIndex === null)
    );
  }

  setOptionAction() {
    this.service.optionAction$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.activeIndex$)
      )
      .subscribe(([action, activeIndex]) => {
        if (this.allOptionsArray.length === 0) {
          this.service.setVisualFocus(VisualFocus.textbox);
          return;
        }
        if (!this.actionIsTypingChar(action)) {
          const max = this.allOptionsArray.length - 1;
          if (
            action === OptionAction.last ||
            action === OptionAction.next ||
            action === OptionAction.pageDown
          ) {
            if (activeIndex === null && action === OptionAction.next) {
              this.setActiveIndex(0, OptionAction.next);
            } else {
              this.setActiveIndex(
                this.getIndexForAction(activeIndex, max, action),
                OptionAction.next
              );
            }
          } else if (
            action === OptionAction.first ||
            action === OptionAction.pageUp ||
            action === OptionAction.previous
          ) {
            this.setActiveIndex(
              this.getIndexForAction(activeIndex, max, action),
              OptionAction.previous
            );
          } else if (action === OptionAction.select) {
            this.selectOptionFromIndex(activeIndex);
          } else if (action === OptionAction.zeroActiveIndex) {
            this.setActiveIndex(0, OptionAction.next);
          } else if (action === OptionAction.nullActiveIndex) {
            this.setActiveIndex(null, null);
          }
          //double check because typesafety on this kind of sucks, could add && str.match(/\S| /)
        } else if (action.length === 1) {
          this.updateActiveIndexFromKeyChar(action);
        } else {
          throw new Error('Invalid action');
        }
      });
  }

  actionIsTypingChar(action: OptionActionType): boolean {
    return (
      action !== OptionAction.last &&
      action !== OptionAction.first &&
      action !== OptionAction.next &&
      action !== OptionAction.previous &&
      action !== OptionAction.pageDown &&
      action !== OptionAction.pageUp &&
      action !== OptionAction.select &&
      action !== OptionAction.nullActiveIndex &&
      action !== OptionAction.zeroActiveIndex
    );
  }

  selectOptionFromIndex(index: number): void {
    this.handleOptionSelect(this.allOptionsArray[index], index);
  }

  handleOptionSelect(
    option: ListboxOptionComponent<T>,
    optionIndex: number,
    groupIndex?: number
  ): void {
    if (!option || option.isDisabled()) return;
    this.toggleOptionSelected(option);
    const index = groupIndex
      ? this.getOptionIndexFromGroups(groupIndex, optionIndex)
      : optionIndex;
    this.setActiveIndex(index, null);
  }

  updateSelectedOptionsToEmit(): void {
    const selected = this.getSelectedOptions();
    this.selectedOptions.next(selected);
  }

  updateActiveIndexFromKeyChar(char: string): void {
    this.filtering.updateSearchString(char);
    const searchIndex = this.filtering.getIndexByLetter(
      this.allOptionsArray,
      this.filtering.searchString,
      this.activeIndex.value + 1
    );

    if (searchIndex >= 0) {
      this.setActiveIndex(searchIndex, OptionAction.next);
    } else {
      this.filtering.resetSearch();
    }
  }

  setResetOnClose(): void {
    this.service.isOpen$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        filter((isOpen) => !isOpen)
      )
      .subscribe(() => {
        this.resetScroll();
        this.setActiveIndexToFirstSelected();
      });
  }

  resetScroll(): void {
    if (this.scrolling.isScrollable(this.listboxElRef.nativeElement)) {
      this.scrolling.scrollToTop(this.listboxElRef.nativeElement);
    }
  }

  setActiveIndexToFirstSelected(isInit = false): void {
    if (this.isMultiSelect) {
      const firstSelected =
        this.allOptionsArray.findIndex((x) => x.isSelected()) ?? 0;
      this.activeIndex.next(firstSelected);
      if (!isInit) {
        this.setActiveIndex(firstSelected, OptionAction.next);
      } else {
        this.activeIndex.next(firstSelected);
      }
    }
  }

  setBoxLabel(): void {
    if (this.service.displayValue) {
      const componentChanges$ =
        this.groups.length > 0 ? this.groups$ : this.options$;

      combineLatest([
        componentChanges$,
        this.selectedOptions$.pipe(startWith([])),
        this.optionPropertyChanges$,
      ])
        .pipe(startWith([]), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const options = this.getSelectedOptions();
          let label = '';
          if (options.length === 0 && this.labelIsBoxPlaceholder) {
            label = this.label?.label?.nativeElement.innerText || '';
          } else if (
            this.customTextboxLabel &&
            this.countSelectedOptionsLabel
          ) {
            label = this.customTextboxLabel(
              options,
              this.countSelectedOptionsLabel
            );
          } else if (this.customTextboxLabel) {
            label = this.customTextboxLabel(options);
          } else if (this.countSelectedOptionsLabel) {
            if (options.length === 1) {
              label = `${options.length} ${this.countSelectedOptionsLabel.singular} selected`;
            } else {
              label = `${options.length} ${this.countSelectedOptionsLabel.plural} selected`;
            }
          } else {
            label = this.getBoxValuesLabel(options);
          }
          this.service.updateBoxLabel(label);
        });
    }
  }

  getBoxValuesLabel(options: ListboxOptionComponent<T>[]): string {
    let label = '';
    if (options) {
      label = options
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

  setActiveIndex(
    index: number,
    actionIfDisabled: OptionAction.next | OptionAction.previous,
    scrollToIndex = true
  ): void {
    let attempt = index;
    const options = this.allOptionsArray;
    while (index !== null && options[attempt]?.isDisabled()) {
      if (actionIfDisabled === OptionAction.next) {
        attempt++;
      } else {
        attempt--;
      }
    }
    if (attempt >= 0 && attempt < options.length) {
      if (attempt !== null && scrollToIndex) {
        this.handleScrollingForNewIndex(attempt);
      }
      this.activeIndex.next(attempt);
    } else {
      this.service.setVisualFocus(VisualFocus.textbox);
      if (this.service.autoComplete !== AutoComplete.none) {
        this.activeIndex.next(null);
      }
    }
  }

  handleScrollingForNewIndex(index: number): void {
    const indexEl = this.allOptionsArray[index].label?.nativeElement;
    if (indexEl) {
      if (this.scrolling.isScrollable(this.listboxElRef.nativeElement)) {
        this.scrolling.maintainScrollVisibility(
          indexEl,
          this.listboxElRef.nativeElement
        );
      }
      if (!this.scrolling.isElementInView(indexEl)) {
        indexEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  getIndexForAction(
    currentIndex: number,
    maxIndex: number,
    action: OptionActionType
  ): number {
    const pageSize = 10; // used for pageup/pagedown
    const loop = this.service.autoComplete !== AutoComplete.none;
    const previous = () => {
      if (loop) {
        return currentIndex === 0 ? maxIndex : currentIndex - 1;
      } else {
        return Math.max(0, currentIndex - 1);
      }
    };
    const next = () => {
      if (loop) {
        return currentIndex === maxIndex ? 0 : currentIndex + 1;
      } else {
        return Math.min(maxIndex, currentIndex + 1);
      }
    };

    switch (action) {
      case OptionAction.first:
        return 0;
      case OptionAction.last:
        return maxIndex;
      case OptionAction.previous:
        return previous();
      case OptionAction.next:
        return next();
      case OptionAction.pageUp:
        return Math.max(0, currentIndex - pageSize);
      case OptionAction.pageDown:
        return Math.min(maxIndex, currentIndex + pageSize);
      default:
        return currentIndex;
    }
  }

  handleOptionClick(
    event: MouseEvent,
    option: ListboxOptionComponent<T>,
    optionIndex: number,
    groupIndex?: number
  ): void {
    event.stopPropagation();
    this.handleOptionSelect(option, optionIndex, groupIndex);
    if (!this.isMultiSelect) {
      this.service.closeListbox();
    }
    this.service.setVisualFocus(VisualFocus.textbox);
  }

  isSelectAllListboxOption(
    option: ListboxOptionComponent<T>
  ): option is SelectAllListboxOptionComponent<T> {
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

  toggleOptionSelected(option: ListboxOptionComponent<T>): void {
    if (!option || option.isDisabled()) {
      this.service.setVisualFocus(VisualFocus.textbox);
      return;
    }
    if (this.isMultiSelect) {
      option.toggleSelected();
      this.updateSelectedOptionsToEmit();
    } else {
      this.selectSingleSelectOption(option);
    }
  }

  selectSingleSelectOption(option: ListboxOptionComponent<T>): void {
    if (option.isSelected()) return;
    this.allOptionsArray.forEach((o) => {
      if (o !== option) {
        o.deselect();
      }
    });
    option.select();
    this.updateSelectedOptionsToEmit();
  }

  getSelectedOptions(): ListboxOptionComponent<T>[] {
    return this.allOptionsArray.filter(
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
        withLatestFrom(this.activeIndex$)
      )
      .subscribe(([, activeIndex]) => {
        if (activeIndex === null) {
          this.setActiveIndexToFirstSelected();
        }
      });
  }

  handleOptionMousedown(): void {
    this.service.ignoreBlur = true;
  }

  trackByFn(index: number, item: ListboxOptionComponent<T>): number {
    return item.id;
  }
}

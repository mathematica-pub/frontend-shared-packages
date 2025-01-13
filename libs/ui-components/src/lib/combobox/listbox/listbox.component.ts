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
  NgZone,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  combineLatest,
  filter,
  map,
  pairwise,
  skip,
  take,
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
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { SelectAllListboxOptionComponent } from '../select-all-listbox-option/select-all-listbox-option.component';
import { ActiveIndexService } from './active-index.service';

export type SelectedCountLabel = {
  singular: string;
  plural: string;
};

@Component({
  selector: 'hsi-ui-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss'],
  providers: [
    ListboxFilteringService,
    ListboxScrollService,
    ActiveIndexService,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'hsi-ui-listbox',
  },
})
export class ListboxComponent
  implements OnChanges, AfterContentInit, AfterViewInit
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() ngFormControl: FormControl<any | any[]>;
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
  // allOptions$: Observable<ListboxOptionComponent[]>;
  // groups$: Observable<ListboxGroupComponent[]>;
  // optionPropertyChanges$: Observable<ListboxOptionPropertyChange>;
  // selectedOptionsToEmit: BehaviorSubject<ListboxOptionComponent[]> =
  //   new BehaviorSubject([]);
  // selectedOptionsToEmit$ = this.selectedOptionsToEmit.asObservable();
  allOptions: ListboxOptionComponent[];

  constructor(
    private zone: NgZone,
    public service: ComboboxService,
    public activeIndex: ActiveIndexService,
    protected filtering: ListboxFilteringService,
    protected scrolling: ListboxScrollService,
    protected destroyRef: DestroyRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMultiSelect']) {
      this.service.isMultiSelect = this.isMultiSelect;
    }
  }

  ngAfterContentInit(): void {
    this.service.setProjectedContent(this.groups, this.options);
    this.activeIndex.init(this.service.allOptions$, this.destroyRef);
    this.setSelectedEmitting();
    this.setOnBlurEvent();
    this.setOptionAction();
    setTimeout(() => {
      this.updateActiveIndexOnExternalChanges();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.setOnOptionChanges();
    this.activeIndex.setScrollContentRef(this.scrollContentRef);
    this.setResetOnClose();
  }

  setOnOptionChanges(): void {
    this.service.allOptions$.pipe(take(1)).subscribe((options) => {
      options.forEach((option) => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              console.log('Content DOM changed', mutations);
            }
          });
        });

        observer.observe(option.optionContainer.nativeElement, {
          childList: true,
          subtree: true,
        });
      });
      this.service.setTextboxLabel();
    });

    // cannot pass allOptions$ to handleOptionClick through template because @if (allOptions | async; as allOptions) will delay rendering of option.template and option.label will not be defined when setBoxLabel is called. Thus subscribe and set allOptions in here.
    this.service.allOptions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((options) => {
        console.log('allOptions', options);
        this.allOptions = options;
        this.service.allOptions = options;
      });
  }

  setSelectedEmitting(): void {
    this.service.selectedOptionsToEmit$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        map((options) => {
          const selections = [];
          for (const option of options) {
            const value = option.valueToEmit;
            selections.push(value);
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
    if (this.ngFormControl) {
      this.ngFormControl.setValue(value);
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
          this.service.allOptions$
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
        withLatestFrom(this.activeIndex.activeIndex$, this.service.allOptions$)
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
        withLatestFrom(this.service.allOptions$)
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

  getListboxLabelAsBoxPlaceholder(): string {
    return this.label?.label?.nativeElement.innerText || '';
  }

  selectOptionFromIndex(
    index: number,
    options: ListboxOptionComponent[]
  ): void {
    this.handleOptionSelect(index, options);
  }

  handleOptionClick(
    event: MouseEvent,
    optionIndex: number,
    groupIndex?: number
  ): void {
    event.stopPropagation();
    this.handleOptionSelect(optionIndex, this.allOptions, groupIndex);
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
    this.service.setSelectedOptionsToEmit(selected);
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

  getSelectedOptions(
    options: ListboxOptionComponent[]
  ): ListboxOptionComponent[] {
    return options?.filter(
      (option) => !this.isSelectAllListboxOption(option) && option.isSelected()
    );
  }

  updateActiveIndexOnExternalChanges(): void {
    this.service.optionPropertyChanges$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        pairwise(),
        filter(([prev, curr]) => {
          return !!prev && !!curr && prev.optionValue !== curr.optionValue;
        }),
        withLatestFrom(this.service.allOptions$, this.activeIndex.activeIndex$)
      )
      .subscribe(([, options]) => {
        this.activeIndex.setActiveIndexToFirstSelectedOrDefault(options);
      });
  }

  handleOptionMousedown(): void {
    this.service.ignoreBlur = true;
  }
}

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
  delay,
  filter,
  map,
  pairwise,
  skip,
  take,
  withLatestFrom,
} from 'rxjs';
import {
  ComboboxService,
  FocusTextbox,
  OptionAction,
} from '../combobox.service';
import { ListboxGroupComponent } from '../listbox-group/listbox-group.component';
import { ListboxLabelComponent } from '../listbox-label/listbox-label.component';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { SelectAllListboxOptionComponent } from '../select-all-listbox-option/select-all-listbox-option.component';
import { ActiveIndexService } from './active-index.service';
import { ListboxFilteringService } from './listbox-filtering.service';
import { ListboxScrollService } from './listbox-scroll.service';

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
    class: 'hsi-ui-listbox-component',
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
  @ViewChild('scrollableContent')
  scrollableContentRef: ElementRef<HTMLDivElement>;
  @ContentChild(ListboxLabelComponent, { descendants: false })
  label: ListboxLabelComponent;
  @ContentChildren(ListboxOptionComponent, { descendants: false })
  options: QueryList<ListboxOptionComponent>;
  @ContentChildren(ListboxGroupComponent)
  groups: QueryList<ListboxGroupComponent>;

  constructor(
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
    this.activeIndex.setScrollContentRef(this.scrollableContentRef);
    this.setResetOnClose();
    this.setOnOptionChanges();
  }

  setOnOptionChanges(): void {
    this.service.allOptions$.pipe(take(1), delay(0)).subscribe(() => {
      this.service.setProjectedContentIsInDOM();
    });

    // cannot pass allOptions$ to handleOptionClick through template because @if (allOptions | async; as allOptions) will delay rendering of option.template and option.label will not be defined when setBoxLabel is called. Thus subscribe and set allOptions in here.
    this.service.allOptions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((options) => {
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
          this.service.emitTextboxFocus(FocusTextbox.default);
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
        this.service.emitTextboxFocus(FocusTextbox.includeMobile);
      });
  }

  resetScroll(): void {
    if (this.scrolling.isScrollable(this.scrollableContentRef.nativeElement)) {
      this.scrolling.scrollToTop(
        this.scrollableContentRef.nativeElement.parentElement
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
    this.service.setIsKeyboardEvent(false);
    this.handleOptionSelect(optionIndex, this.service.allOptions, groupIndex);
    if (!this.isMultiSelect) {
      this.service.closeListbox();
    }
    this.service.emitTextboxFocus(FocusTextbox.default);
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
    if (options[optionIndex].isSelected()) {
      this.activeIndex.setActiveIndex(index, null, options);
    } else {
      let nextSelectedIndex = options.findIndex(
        (o, i) => i > optionIndex && o.isSelected()
      );
      if (nextSelectedIndex === -1) {
        nextSelectedIndex = options.findIndex((o) => o.isSelected());
      }
      this.activeIndex.setActiveIndex(nextSelectedIndex, null, options);
    }
  }

  toggleOptionSelected(
    option: ListboxOptionComponent,
    options: ListboxOptionComponent[]
  ): void {
    if (!option || option.isDisabled()) {
      this.service.emitTextboxFocus(FocusTextbox.default);
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

import { Platform } from '@angular/cdk/platform';
import { Injectable, QueryList } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  distinctUntilChanged,
  map,
  merge,
  mergeAll,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ListboxGroupComponent } from './listbox-group/listbox-group.component';
import {
  ListboxOptionComponent,
  ListboxOptionPropertyChange,
} from './listbox-option/listbox-option.component';
import { SelectAllListboxOptionComponent } from './select-all-listbox-option/select-all-listbox-option.component';

let nextUniqueId = 0;

export enum FocusTextbox {
  default = 'default',
  includeMobile = 'includeMobile',
}

export interface KeyboardEventWithAutocomplete {
  event: KeyboardEvent;
  autoComplete: AutoComplete;
  inputHasText: boolean;
}

export enum Key {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  End = 'End',
  Enter = 'Enter',
  Escape = 'Escape',
  Home = 'Home',
  LeftArrow = 'ArrowLeft',
  PageDown = 'PageDown',
  PageUp = 'PageUp',
  RightArrow = 'ArrowRight',
  Space = ' ',
  Tab = 'Tab',
}

export enum OptionAction {
  first = 'first',
  last = 'last',
  next = 'next',
  nullActiveIndex = 'nullActiveIndex',
  pageDown = 'pageDown',
  pageUp = 'pageUp',
  previous = 'previous',
  select = 'select',
  zeroActiveIndex = 'zeroActiveIndex',
}

export enum ListboxAction {
  close = 'close',
  open = 'open',
  closeSelect = 'closeSelect',
}

export enum TextboxAction {
  focus = 'focus',
  setTextToValue = 'setTextToValue',
  cursorRight = 'cursorRight',
  cursorLeft = 'cursorLeft',
  cursorFirst = 'cursorFirst',
  cursorLast = 'cursorLast',
  addChar = 'addChar',
  type = 'type',
}

export enum AutoComplete {
  none = 'none',
  list = 'list',
  both = 'both',
  inline = 'inline',
}

export type ComboboxAction = OptionAction | ListboxAction | TextboxAction;

@Injectable()
export class ComboboxService {
  id = `combobox-${nextUniqueId++}`;
  scrollContainerId = `${this.id}-scroll-container`;
  comboboxLabelId = `${this.id}-label`;
  autoComplete: AutoComplete = AutoComplete.none;
  hasEditableTextbox = false;
  ignoreBlur = false;
  isMultiSelect = false;
  nullActiveIdOnClose = false;
  scrollWhenOpened = false;
  shouldAutoSelectOnListboxClose = false;
  activeDescendant$: Observable<string>;
  private blurEvent: Subject<void> = new Subject();
  blurEvent$ = this.blurEvent.asObservable();
  private projectedContentIsInDOM: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  projectedContentIsInDOM$ = this.projectedContentIsInDOM.asObservable();
  private _isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isOpen$ = this._isOpen.asObservable().pipe(distinctUntilChanged());
  private label: BehaviorSubject<ComboboxLabelComponent> = new BehaviorSubject(
    null
  );
  label$ = this.label.asObservable();
  private optionAction: Subject<OptionAction | string> = new Subject();
  optionAction$ = this.optionAction.asObservable();
  private focusTextbox: Subject<FocusTextbox> = new Subject<FocusTextbox>();
  focusTextbox$ = this.focusTextbox.asObservable();
  private touched: BehaviorSubject<boolean> = new BehaviorSubject(false);
  touched$ = this.touched.asObservable();
  allOptions$: Observable<ListboxOptionComponent[]>;
  groups$: Observable<ListboxGroupComponent[]>;
  optionPropertyChanges$: Observable<ListboxOptionPropertyChange>;
  private selectedOptionsToEmit: BehaviorSubject<ListboxOptionComponent[]> =
    new BehaviorSubject([]);
  selectedOptionsToEmit$ = this.selectedOptionsToEmit.asObservable();
  allOptions: ListboxOptionComponent[];
  private isKeyboardEvent = new BehaviorSubject(false);
  isKeyboardEvent$ = this.isKeyboardEvent.asObservable();

  constructor(private platform: Platform) {}

  get isOpen(): boolean {
    return this._isOpen.value;
  }

  initActiveDescendant(source$?: Observable<string>): void {
    if (source$) {
      this.activeDescendant$ = source$;
    } else {
      this.activeDescendant$ = of(null);
    }
  }

  setLabel(label: ComboboxLabelComponent): void {
    this.label.next(label);
  }

  openListbox(): void {
    this._isOpen.next(true);
  }

  closeListbox(): void {
    this._isOpen.next(false);
  }

  toggleListbox(): void {
    this._isOpen.next(!this._isOpen.value);
  }

  setProjectedContentIsInDOM(): void {
    this.projectedContentIsInDOM.next(true);
  }

  emitBlurEvent(): void {
    this.blurEvent.next();
  }

  setTouched(): void {
    this.touched.next(true);
  }

  emitTextboxFocus(focus: FocusTextbox): void {
    this.focusTextbox.next(focus);
  }

  emitOptionAction(action: OptionAction | string): void {
    this.optionAction.next(action);
  }

  isMobile(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  setProjectedContent(
    groups: QueryList<ListboxGroupComponent>,
    options: QueryList<ListboxOptionComponent>
  ): void {
    this.setGroups(groups);
    this.setAllOptions(groups, options);

    this.optionPropertyChanges$ = this.allOptions$.pipe(
      switchMap((options) =>
        merge(options.map((o) => o.externalPropertyChanges$))
      ),
      mergeAll()
    );
  }

  setGroups(groups: QueryList<ListboxGroupComponent>): void {
    this.groups$ = groups.changes.pipe(
      startWith(''),
      map(() => groups.toArray())
    );
  }

  setAllOptions(
    groups: QueryList<ListboxGroupComponent>,
    options: QueryList<ListboxOptionComponent>
  ): void {
    // will not track changes to properties, just if the list of options changes
    if (groups.length > 0) {
      this.allOptions$ = this.groups$.pipe(
        switchMap((groups) =>
          combineLatest(groups.map((group) => group.options$))
        ),
        map((optionArrays) => optionArrays.flat()),
        shareReplay(1)
      );
    } else {
      this.allOptions$ = options.changes.pipe(
        startWith(''),
        map(() => options.toArray()),
        shareReplay(1)
      );
    }
  }

  setSelectedOptionsToEmit(selected: ListboxOptionComponent[]): void {
    this.selectedOptionsToEmit.next(selected);
  }

  getSelectedOptions(
    options: ListboxOptionComponent[]
  ): ListboxOptionComponent[] {
    return options?.filter(
      (option) => !this.isSelectAllListboxOption(option) && option.isSelected()
    );
  }

  isSelectAllListboxOption(
    option: ListboxOptionComponent
  ): option is SelectAllListboxOptionComponent {
    return option instanceof SelectAllListboxOptionComponent;
  }

  setIsKeyboardEvent(isKeyboardEvent: boolean): void {
    this.isKeyboardEvent.next(isKeyboardEvent);
  }
}

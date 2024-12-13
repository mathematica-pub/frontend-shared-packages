import { Platform } from '@angular/cdk/platform';
import { ElementRef, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
  of,
} from 'rxjs';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ListboxOptionComponent } from './listbox-option/listbox-option.component';
import { CountSelectedLabel } from './listbox/listbox.component';

let nextUniqueId = 0;

export enum VisualFocus {
  textbox = 'textbox',
  listbox = 'listbox',
}

// export type VisualFocusType = keyof typeof VisualFocus;

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
  comboboxElRef: ElementRef;
  countSelectedLabel?: CountSelectedLabel;
  customTextboxLabel?: (
    options: ListboxOptionComponent[],
    countSelectedLabel?: CountSelectedLabel
  ) => string;
  dynamicLabel = false;
  ignoreBlur = false;
  isMultiSelect = false;
  nullActiveIdOnClose = false;
  scrollWhenOpened = false;
  shouldAutoSelectOnListboxClose = false;
  useListboxLabelAsBoxPlaceholder = false;
  activeDescendant$: Observable<string>;
  private blurEvent: Subject<void> = new Subject();
  blurEvent$ = this.blurEvent.asObservable();
  private boxLabel: BehaviorSubject<string> = new BehaviorSubject(null);
  boxLabel$ = this.boxLabel.asObservable();
  private _isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isOpen$ = this._isOpen.asObservable().pipe(distinctUntilChanged());
  private label: BehaviorSubject<ComboboxLabelComponent> = new BehaviorSubject(
    null
  );
  label$ = this.label.asObservable();
  private optionAction: Subject<OptionAction | string> = new Subject();
  optionAction$ = this.optionAction.asObservable();
  private _visualFocus: BehaviorSubject<VisualFocus> =
    new BehaviorSubject<VisualFocus>(VisualFocus.textbox);
  visualFocus$ = this._visualFocus.asObservable();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _selectedOptionValues: any[] = [];

  constructor(private platform: Platform) {}

  get isOpen(): boolean {
    return this._isOpen.value;
  }

  get visualFocus(): VisualFocus {
    return this._visualFocus.value;
  }

  get selectedOptionValues(): (string | number | boolean)[] {
    return this._selectedOptionValues;
  }

  initActiveDescendant(source$?: Observable<string>): void {
    if (source$) {
      this.activeDescendant$ = source$;
    } else {
      this.activeDescendant$ = of(null);
    }
  }

  setComboboxElRef(comboboxElRef: ElementRef): void {
    this.comboboxElRef = comboboxElRef;
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

  updateBoxLabel(label: string): void {
    this.boxLabel.next(label);
  }

  emitBlurEvent(): void {
    this.blurEvent.next();
  }

  setVisualFocus(focus: VisualFocus): void {
    this._visualFocus.next(focus);
  }

  emitOptionAction(action: OptionAction | string): void {
    this.optionAction.next(action);
  }

  isMobile(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  // selectedOptionValues are used to retain selection state regardless of options/option filtering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addSelection(value: any): void {
    if (!this._selectedOptionValues.includes(value)) {
      this._selectedOptionValues = [...this._selectedOptionValues, value];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeSelection(value: any): void {
    this._selectedOptionValues = this._selectedOptionValues.filter(
      (v) => v !== value
    );
  }
}

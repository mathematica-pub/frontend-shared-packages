import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
  of,
} from 'rxjs';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ListboxOptionComponent } from './listbox-option/listbox-option.component';
import { SelectedCountLabel } from './listbox/listbox.component';

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
  countSelectedLabel?: SelectedCountLabel;
  customTextboxLabel?: (
    options: ListboxOptionComponent[],
    countSelectedLabel?: SelectedCountLabel
  ) => string;
  dynamicLabel = false;
  ignoreBlur = false;
  isMultiSelect = false;
  nullActiveIdOnClose = false;
  scrollWhenOpened = false;
  shouldAutoSelectOnListboxClose = false;
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
  private touched: BehaviorSubject<boolean> = new BehaviorSubject(false);
  touched$ = this.touched.asObservable();
  visualFocus$ = this._visualFocus.asObservable();

  constructor(private platform: Platform) {}

  get isOpen(): boolean {
    return this._isOpen.value;
  }

  get visualFocus(): VisualFocus {
    return this._visualFocus.value;
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

  updateBoxLabel(label: string): void {
    this.boxLabel.next(label);
  }

  emitBlurEvent(): void {
    this.blurEvent.next();
  }

  setTouched(): void {
    this.touched.next(true);
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
}

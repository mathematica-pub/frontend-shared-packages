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

let nextUniqueId = 0;

export enum VisualFocus {
  textbox = 'textbox',
  listbox = 'listbox',
}

export type VisualFocusType = keyof typeof VisualFocus;

export interface KeyboardEventWithAutocomplete {
  event: KeyboardEvent;
  autoComplete: AutoCompleteType;
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

export type AutoCompleteType = keyof typeof AutoComplete;

export type OptionActionType = keyof typeof OptionAction | string;
export type ListboxActionType = keyof typeof ListboxAction;
export type TextboxActionType = keyof typeof TextboxAction;

export type ComboboxActionType =
  | OptionActionType
  | ListboxActionType
  | TextboxActionType;

@Injectable()
export class ComboboxService {
  id = `combobox-${nextUniqueId++}`;
  comboboxLabelId = `${this.id}-label`;
  scrollContainerId = `${this.id}-scroll-container`;
  private label: BehaviorSubject<ComboboxLabelComponent> = new BehaviorSubject(
    null
  );
  label$ = this.label.asObservable();
  scrollWhenOpened = false;
  comboboxElRef: ElementRef;
  private _visualFocus: BehaviorSubject<VisualFocusType> =
    new BehaviorSubject<VisualFocusType>(VisualFocus.textbox);
  visualFocus$ = this._visualFocus.asObservable();
  private optionAction: Subject<OptionActionType> = new Subject();
  optionAction$ = this.optionAction.asObservable();
  private blurEvent: Subject<void> = new Subject();
  blurEvent$ = this.blurEvent.asObservable();
  private _isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isOpen$ = this._isOpen.asObservable().pipe(distinctUntilChanged());
  private boxLabel: BehaviorSubject<string> = new BehaviorSubject(null);
  boxLabel$ = this.boxLabel.asObservable();
  private optionChanges: Subject<void> = new Subject();
  optionChanges$ = this.optionChanges.asObservable();
  activeDescendant$: Observable<string>;
  ignoreBlur = false;
  displayValue = true;
  isMultiSelect = false;
  autoComplete: AutoCompleteType = AutoComplete.none;
  autoSelect = false;

  constructor(private platform: Platform) {}

  get isOpen(): boolean {
    return this._isOpen.value;
  }

  get visualFocus(): VisualFocusType {
    return this._visualFocus.value;
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

  emitOptionChanges(): void {
    this.optionChanges.next();
  }

  setVisualFocus(focus: VisualFocusType): void {
    this._visualFocus.next(focus);
  }

  emitOptionAction(action: OptionActionType): void {
    this.optionAction.next(action);
  }

  isMobile(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }
}

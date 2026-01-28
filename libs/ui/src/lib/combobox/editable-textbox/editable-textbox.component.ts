import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { BehaviorSubject, skip } from 'rxjs';
import {
  AutoComplete,
  ComboboxAction,
  Key,
  ListboxAction,
  OptionAction,
  TextboxAction,
} from '../combobox.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { TextboxComponent } from '../textbox/textbox.component';

@Component({
  selector: 'hsi-ui-editable-textbox',
  imports: [CommonModule, FormsModule],
  templateUrl: './editable-textbox.component.html',
  styleUrls: ['./editable-textbox.component.scss'],
  host: {
    class: 'hsi-ui-editable-textbox',
  },
})
export class EditableTextboxComponent
  extends TextboxComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('box') inputElRef: ElementRef<HTMLInputElement>;
  @Input() autoSelect = false;
  @Input() autoSelectTrigger: 'any' | 'character' = 'character';
  @Input() displaySelected = true;
  @Input() initialValue = '';
  @Input() inputType: 'text' | 'search' = 'text';
  @Input() ngFormControl: FormControl<string>;
  @Input() placeholder = '';
  @Input() clearOnClick = false;
  @Output() valueChanges = new EventEmitter<string>();
  moveFocusToTextboxKeys = ['RightArrow', 'LeftArrow', 'Home', 'End'];
  value = new BehaviorSubject<string>('');
  value$ = this.value.asObservable();
  override openKeys = ['ArrowDown', 'ArrowUp'];

  override ngOnInit(): void {
    this.service.autoComplete = this.displaySelected
      ? AutoComplete.list
      : AutoComplete.none;
    this.service.shouldAutoSelectOnListboxClose =
      this.autoSelect && this.autoSelectTrigger === 'any';
    this.service.nullActiveIdOnClose = true;
    this.service.hasEditableTextbox = true;
    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.initialValue || this.ngFormControl?.value) {
      this.value.next(this.initialValue || this.ngFormControl.value);
    }
  }

  override setLabel(): void {
    this.service.selectedOptionsToEmit$ // when a user clicks
      .pipe(skip(1))
      .subscribe((selectedOptions) => this.onSelectionChange(selectedOptions));
  }

  onSelectionChange(selectedOptions: ListboxOptionComponent[]): void {
    if (this.service.isMultiSelect) {
      this.setAndEmitValue('');
    } else {
      const label = selectedOptions.length
        ? selectedOptions[0].label?.nativeElement.innerText.trim()
        : '';
      this.setAndEmitValue(label);
    }
  }

  onInputChange(value: string): void {
    if (value === '') {
      this.setAutoSelectWhenInputIsEmpty();
    } else {
      this.service.shouldAutoSelectOnListboxClose = this.autoSelect;
    }
    this.setAndEmitValue(value);
  }

  setAndEmitValue(value: string): void {
    this.setValue(value);
    this.emitValue(value);
  }

  setValue(value: string): void {
    this.value.next(value);
  }

  emitValue(value: string): void {
    if (this.ngFormControl) {
      this.ngFormControl.setValue(value);
    } else {
      this.valueChanges.emit(value);
    }
  }

  override handleClick(): void {
    this.service.setIsKeyboardEvent(false);
    if (this.service.isOpen) {
      this.service.closeListbox();
    } else {
      if (this.clearOnClick) {
        this.setAndEmitValue('');
      }
      this.service.openListbox();
      if (this.autoSelect) {
        const inputValue = this.inputElRef.nativeElement.value;
        if (inputValue === '') {
          this.setAutoSelectWhenInputIsEmpty();
        } else {
          this.service.shouldAutoSelectOnListboxClose = this.autoSelect;
        }
      }
    }
    this.service.emitTextboxFocus();
  }

  protected setAutoSelectWhenInputIsEmpty(): void {
    this.service.shouldAutoSelectOnListboxClose = this.autoSelect
      ? this.autoSelectTrigger === 'any'
      : false;
  }

  override onEscape(): void {
    if (!this.service.isOpen) {
      this.setAndEmitValue('');
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    } else {
      this.service.closeListbox();
      this.service.emitTextboxFocus();
    }
  }

  override getActionFromKeydownEvent(event: KeyboardEvent): ComboboxAction {
    if (event.ctrlKey || event.key === 'Shift') {
      return null;
    }

    if (!this.service.isOpen && this.openKeys.includes(event.key)) {
      return ListboxAction.open;
    } else if (!this.service.isOpen && event.key === Key.Tab) {
      return null;
    } else if (
      event.key === Key.Enter &&
      (this.service.shouldAutoSelectOnListboxClose
        ? !this.service.isOpen
        : true)
    ) {
      return ListboxAction.close;
    } else {
      if (
        event.key === Key.RightArrow ||
        event.key === Key.LeftArrow ||
        event.key === Key.Space
      ) {
        this.service.emitTextboxFocus();
        return null;
      } else {
        return this.getActionFromKeydownEventWhenOpen(event);
      }
    }
  }

  getActionFromKeydownEventWhenOpen(event: KeyboardEvent): ComboboxAction {
    const { key } = event;
    if (key === Key.ArrowDown || key === 'Down') {
      return OptionAction.next;
    } else if (key === Key.ArrowUp) {
      return OptionAction.previous;
    } else if (key === Key.Enter || key === Key.Space) {
      return this.service.isMultiSelect
        ? OptionAction.select
        : ListboxAction.closeSelect;
    } else if (key === Key.Home) {
      return TextboxAction.cursorFirst;
    } else if (key === Key.End) {
      return TextboxAction.cursorLast;
    } else if (this.isPrintableCharacter(key) || key === 'Backspace') {
      return TextboxAction.addChar;
    } else if (key === Key.Tab) {
      return ListboxAction.closeSelect;
    } else {
      return null;
    }
  }

  override handleKeyboardAction(action: string, event: KeyboardEvent): void {
    if (action === ListboxAction.closeSelect) {
      event.stopPropagation();
      event.preventDefault();
      this.service.emitOptionAction(OptionAction.select);
      this.service.closeListbox();
      if (event.key !== Key.Tab) {
        this.service.emitTextboxFocus();
      }
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    } else if (
      action === OptionAction.next ||
      action === OptionAction.previous ||
      action === OptionAction.select
    ) {
      event.stopPropagation();
      event.preventDefault();
      this.service.emitOptionAction(action);
    } else if (action === ListboxAction.open) {
      event.stopPropagation();
      event.preventDefault();
      this.service.emitOptionAction(OptionAction.zeroActiveIndex);
      this.service.openListbox();
      this.service.emitTextboxFocus();
    } else if (action === ListboxAction.close) {
      event.stopPropagation();
      event.preventDefault();
      this.service.closeListbox();
      this.service.emitTextboxFocus();
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    } else if (
      action === TextboxAction.cursorFirst ||
      action === TextboxAction.cursorLast ||
      action === TextboxAction.addChar
    ) {
      this.service.emitTextboxFocus();
      if (!this.service.isOpen) {
        this.service.openListbox();
      }
      if (action === TextboxAction.cursorFirst) {
        this.inputElRef.nativeElement.setSelectionRange(0, 0);
      } else if (action === TextboxAction.cursorLast) {
        this.inputElRef.nativeElement.setSelectionRange(
          this.inputElRef.nativeElement.value.length,
          this.inputElRef.nativeElement.value.length
        );
      }
      if (this.autoSelect && action === TextboxAction.addChar) {
        this.service.emitOptionAction(OptionAction.zeroActiveIndex);
      } else {
        this.service.emitOptionAction(OptionAction.nullActiveIndex);
      }
    }
  }

  isPrintableCharacter(str: string) {
    return str.length === 1 && str.match(/\S| /);
  }
}

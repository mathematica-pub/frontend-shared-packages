import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Autocomplete,
  AutocompleteType,
  ComboboxActionType,
  Key,
  ListboxAction,
  OptionAction,
  TextboxAction,
  VisualFocus,
} from '../combobox.service';
import { TextboxComponent } from '../textbox/textbox.component';

@Component({
  selector: 'hsi-ui-editable-textbox',
  templateUrl: './editable-textbox.component.html',
  styleUrls: ['./editable-textbox.component.scss'],
})
export class EditableTextboxComponent
  extends TextboxComponent
  implements OnInit
{
  @ViewChild('box') inputElRef: ElementRef<HTMLInputElement>;
  @Input() placeholder = '';
  @Input() inputType: 'text' | 'search' = 'text';
  @Input() autoSelectionOnTextInput: 'empty' | 'character' | 'none' | 'both' =
    'both';
  @Output() inputValue = new EventEmitter<string>();
  autocomplete: AutocompleteType = Autocomplete.list;
  moveFocusToTextboxKeys = ['RightArrow', 'LeftArrow', 'Home', 'End'];
  value = '';
  override openKeys = ['ArrowDown', 'ArrowUp'];

  override ngOnInit(): void {
    super.ngOnInit();
    this.service.autocomplete = this.autocomplete;
  }

  get autoSelectWhenTextboxIsEmpty(): boolean {
    return (
      this.autoSelectionOnTextInput === 'empty' ||
      this.autoSelectionOnTextInput === 'both'
    );
  }

  get autoSelectWhenTextboxHasCharacters(): boolean {
    return (
      this.autoSelectionOnTextInput === 'character' ||
      this.autoSelectionOnTextInput === 'both'
    );
  }

  setInputValue(value: string): void {
    this.inputElRef.nativeElement.value = value;
    if (value === '') {
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    }
  }

  onInputChange(value: string): void {
    if (value === '') {
      const optionAction = this.autoSelectWhenTextboxIsEmpty
        ? OptionAction.zeroActiveIndex
        : OptionAction.nullActiveIndex;
      this.service.emitOptionAction(optionAction);
    }
    this.inputValue.emit(value);
  }

  override handleClick(): void {
    if (this.service.isOpen) {
      this.service.closeListbox();
    } else {
      this.service.openListbox();
      const currentValue = this.inputElRef.nativeElement.value;
      let optionAction: OptionAction;
      if (currentValue === '') {
        optionAction = this.autoSelectWhenTextboxIsEmpty
          ? OptionAction.zeroActiveIndex
          : OptionAction.nullActiveIndex;
      } else {
        optionAction = this.autoSelectWhenTextboxHasCharacters
          ? OptionAction.zeroActiveIndex
          : OptionAction.nullActiveIndex;
      }
      this.service.emitOptionAction(optionAction);
    }
    this.service.setVisualFocus(VisualFocus.textbox);
  }

  override onEscape(): void {
    if (!this.service.isOpen) {
      this.setInputValue('');
    } else {
      this.service.closeListbox();
      this.service.setVisualFocus(VisualFocus.textbox);
    }
  }

  override getActionFromKeydownEvent(event: KeyboardEvent): ComboboxActionType {
    if (event.ctrlKey || event.key === 'Shift') {
      return null;
    }

    if (!this.service.isOpen && this.openKeys.includes(event.key)) {
      return ListboxAction.open;
    } else if (!this.service.isOpen && event.key === Key.Tab) {
      return null;
    } else if (
      event.key === Key.Enter &&
      this.service.visualFocus === VisualFocus.textbox &&
      (this.autoSelectWhenTextboxHasCharacters ? !this.service.isOpen : true)
    ) {
      return ListboxAction.close;
    } else {
      if (
        event.key === Key.RightArrow ||
        event.key === Key.LeftArrow ||
        event.key === Key.Space
      ) {
        this.service.setVisualFocus(VisualFocus.textbox);
        return null;
      } else {
        return this.getActionFromKeydownEventWhenOpen(event);
      }
    }
  }

  getActionFromKeydownEventWhenOpen(event: KeyboardEvent): ComboboxActionType {
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
    } else if (this.isPrintableCharacter(key)) {
      return TextboxAction.addChar;
    } else if (key === Key.Tab) {
      return ListboxAction.closeSelect;
    } else {
      return null;
    }
  }

  override handleComboboxAction(action: string, event: KeyboardEvent): void {
    if (action === ListboxAction.closeSelect) {
      event.stopPropagation();
      event.preventDefault();
      this.service.emitOptionAction(OptionAction.select);
      this.service.closeListbox();
      if (event.key !== Key.Tab) {
        this.service.setVisualFocus(VisualFocus.textbox);
      }
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    } else if (
      action === OptionAction.next ||
      action === OptionAction.previous ||
      action === OptionAction.select
    ) {
      event.stopPropagation();
      event.preventDefault();
      this.service.setVisualFocus(VisualFocus.listbox);
      this.service.emitOptionAction(action);
    } else if (action === ListboxAction.open) {
      event.stopPropagation();
      event.preventDefault();
      this.service.emitOptionAction(OptionAction.zeroActiveIndex);
      this.service.openListbox();
      this.service.setVisualFocus(VisualFocus.textbox);
    } else if (action === ListboxAction.close) {
      event.stopPropagation();
      event.preventDefault();
      this.service.closeListbox();
      this.service.setVisualFocus(VisualFocus.textbox);
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    } else if (
      action === TextboxAction.cursorFirst ||
      action === TextboxAction.cursorLast ||
      action === TextboxAction.addChar
    ) {
      this.service.setVisualFocus(VisualFocus.textbox);
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
      if (
        this.autoSelectWhenTextboxHasCharacters &&
        action === TextboxAction.addChar
      ) {
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

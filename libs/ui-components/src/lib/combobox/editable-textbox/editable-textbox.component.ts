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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, startWith, take } from 'rxjs';
import {
  AutoComplete,
  ComboboxAction,
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
  host: {
    class: 'hsi-ui-editable-textbox',
  },
})
export class EditableTextboxComponent
  extends TextboxComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('box') inputElRef: ElementRef<HTMLInputElement>;
  @Input() displaySelected = true;
  @Input() autoSelect = false;
  @Input() autoSelectTrigger: 'any' | 'character' = 'character';
  @Input() inputType: 'text' | 'search' = 'text';
  @Input() ngFormControl: FormControl<string>;
  @Input() placeholder = '';
  @Output() valueChanges = new EventEmitter<string>();
  moveFocusToTextboxKeys = ['RightArrow', 'LeftArrow', 'Home', 'End'];
  value = new BehaviorSubject<string>('');
  value$ = this.value.asObservable();
  override openKeys = ['ArrowDown', 'ArrowUp'];

  override ngOnInit(): void {
    super.ngOnInit();
    this.service.autoComplete = this.displaySelected
      ? AutoComplete.list
      : AutoComplete.none;
    this.service.shouldAutoSelectOnListboxClose =
      this.autoSelect && this.autoSelectTrigger === 'any';
    this.service.nullActiveIdOnClose = true;
    this.service.hasEditableTextbox = true;
    if (this.ngFormControl) {
      this.setValueChangeHandlingForFormControl();
    }

    this.service.initBoxLabel$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((x) => !!x)
      )
      .subscribe(() => {
        console.log(
          'setUpdateInputValueOnOptionSelect',
          this.service.allOptions
        );
        this.setUpdateInputValueOnOptionSelect();
      });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  setUpdateInputValueOnOptionSelect(): void {
    combineLatest([
      this.service.allOptions$.pipe(take(1)), // when options (not properties) change
      this.service.selectedOptionsToEmit$, // when a user clicks
      this.service.optionPropertyChanges$.pipe(
        filter((x) => !!x),
        startWith(null),
        take(1)
      ), // on an outside change,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([selectedOptions, changes]) => {
        console.log('changes', changes, this.service.allOptions);
        if (this.service.isMultiSelect) {
          this.updateInputValueFromBoxLabel('');
        } else {
          const label = this.service.allOptions
            ? this.service.allOptions
                .find((x) => x.selected)
                ?.label?.nativeElement.innerText.trim()
            : '';
          console.log(
            'label',
            label,
            this.service.allOptions?.find((x) => x.selected)
          );
          this.updateInputValueFromBoxLabel(label);
        }
      });
    // this.service.boxLabel$
    //   .pipe(
    //     filter((label) => label !== null),
    //     takeUntilDestroyed(this.destroyRef),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((label) => {
    //     console.log(
    //       'setUpdateInputValueOnOptionSelect with',
    //       label,
    //       this.service.allOptions
    //     );
    //     if (this.service.isMultiSelect) {
    //       this.updateInputValueFromBoxLabel('');
    //     } else if (this.displaySelected) {
    //       const selected = this.service.allOptions.find(
    //         (option) => option.selected
    //       );
    //       console.log(
    //         selected,
    //         selected?.label?.nativeElement.innerText.trim()
    //       );
    //       if (selected) {
    //         this.updateInputValueFromBoxLabel(label);
    //       }
    //     }
    //   });
    // this.service.optionPropertyChanges$
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     filter((x) => !!x),
    //     startWith(null),
    //     distinctUntilChanged(),
    //     withLatestFrom(this.service.allOptions$),
    //     debounceTime(0)
    //   )
    //   .subscribe(([optionPropertyChange, options]) => {
    //     console.log('optionPropertyChange', optionPropertyChange, options);
    //     if (this.service.isMultiSelect) {
    //       this.updateInputValueFromBoxLabel('');
    //     } else if (this.displaySelected) {
    //       const selected = options.find((option) => option.selected);
    //       this.updateInputValueFromBoxLabel(selected?.boxDisplayLabel || '');
    //     }
    //   });
  }

  updateInputValueFromBoxLabel(value: string): void {
    // if (this.ngFormControl) {
    //   console.log('set editable textbox form control value 1', value);
    //   this.ngFormControl.setValue(value, {
    //     emitEvent: false,
    //     emitModelToViewChange: true,
    //   });
    // } else {
    console.log('updateInputValueFromBoxLabel with', value);
    this.value.next(value);
    // this.valueChanges.emit(value);
    // }
  }

  onInputChange(value: string): void {
    console.log('onInputChange', value);
    if (value === '') {
      this.setAutoSelectWhenInputIsEmpty();
    } else {
      this.service.shouldAutoSelectOnListboxClose = this.autoSelect;
    }
    this.value.next(value);
    if (this.ngFormControl) {
      this.ngFormControl.setValue(value);
    } else {
      this.valueChanges.emit(value);
    }
  }

  setValueChangeHandlingForFormControl(): void {
    // this.value$
    //   .pipe(takeUntilDestroyed(this.destroyRef), skip(1))
    //   .subscribe((value) => {
    //     this.ngFormControl.setValue(value);
    //   });
    // this.ngFormControl.valueChanges
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value) => {
    //     console.log('form control value change', value);
    //     if (this.autoSelect) {
    //       if (value === '') {
    //         this.setAutoSelectWhenInputIsEmpty();
    //       } else {
    //         this.service.shouldAutoSelectOnListboxClose = this.autoSelect;
    //       }
    //     }
    //   });
  }

  override handleClick(): void {
    if (this.service.isOpen) {
      this.service.closeListbox();
    } else {
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
    this.service.setVisualFocus(VisualFocus.textbox);
  }

  protected setAutoSelectWhenInputIsEmpty(): void {
    this.service.shouldAutoSelectOnListboxClose = this.autoSelect
      ? this.autoSelectTrigger === 'any'
      : false;
  }

  override onEscape(): void {
    if (!this.service.isOpen) {
      this.value.next('');
      if (this.ngFormControl) {
        this.ngFormControl.setValue('');
      } else {
        this.valueChanges.emit('');
      }
      this.service.emitOptionAction(OptionAction.nullActiveIndex);
    } else {
      this.service.closeListbox();
      this.service.setVisualFocus(VisualFocus.textbox);
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
      this.service.visualFocus === VisualFocus.textbox &&
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
        this.service.setVisualFocus(VisualFocus.textbox);
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

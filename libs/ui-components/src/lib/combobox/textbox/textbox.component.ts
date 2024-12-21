import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, skip } from 'rxjs';
import {
  ComboboxAction,
  ComboboxService,
  Key,
  ListboxAction,
  OptionAction,
  TextboxAction,
  VisualFocus,
} from '../combobox.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { CountSelectedLabel } from '../listbox/listbox.component';

@Component({
  selector: 'hsi-ui-textbox',
  styleUrls: ['./textbox.component.scss'],
  templateUrl: './textbox.component.html',
  host: {
    class: 'hsi-ui-textbox',
  },
})
export class TextboxComponent implements OnInit, AfterViewInit {
  @Input() ariaLabel?: string;
  @Input() showSelectedCount?: CountSelectedLabel;
  @Input() customLabel: (selectedOptions: ListboxOptionComponent[]) => string;
  /*
   * Whether the textbox label responds to selections in any way.
   *
   * If true, the textbox label will display the selected option(s) if no other label properties are provided.
   *
   * @default true
   */
  @Input() dynamicLabel = true;
  @Input() findsOptionOnTyping = true;
  /*
   * Makes a provided listbox label the placeholder for the textbox when there are no selections and dynamicLabel is true.
   *
   * Will have no effect if dynamicLabel is false.
   *
   * @default false
   */
  @Input() useListboxLabelAsBoxLabel = false;
  @ViewChild('box') box: ElementRef<HTMLDivElement>;
  @ViewChild('boxIcon') boxIcon: ElementRef<HTMLDivElement>;
  openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

  constructor(
    public service: ComboboxService,
    private platform: Platform,
    protected destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.service.dynamicLabel = this.dynamicLabel;
    this.service.countSelectedLabel = this.showSelectedCount;
    this.service.customTextboxLabel = this.customLabel;
    this.service.useListboxLabelAsBoxPlaceholder =
      this.useListboxLabelAsBoxLabel;
  }

  ngAfterViewInit(): void {
    this.setFocusListener();
  }

  setFocusListener(): void {
    this.service.visualFocus$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skip(1),
        filter((focus) => focus === VisualFocus.textbox)
      )
      .subscribe(() => {
        this.focusBox();
      });
  }

  focusBox(): void {
    this.box.nativeElement.focus();
  }

  handleBlur(event: FocusEvent): void {
    if (event.relatedTarget && this.isHtmlElement(event.relatedTarget)) {
      // handles new Chrome behavior from focusable scroll containers https://issues.chromium.org/issues/359904703
      if (event.relatedTarget.id === this.service.scrollContainerId) {
        return;
      }
      if (event.relatedTarget.id.includes('listbox')) {
        this.service.setVisualFocus(VisualFocus.textbox);
        return;
        // TODO: Figure out why we implemented this on Scorecard and if it's necessary
      } else if (event.relatedTarget.tagName === 'BODY' && this.isMobile()) {
        this.focusBox();
        return;
      }
    }
    this.service.emitBlurEvent();
  }

  isHtmlElement(target: EventTarget): target is HTMLElement {
    return 'id' in target;
  }

  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }

  handleClick(): void {
    if (this.service.isOpen) {
      this.service.closeListbox();
    } else {
      this.service.setTouched();
      this.service.openListbox();
    }
    this.focusBox();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onEscape();
    } else {
      this.service.setTouched();
      const action = this.getActionFromKeydownEvent(event);
      this.handleKeyboardAction(action, event);
    }
  }

  onEscape(): void {
    this.service.closeListbox();
    this.service.setVisualFocus(VisualFocus.textbox);
  }

  getActionFromKeydownEvent(event: KeyboardEvent): ComboboxAction {
    if (!this.service.isOpen && this.openKeys.includes(event.key)) {
      return ListboxAction.open;
    }
    if (event.key === Key.Home) {
      return OptionAction.first;
    }
    if (event.key === Key.End) {
      return OptionAction.last;
    }
    if (this.findsOptionOnTyping && this.isTypingCharacter(event)) {
      return TextboxAction.type;
    }
    if (this.service.isOpen) {
      return this.getActionFromKeyEventWhenOpen(event);
    } else {
      return null;
    }
  }

  isTypingCharacter(event: KeyboardEvent): boolean {
    const { key, altKey, ctrlKey, metaKey } = event;
    return (
      key === 'Backspace' ||
      key === 'Clear' ||
      (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
    );
  }

  getActionFromKeyEventWhenOpen(event: KeyboardEvent): ComboboxAction {
    const { key, altKey } = event;
    if (key === Key.ArrowUp && altKey) {
      return ListboxAction.closeSelect;
    } else if (key === Key.ArrowDown && !altKey) {
      return OptionAction.next;
    } else if (key === Key.ArrowUp) {
      return OptionAction.previous;
    } else if (key === Key.PageUp) {
      return OptionAction.pageUp;
    } else if (key === Key.PageDown) {
      return OptionAction.pageDown;
    } else if (key === Key.Enter || key === Key.Space) {
      return this.service.isMultiSelect
        ? OptionAction.select
        : ListboxAction.closeSelect;
    } else {
      return null;
    }
  }

  handleKeyboardAction(action: ComboboxAction, event: KeyboardEvent): void {
    switch (action) {
      case OptionAction.first:
      case OptionAction.last:
        this.service.openListbox();
        this.focusBox();
        event.preventDefault();
        this.service.emitOptionAction(action);
        break;

      case OptionAction.next:
      case OptionAction.pageDown:
      case OptionAction.previous:
      case OptionAction.pageUp:
      case OptionAction.select:
        event.preventDefault();
        this.service.emitOptionAction(action);
        break;

      case ListboxAction.closeSelect:
        event.preventDefault();
        this.service.emitOptionAction(OptionAction.select);
        this.service.closeListbox();
        this.focusBox();
        break;

      case ListboxAction.close:
        event.preventDefault();
        this.service.closeListbox();
        this.focusBox();
        break;

      case TextboxAction.type:
        this.service.openListbox();
        this.focusBox();
        this.service.emitOptionAction(event.key);
        break;

      case ListboxAction.open:
        event.preventDefault();
        this.service.openListbox();
        this.focusBox();
    }
  }
}

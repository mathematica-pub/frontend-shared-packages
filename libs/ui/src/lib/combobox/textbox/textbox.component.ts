import { Combobox } from '@angular/aria/combobox';
import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { runNgChangeDetectionThen } from '@mathstack/app-kit';
import { BehaviorSubject, combineLatest, delay, filter, startWith } from 'rxjs';
import {
  ComboboxAction,
  ComboboxService,
  FocusTextbox,
  Key,
  ListboxAction,
  OptionAction,
  TextboxAction,
} from '../combobox.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { SelectedCountLabel } from '../listbox/listbox.component';

@Component({
  selector: 'hsi-ui-textbox',
  imports: [CommonModule, Combobox],
  styleUrls: ['./textbox.component.scss'],
  templateUrl: './textbox.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'hsi-ui-textbox',
    '(keydown)': 'handleHostKeydown($event)',
  },
})
export class TextboxComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() ariaLabel: string;
  @Input() useAngularAria = true;
  @Input() selectedCountLabel?: SelectedCountLabel;
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
  @ViewChild('box') box: ElementRef<HTMLDivElement>;
  @ViewChild(Combobox) comboboxDirective: Combobox;
  @ViewChild('boxIcon') boxIcon: ElementRef<HTMLDivElement>;
  openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
  label: BehaviorSubject<string> = new BehaviorSubject('');
  label$ = this.label.asObservable();
  protected destroyRef = inject(DestroyRef);
  public service = inject(ComboboxService);
  private platform = inject(Platform);
  protected zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private syncTriggerModeState(): void {
    this.service.setUsesLegacyTriggerAria(!this.useAngularAria);

    // Clear directive bridge immediately when switching to legacy mode.
    if (!this.useAngularAria) {
      this.service.setComboboxDirective(null);
    }
  }

  get expanded(): boolean {
    return this.service.isOpen;
  }

  set expanded(isOpen: boolean) {
    if (isOpen) {
      this.service.openListbox();
    } else {
      this.service.closeListbox();
    }
  }

  ngOnInit(): void {
    this.syncTriggerModeState();
    this.service.projectedContentIsInDOM$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((x) => !!x),
        // Required because the label is projected into the ListboxOption via <ng-content>, and the
        // listbox options are <ng-template>s that are projected into the listbox via ngTemplateOutlet.
        // We need this to ensure that the option labels are in the DOM to read from before we set the box label.
        runNgChangeDetectionThen(this.zone)
      )
      .subscribe(() => {
        this.setLabel();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['useAngularAria']) {
      this.syncTriggerModeState();
    }
  }

  ngAfterViewInit(): void {
    this.service.setComboboxDirective(this.comboboxDirective ?? null);
    this.setFocusListener();
  }

  ngOnDestroy(): void {
    this.service.setComboboxDirective(null);
    this.service.setUsesLegacyTriggerAria(false);
  }

  setFocusListener(): void {
    this.service.focusTextbox$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((focusType) => {
        if (!this.isMobile() || focusType === FocusTextbox.includeMobile) {
          this.focusBox();
        }
      });
  }

  focusBox(): void {
    this.box.nativeElement.focus();
  }

  handleBlur(event: FocusEvent): void {
    // DESCRIPTION OF HOW VARIOUS DEVICES/ASSISTIVE TECHNOLOGIES DO/NOT TRIGGER ANY BLUR EVENT (FocusEvent)
    // clicking (desktop) will trigger a blur event (item is focused, user clicks away, blur event fires)
    // keyboard navigation (desktop) will not trigger a blur event (item is focused, user navigates to another item, blur event does not fire)
    // tapping (mobile) will trigger a blur event (item is focused, user taps away, blur event fires)
    // swiping (VoiceOver) will trigger a blur event (item is focused, user swipes away, blur event fires)

    // The code below (lines 106 - 116) will refocus the textbox when the textbox receives blur event, and the
    // source of the blue event (related target) is something in the listbox.
    // We keep the focus on the textbox so that we can continue to listen for keyboard events to provide
    // keyboard navigation/interaction with the listbox options. The refocusing does not affect keyboard navigation,
    // and is unnoticable to the user.

    // However, VoiceOver (iOS assistive tech) will move the navigation back to the textbox when the textbox is focused,
    // which means the user will need to strt navigating the options from the top of the listbox every time they select
    // an option. (If we throw the focus). For this reason, we have decided that we will not support keyboard navigation
    // (which would need to happen on a connected external keybord) on mobile devices, as keyboard nav requires that the
    // focus stays on the textbox. Ostensibly it is standard practice to not support keyboard navigation on mobile devices.

    if (!this.isMobile()) {
      if (event.relatedTarget && this.isHtmlElement(event.relatedTarget)) {
        // when the blur happens because a listbox option was focused
        if (
          event.relatedTarget.id.includes('listbox') ||
          event.relatedTarget.classList.contains('listbox-group') ||
          event.relatedTarget.classList.contains('listbox-group-label')
        ) {
          this.service.emitTextboxFocus();
          return;
        }
      }
      this.service.emitTextboxBlur();
    }
  }

  isHtmlElement(target: EventTarget): target is HTMLElement {
    return 'id' in target;
  }

  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }

  handleClick(): void {
    this.service.setIsKeyboardEvent(false);
    if (!this.expanded) {
      this.service.setTouched();
    }

    // In Angular Aria mode, ngCombobox manages expanded state from click.
    // Manually toggling here causes open->close flicker and leaves the popup closed.
    if (this.useAngularAria) {
      this.focusBox();
      return;
    }

    this.expanded = !this.expanded;
    this.focusBox();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onEscape();
    } else {
      this.service.setTouched();
      const action = this.getActionFromKeydownEvent(event);
      if (action) {
        this.service.setIsKeyboardEvent(true);
      }
      this.handleKeyboardAction(action, event);
    }
  }

  handleHostKeydown(event: KeyboardEvent): void {
    if (event.target !== this.box?.nativeElement) {
      this.handleKeydown(event);
    }
  }

  onEscape(): void {
    this.expanded = false;
    this.service.emitTextboxFocus();
  }

  private isOpenKey(key: string): boolean {
    return (
      this.openKeys.includes(key) ||
      key === 'Down' ||
      key === 'Up' ||
      key === 'Spacebar' ||
      key.toLowerCase() === 'enter'
    );
  }

  getActionFromKeydownEvent(event: KeyboardEvent): ComboboxAction {
    if (!this.expanded && this.isOpenKey(event.key)) {
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
    if (this.expanded) {
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
    } else if ((key === Key.ArrowDown || key === 'Down') && !altKey) {
      return OptionAction.next;
    } else if (key === Key.ArrowUp || key === 'Up') {
      return OptionAction.previous;
    } else if (key === Key.PageUp) {
      return OptionAction.pageUp;
    } else if (key === Key.PageDown) {
      return OptionAction.pageDown;
    } else if (key === Key.Enter || key === Key.Space || key === 'Spacebar') {
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
        this.expanded = true;
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
        this.expanded = false;
        this.focusBox();
        break;

      case ListboxAction.close:
        event.preventDefault();
        this.expanded = false;
        this.focusBox();
        break;

      case TextboxAction.type:
        this.expanded = true;
        this.focusBox();
        this.service.emitOptionAction(event.key);
        break;

      case ListboxAction.open:
        event.preventDefault();
        this.expanded = true;
        this.service.emitOptionAction(OptionAction.next);
        this.focusBox();
    }
  }

  setLabel(): void {
    if (this.dynamicLabel) {
      combineLatest([
        this.service.touched$,
        this.service.allOptions$, // when options (not properties) change
        this.service.selectedOptionsToEmit$, // when a user clicks
        this.service.optionPropertyChanges$.pipe(
          filter((x) => !!x),
          startWith(null)
        ), // on an outside change,
      ])
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          delay(0) // delay to ensure ViewChild refs in options are populated, especially for grouped options
        )
        .subscribe(([touched, options]) => {
          const label = this.getComputedLabel(touched, options);
          this.label.next(label);
          this.cdr.detectChanges();

          // For grouped options with preselected values, ViewChild refs may not be ready yet
          // Schedule a retry if label is empty but there are selected options
          if (!label && this.service.getSelectedOptions(options)?.length > 0) {
            setTimeout(() => {
              const retryLabel = this.getComputedLabel(touched, options);
              if (retryLabel) {
                this.label.next(retryLabel);
                this.cdr.detectChanges();
              }
            }, 50);
          }
        });
    }
  }

  getComputedLabel(
    touched: boolean,
    options: ListboxOptionComponent[]
  ): string {
    const selectedOptions = this.service.getSelectedOptions(options);
    let label = '';
    const numSelected = selectedOptions?.length;
    if (touched || numSelected || this.customLabel || this.selectedCountLabel) {
      if (this.customLabel && !this.service.hasEditableTextbox) {
        label = this.customLabel(selectedOptions);
      } else if (this.selectedCountLabel && !this.service.hasEditableTextbox) {
        if (numSelected === 1) {
          label = `${numSelected} ${this.selectedCountLabel.singular} selected`;
        } else {
          label = `${numSelected} ${this.selectedCountLabel.plural} selected`;
        }
      } else {
        label = this.getDefaultLabel(selectedOptions);
      }
    }
    return label;
  }

  getDefaultLabel(selectedOptions: ListboxOptionComponent[]): string {
    let label = '';
    if (selectedOptions) {
      label = selectedOptions
        .reduce((acc, option) => {
          const value =
            option.boxDisplayLabel ??
            option.label?.nativeElement?.innerText?.trim();
          if (value) {
            acc.push(value);
          }
          return acc;
        }, [])
        .join(', ');
    }
    return label;
  }
}

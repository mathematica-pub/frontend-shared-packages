import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComboboxService } from '../combobox.service';

export interface ListboxOptionPropertyChange<T> {
  property: 'selected' | 'disabled';
  value: boolean;
  comboboxId: string;
  optionId: number;
  optionValue: T | string;
}

let nextUniqueId = 0;

@Component({
  selector: 'hsi-ui-listbox-option',
  templateUrl: './listbox-option.component.html',
  styleUrls: ['./listbox-option.component.scss'],
})
export class ListboxOptionComponent<T> implements OnChanges {
  @ViewChild('label')
  label: ElementRef<HTMLDivElement>;
  @ViewChild('option') optionContent: TemplateRef<unknown>;
  @Input() boxDisplayLabel: string;
  @Input() value: T;
  /** Whether the option is selected.
   * If this property is changed during this component's lifecycle, no new value will be emitted from the listbox.
   * Box label and select all button will respond to changes.
   * @default false
   */
  @Input() selected = false;
  /** Whether the option is selected.
   * If this property is changed during this component's lifecycle, no new value will be emitted from the listbox.
   * Box label and select all button will respond to changes.
   * @default false
   */
  @Input() disabled = false;
  @Input() ariaLabel: string;
  id = nextUniqueId++;
  // Only used for to update styles on change in listbox.component.html
  protected _selected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selected$ = this._selected.asObservable();
  private _disabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
  disabled$ = this._disabled.asObservable();
  private changes: BehaviorSubject<ListboxOptionPropertyChange<T>> =
    new BehaviorSubject(undefined);
  changes$ = this.changes.asObservable();

  constructor(protected service: ComboboxService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.updateDisabled(this.disabled);
      this.changes.next(this.getPropertyChange('disabled'));
    }
    if (changes['selected']) {
      this.updateSelected(this.selected);
      this.changes.next(this.getPropertyChange('selected'));
    }
  }

  getPropertyChange(
    property: 'selected' | 'disabled'
  ): ListboxOptionPropertyChange<T> {
    return {
      property,
      value: this[property],
      comboboxId: this.service.id,
      optionId: this.id,
      optionValue: this.value || this.label?.nativeElement?.innerText,
    };
  }

  protected updateSelected(selected: boolean): void {
    this._selected.next(selected);
  }

  private updateDisabled(disabled: boolean): void {
    this._disabled.next(disabled);
  }

  select(): void {
    if (!this._disabled.value) {
      this.updateSelected(true);
    }
  }

  deselect(): void {
    if (!this._disabled.value) {
      this.updateSelected(false);
    }
  }

  toggleSelected(): void {
    this.updateSelected(!this._selected.value);
  }

  isSelected(): boolean {
    return this._selected.value;
  }

  isDisabled(): boolean {
    return this._disabled.value;
  }
}

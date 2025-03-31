import { CommonModule } from '@angular/common';
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

export interface ListboxOptionPropertyChange {
  property: 'selected' | 'disabled';
  value: boolean;
  comboboxId: string;
  id: number;
  optionValue: string | number | boolean;
}

let nextUniqueId = 0;

@Component({
  selector: 'hsi-ui-listbox-option',
  imports: [CommonModule],
  templateUrl: './listbox-option.component.html',
  styleUrls: ['./listbox-option.component.scss'],
})
export class ListboxOptionComponent implements OnChanges {
  @ViewChild('label') label: ElementRef<HTMLDivElement>;
  @ViewChild('option') template: TemplateRef<unknown>;
  @Input() boxDisplayLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
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
  private externalPropertyChanges: BehaviorSubject<ListboxOptionPropertyChange> =
    new BehaviorSubject(null);
  externalPropertyChanges$ = this.externalPropertyChanges.asObservable();

  constructor(protected service: ComboboxService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get valueToEmit(): any | string {
    return this.value || this.label?.nativeElement?.innerText.trim();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.updateDisabled(this.disabled);

      if (!this.isFirstChangeAndValueIsFalse(changes, 'disabled')) {
        this.externalPropertyChanges.next(this.getPropertyChange('disabled'));
      }
    }

    if (changes['selected']) {
      if (changes['selected'].isFirstChange()) {
        this.updateSelected(this.selected);
        if (this.selected) {
          this.externalPropertyChanges.next(this.getPropertyChange('selected'));
        }
      } else if (!this.disabled && this.selected !== this._selected.value) {
        this.updateSelected(this.selected);
        this.externalPropertyChanges.next(this.getPropertyChange('selected'));
      }
    }
  }

  isFirstChangeAndValueIsFalse(
    change: SimpleChanges,
    property: 'selected' | 'disabled'
  ): boolean {
    return change[property].isFirstChange() && !this[property];
  }

  getPropertyChange(
    property: 'selected' | 'disabled'
  ): ListboxOptionPropertyChange {
    return {
      property,
      value: this[property],
      comboboxId: this.service.id,
      id: this.id,
      optionValue: this.valueToEmit,
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

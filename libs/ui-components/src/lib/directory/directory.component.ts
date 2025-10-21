import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgOnChangesUtilities } from '@mathstack/app-kit';
import { BehaviorSubject } from 'rxjs';

export interface HsiUiDirectoryItem {
  name: string;
  value?: string;
  children?: HsiUiDirectoryItem[];
}

export interface HsiUiDirectorySelection {
  activePath: string;
  selectedItem: string;
}

@Component({
  selector: 'hsi-ui-directory',
  imports: [CommonModule, MatIconModule],
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HsiUiDirectoryComponent implements OnChanges {
  @Input() items: HsiUiDirectoryItem[];
  @Input() level: number = 0;
  @Input() path: string = '';
  @Input() terminalItemsAreSelectable: boolean = true;
  @Input() selectionElementRole: string = 'button';
  /**
   * Sets the activePath and selectedItem.
   */
  @Input() selection: HsiUiDirectorySelection;
  /**
   * Emits the activePath and selectedItem when a leaf item is selected.
   *
   * Constructed from the `value` of each item if provided, otherwise uses `name`.
   */
  @Output() selectionChanges = new EventEmitter<HsiUiDirectorySelection>();
  /**
   * @internal
   *
   * Internal, will have no effect if provided at root level.
   */
  @Output() stateChanges = new EventEmitter<HsiUiDirectorySelection>();
  state: BehaviorSubject<HsiUiDirectorySelection> =
    new BehaviorSubject<HsiUiDirectorySelection>({
      activePath: '',
      selectedItem: '',
    });
  state$ = this.state.asObservable();
  open = {};

  ngOnChanges(changes: SimpleChanges) {
    if (NgOnChangesUtilities.inputObjectChanged(changes, 'selection')) {
      this.state.next(this.selection);
    }
  }

  toggleOpen(key: string): void {
    if (this.open[key] === undefined) {
      this.open[key] = true;
    } else {
      this.open[key] = !this.open[key];
    }
  }

  // public events are emitted on leaf selection
  selectItem(item: HsiUiDirectoryItem): void {
    const itemValue = item.value || item.name;
    const activePath = this.path ? `${this.path}/${itemValue}` : itemValue;
    if (this.level === 0) {
      this.selectionChanges.emit({
        activePath: activePath,
        selectedItem: itemValue,
      });
    } else {
      this.stateChanges.emit({ activePath, selectedItem: itemValue });
    }
  }

  // called when child emits new _activePath value
  setState(state: HsiUiDirectorySelection): void {
    if (this.level === 0) {
      this.state.next(state);
      this.selectionChanges.emit({
        activePath: state.activePath,
        selectedItem: state.selectedItem,
      });
    } else {
      this.stateChanges.emit(state);
    }
  }
}

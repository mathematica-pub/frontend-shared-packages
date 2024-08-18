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
import { NgOnChangesUtilities } from 'projects/viz-components/src/lib/core/utilities/ng-on-changes';
import { BehaviorSubject } from 'rxjs';

export interface DirectoryItem {
  name: string;
  value?: string;
  children?: DirectoryItem[];
}

export interface DirectorySelection {
  activePath: string;
  selectedItem: string;
}

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryComponent implements OnChanges {
  @Input() items: DirectoryItem[];
  @Input() level: number = 0;
  @Input() path: string = '';
  @Input() terminalItemsAreSelectable: boolean = true;
  @Input() selectionElementRole: string = 'button';
  /**
   * Sets the activePath and selectedItem.
   */
  @Input() selection: DirectorySelection;
  /**
   * Emits the activePath and selectedItem when a leaf item is selected.
   *
   * Constructed from the `value` of each item if provided, otherwise uses `name`.
   */
  @Output() selectionChanges = new EventEmitter<DirectorySelection>();
  /**
   * Internal, will have no effect if provided at root level.
   */
  @Output() stateChanges = new EventEmitter<DirectorySelection>();
  state: BehaviorSubject<DirectorySelection> =
    new BehaviorSubject<DirectorySelection>({
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
  selectItem(item: DirectoryItem): void {
    const itemValue = item.value || item.name;
    const activePath = `${this.path}/${itemValue}`;
    if (this.level === 0) {
      this.selectionChanges.emit({
        activePath: activePath.substring(1),
        selectedItem: itemValue,
      });
    } else {
      this.stateChanges.emit({ activePath, selectedItem: itemValue });
    }
  }

  // called when child emits new _activePath value
  setState(state: DirectorySelection): void {
    if (this.level === 0) {
      this.state.next(state);
      this.selectionChanges.emit({
        activePath: state.activePath.substring(1),
        selectedItem: state.selectedItem,
      });
    } else {
      this.stateChanges.emit(state);
    }
  }
}

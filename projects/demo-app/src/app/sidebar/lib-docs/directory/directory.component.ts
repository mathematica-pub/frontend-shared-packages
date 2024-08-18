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
import { BehaviorSubject } from 'rxjs';
import { DirectoryService } from './directory.service';

export interface NewDirectoryItem {
  name: string;
  value?: string;
  children?: NewDirectoryItem[];
}

export const NESTED_DATA: NewDirectoryItem[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule],
  providers: [DirectoryService],
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryComponent implements OnChanges {
  @Input() items: NewDirectoryItem[] = NESTED_DATA;
  @Input() level: number = 0;
  @Input() path: string = '';
  @Input() terminalItemsAreSelectable: boolean = true;
  /**
   * Emits the value, if provided of the selected item. If there is no value it emits the `name`.
   */
  @Output() itemSelected = new EventEmitter<string>();
  /**
   * Emits the path of the selected item. Constructed from the `value` of each item if provided, otherwise uses `name`.
   */
  @Output() activePath = new EventEmitter<string>();
  /**
   * Internal
   */
  @Input() activeItemPath: string;
  /**
   * Internal
   */
  @Output() _activePath = new EventEmitter<string>();
  open = {};
  _activeItemPath: BehaviorSubject<string> = new BehaviorSubject<string>('');
  _activeItemPath$ = this._activeItemPath.asObservable();

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['activeItemPath'] &&
      changes['activeItemPath'].currentValue &&
      this.level > 0
    ) {
      this._activeItemPath.next(changes['activeItemPath'].currentValue);
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
  selectItem(item: NewDirectoryItem): void {
    const itemValue = item.value || item.name;
    const activePath = `${this.path}/${itemValue}`;
    this._activeItemPath.next(activePath);
    this.activePath.emit(activePath);
    this.itemSelected.emit(itemValue);
    if (this.level !== 0) {
      this._activePath.emit(activePath);
    }
  }

  // called when child emits new _activePath value
  setActivePath(activePath: string): void {
    if (this.level === 0) {
      this._activeItemPath.next(activePath);
    } else {
      this._activePath.emit(activePath);
    }
  }
}

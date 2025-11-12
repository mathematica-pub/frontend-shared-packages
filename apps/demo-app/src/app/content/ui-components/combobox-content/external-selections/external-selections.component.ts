import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HsiUiComboboxModule } from '@mathstack/ui';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-external-selections-combobox',
  imports: [CommonModule, HsiUiComboboxModule, MatIconModule],
  templateUrl: './external-selections.component.html',
  styleUrl: './external-selections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalSelectionsComponent {
  disabled: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  selected: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['ME']);
  selected$ = this.selected.asObservable();
  options: { displayName: string; id: string }[] = [
    { displayName: 'Connecticut', id: 'CT' },
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Vermont', id: 'VT' },
  ];

  onSelection(selected: string[]): void {
    this.selected.next(selected);
  }

  toggleSelected(option: { displayName: string; id: string }): void {
    const currentSelected = this.selected.value;
    if (this.disabled.value.includes(option.id)) return;
    const index = currentSelected.indexOf(option.id);
    if (index === -1) {
      this.selected.next([...currentSelected, option.id]);
    } else {
      currentSelected.splice(index, 1);
      this.selected.next([...currentSelected]);
    }
  }

  toggleDisabled(option: { displayName: string; id: string }): boolean {
    const currentDisabled = this.disabled.value;
    const index = currentDisabled.indexOf(option.id);
    if (index === -1) {
      this.disabled.next([...currentDisabled, option.id]);
      return true;
    } else {
      currentDisabled.splice(index, 1);
      this.disabled.next([...currentDisabled]);
      return false;
    }
  }
}

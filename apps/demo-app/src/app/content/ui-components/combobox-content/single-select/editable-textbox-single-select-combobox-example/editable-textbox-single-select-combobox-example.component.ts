import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-editable-textbox-single-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl:
    './editable-textbox-single-select-combobox-example.component.html',
  styleUrl: './editable-textbox-single-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditableTextboxSingleSelectComboboxExampleComponent
  implements OnInit
{
  options = [
    { displayName: 'Ratatouille', id: 'rat' },
    { displayName: 'Finding Nemo', id: 'nemo' },
    { displayName: 'Toy Story', id: 'toy' },
    { displayName: 'Monsters Inc.', id: 'monstersInc' },
    { displayName: 'WALL-E', id: 'robot' },
    { displayName: 'Cars', id: 'cars' },
    { displayName: 'The Incredibles', id: 'incredibles' },
    { displayName: 'Inside Out', id: 'insideOut' },
    { displayName: 'Up', id: 'up' },
  ];
  options$: Observable<{ displayName: string; id: string }[]>;
  selected = new BehaviorSubject('');
  selected$ = this.selected.asObservable();
  text = new BehaviorSubject('');
  text$ = this.text.asObservable();

  ngOnInit(): void {
    this.options$ = combineLatest([of(this.options), this.text$]).pipe(
      map(([options, text]) => {
        return options.filter((option) =>
          option.displayName.toLowerCase().includes(text.toLowerCase())
        );
      })
    );
  }

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds[0]);
  }

  onTyping(text: string): void {
    this.text.next(text);
  }
}

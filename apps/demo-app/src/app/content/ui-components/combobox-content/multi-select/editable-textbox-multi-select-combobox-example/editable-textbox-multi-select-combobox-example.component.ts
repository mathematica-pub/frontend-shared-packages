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
  selector: 'app-editable-textbox-multi-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl:
    './editable-textbox-multi-select-combobox-example.component.html',
  styleUrl: './editable-textbox-multi-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditableTextboxMultiSelectComboboxExampleComponent
  implements OnInit
{
  options = [
    { displayName: 'Cambridge', id: 'cambridge' },
    { displayName: 'Washington, D.C.', id: 'dc' },
    { displayName: 'Oakland', id: 'oakland' },
    { displayName: 'Chicago', id: 'chicago' },
    { displayName: 'Ann Arbor', id: 'annArbor' },
    { displayName: 'Woodlawn', id: 'woodlawn' },
    { displayName: 'Princeton', id: 'princeton' },
  ];
  options$: Observable<{ displayName: string; id: string }[]>;
  selected = new BehaviorSubject([]);
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
    this.selected.next(selectedIds);
  }

  onTyping(text: string): void {
    this.text.next(text);
  }
}

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
    { displayName: 'Cambridge', id: 'cambridge', disabled: true },
    { displayName: 'Washington, D.C.', id: 'dc', disabled: true },
    { displayName: 'Oakland', id: 'oakland', disabled: false },
    { displayName: 'Chicago', id: 'chicago', disabled: false },
    { displayName: 'Ann Arbor', id: 'annArbor', disabled: true },
    { displayName: 'Woodlawn', id: 'woodlawn', disabled: false },
    { displayName: 'Princeton', id: 'princeton', disabled: true },
  ];
  options$: Observable<
    { displayName: string; id: string; disabled: boolean }[]
  >;
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

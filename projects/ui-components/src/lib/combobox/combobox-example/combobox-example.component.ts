/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'hsi-ui-combobox-example',
  templateUrl: './combobox-example.component.html',
  styleUrls: ['./combobox-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComboboxExampleComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = new BehaviorSubject<any>('start value');
  value$ = this.value.asObservable();

  onSelection(event: any): void {
    this.value.next(event);
  }

  selected = new BehaviorSubject<boolean>(false);
  selected$ = this.selected.asObservable();

  setSelected() {
    this.selected.next(true);
  }
}

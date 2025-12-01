/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject } from 'rxjs';

export const scss = `
.combobox-textbox {
  background: white;
  border: 1px solid blue;
  padding: 12px;
}

.textbox-label {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 500px; // required for ellipsis to work; maybe take this off later
}

.textbox-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.textbox-icon .material-symbols-outlined {
  transform: scale(1.5);
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

.textbox-icon.open {
  transform: rotate(180deg);
}

.combobox-listbox.open {
  background: white;
  border-right: 1px solid orange;
  border-bottom: 1px solid orange;
  border-left: 1px solid orange;
  border-radius: 2px;
}

.listbox-label {
  padding: 8px 12px 4px 12px;
}

.listbox-option .option-label {
  padding: 12px;
}

.listbox-option:hover {
  background: blanchedalmond;
}

.listbox-option.current {
  outline: 2px solid red;
  outline-offset: -2px;
}

.listbox-option.current:not(.selected) {
  background: yellow;
}

.listbox-option.selected {
  background: cyan;
}

.combobox-value {
  padding-top: 16px;
}
`;

export class ComboboxBaseTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(event: any): void {
    this.value.next(event);
  }
}

import { AutocompleteType } from '../combobox.service';

export class ComboboxServiceStub {
  autocomplete: AutocompleteType;
  setVisualFocus = jasmine.createSpy('setVisualFocus');
  setLabel = jasmine.createSpy('setLabel');
  setComboboxElRef = jasmine.createSpy('setComboboxElRef');
  setScrollWhenOpened = jasmine.createSpy('setScrollWhenOpened');
}

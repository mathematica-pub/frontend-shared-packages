import { AutoComplete } from '../../combobox.service';

export class ComboboxServiceStub {
  autoComplete: AutoComplete;
  setVisualFocus = jasmine.createSpy('setVisualFocus');
  setLabel = jasmine.createSpy('setLabel');
  setScrollWhenOpened = jasmine.createSpy('setScrollWhenOpened');
}

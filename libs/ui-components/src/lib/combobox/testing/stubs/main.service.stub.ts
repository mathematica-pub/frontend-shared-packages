import { ComboboxServiceStub } from '../combobox.service.stub';
import { ListboxFilteringServiceStub } from './listbox-filtering.service.stub';
import { ListboxScrollServiceStub } from './listbox-scroll.service.stub';

export class ComboboxMainServiceStub {
  listboxScrollServiceStub = new ListboxScrollServiceStub();
  listboxFilteringServiceStub = new ListboxFilteringServiceStub();
  comboboxServiceStub = new ComboboxServiceStub();
}

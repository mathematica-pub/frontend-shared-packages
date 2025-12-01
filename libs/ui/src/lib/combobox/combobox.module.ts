import { NgModule } from '@angular/core';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ComboboxComponent } from './combobox.component';
import { EditableTextboxComponent } from './editable-textbox/editable-textbox.component';
import { ListboxGroupComponent } from './listbox-group/listbox-group.component';
import { ListboxLabelComponent } from './listbox-label/listbox-label.component';
import { ListboxOptionComponent } from './listbox-option/listbox-option.component';
import { ListboxComponent } from './listbox/listbox.component';
import { SelectAllListboxOptionComponent } from './select-all-listbox-option/select-all-listbox-option.component';
import { TextboxComponent } from './textbox/textbox.component';

@NgModule({
  imports: [
    ComboboxComponent,
    ComboboxLabelComponent,
    TextboxComponent,
    ListboxComponent,
    ListboxGroupComponent,
    ListboxOptionComponent,
    ListboxLabelComponent,
    EditableTextboxComponent,
    SelectAllListboxOptionComponent,
  ],
  exports: [
    ComboboxComponent,
    ComboboxLabelComponent,
    TextboxComponent,
    ListboxComponent,
    ListboxGroupComponent,
    ListboxLabelComponent,
    ListboxOptionComponent,
    EditableTextboxComponent,
    SelectAllListboxOptionComponent,
  ],
})
export class HsiUiComboboxModule {}

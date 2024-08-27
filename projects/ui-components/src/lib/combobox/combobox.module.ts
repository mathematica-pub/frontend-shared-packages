import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ComboboxComponent } from './combobox.component';
import { ListboxGroupComponent } from './listbox-group/listbox-group.component';
import { ListboxLabelComponent } from './listbox-label/listbox-label.component';
import { ListboxOptionComponent } from './listbox-option/listbox-option.component';
import { ListboxComponent } from './listbox/listbox.component';
import { MultiFiltersListboxComponent } from './multi-scroll-group-listbox/multi-scroll-group-listbox.component';
import { NgFormEditableTextboxComponent } from './ng-form-editable-textbox/ng-form-editable-textbox.component';
import { NgFormListboxMultiComponent } from './ng-form-listbox-multi/ng-form-listbox-multi.component';
import { NgFormListboxSingleComponent } from './ng-form-listbox-single/ng-form-listbox-single.component';
import { SelectAllListboxOptionComponent } from './select-all-listbox-option/select-all-listbox-option.component';
import { TextboxComponent } from './textbox/textbox.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComboboxComponent,
    ComboboxLabelComponent,
    TextboxComponent,
    ListboxComponent,
    ListboxGroupComponent,
    ListboxLabelComponent,
    ListboxOptionComponent,
    NgFormListboxSingleComponent,
    NgFormListboxMultiComponent,
    NgFormEditableTextboxComponent,
    MultiFiltersListboxComponent,
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
    NgFormListboxSingleComponent,
    NgFormListboxMultiComponent,
    NgFormEditableTextboxComponent,
    MultiFiltersListboxComponent,
    SelectAllListboxOptionComponent,
  ],
})
export class ComboboxModule {}

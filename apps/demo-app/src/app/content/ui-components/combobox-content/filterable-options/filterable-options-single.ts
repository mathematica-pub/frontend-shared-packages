import { Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterableOptions } from './filterable-options';

export interface FilterableOptionsViewModel {
  options: { displayName: string; id: string }[];
  selected: string;
}

@Directive()
export abstract class FilterableOptionsSingle extends FilterableOptions {
  vm$: Observable<FilterableOptionsViewModel>;
  initialValue: { displayName: string; id: string };

  getViewModel(
    listboxValue: string,
    inputValue: string,
    isInit: boolean
  ): FilterableOptionsViewModel {
    const selected = this.options.find((x) => x.id === listboxValue);
    const filteredOptions = this.options.filter((option) => {
      if (isInit) return true;
      // if an option is selected, show only that option, covers cases where there may be multiple options that match the textbox value
      // e.g. selected option is Kevin Ng and there is another option, Kevin Nguyen
      if (selected && inputValue === selected.displayName) {
        return option.id === listboxValue;
      }
      return this.optionIncludesSearchText(option, inputValue);
    });
    return {
      options: filteredOptions,
      selected: listboxValue,
    };
  }
}

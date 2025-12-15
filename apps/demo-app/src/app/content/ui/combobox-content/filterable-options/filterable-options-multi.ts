import { Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterableOptions } from './filterable-options';

@Directive()
export abstract class FilterableOptionsMulti extends FilterableOptions {
  filteredOptions$: Observable<{ displayName: string; id: string }[]>;
  selected$: Observable<string[]>;
  initialValue: { displayName: string; id: string }[];

  getOptions(inputValue: string): { displayName: string; id: string }[] {
    return this.options.filter((option) => {
      if (inputValue === '') {
        return true;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  getSelected(
    prevSelected: string[],
    listboxValue: string[],
    filteredOptions: { displayName: string; id: string }[],
    prevSelectedIsInitValue: boolean
  ): string[] {
    if (prevSelectedIsInitValue) {
      return prevSelected;
    }
    const prevSelectedNotInOptions = prevSelected.filter(
      (x) => !filteredOptions.some((o) => o.id === x)
    );
    if (prevSelectedNotInOptions.length) {
      return [...listboxValue, ...prevSelectedNotInOptions];
    }
    return listboxValue;
  }
}

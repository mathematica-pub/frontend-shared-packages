import { Injectable } from '@angular/core';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';

@Injectable()
export class ListboxFilteringService {
  searchTimeout: ReturnType<typeof setTimeout>;
  searchString: string;

  updateSearchString(char: string): void {
    if (typeof this.searchTimeout === 'number') {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.searchString = '';
    }, 500);

    this.searchString += char;
  }

  resetSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchString = '';
  }

  getIndexByLetter(
    options: ListboxOptionComponent[],
    searchString: string,
    startIndex: number
  ): number {
    const orderedOptions = [
      ...options.slice(startIndex),
      ...options.slice(0, startIndex),
    ];
    const firstMatch = this.filterOptionsBySearchString(
      orderedOptions,
      searchString
    )[0];
    const allSameLetter = (array: string[]) =>
      array.every((letter) => letter === array[0]);

    if (firstMatch) {
      return options.indexOf(firstMatch);
    } else if (allSameLetter(searchString.split(''))) {
      const matches = this.filterOptionsBySearchString(
        orderedOptions,
        searchString[0]
      );
      return options.indexOf(matches[0]);
    } else {
      return -1;
    }
  }

  filterOptionsBySearchString(
    options: ListboxOptionComponent[] = [],
    searchString: string,
    exclude: ListboxOptionComponent[] = []
  ): ListboxOptionComponent[] {
    return options.filter((option) => {
      const matches =
        option.label?.nativeElement.innerText
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) === 0;
      return (
        matches &&
        exclude
          .map((x) => x.label?.nativeElement.innerText)
          .indexOf(option.label?.nativeElement.innerText) < 0
      );
    });
  }
}

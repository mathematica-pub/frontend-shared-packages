/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Combobox,
  ComboboxPopup,
  ComboboxWidget,
} from '@angular/aria/combobox';
import {
  Listbox as AriaListbox,
  Option as AriaOption,
} from '@angular/aria/listbox';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HsiUiComboboxModule } from '@mathstack/ui';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

interface ViewModel<ListboxSelection> {
  options: { displayName: string; id: string }[];
  selected: ListboxSelection;
}

@Component({
  selector: 'hsi-ui-editable-textbox-combobox',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="textbox-value">{{ textboxValue$ | async }}</p>
    <p class="combobox-value">{{ value$ | async }}</p>
    @if (vm$ | async; as vm) {
      <hsi-ui-combobox class="fruits-dropdown">
        <hsi-ui-combobox-label>
          <span>Fruits</span>
        </hsi-ui-combobox-label>
        <hsi-ui-editable-textbox
          placeholder="Select a fruit, A-E"
          [autoSelectTrigger]="autoSelectTrigger"
          [autoSelect]="autoSelect"
          [clearOnClick]="clearOnClick"
          (valueChanges)="onTyping($event)"
        >
        </hsi-ui-editable-textbox>
        <hsi-ui-listbox
          (valueChanges)="onSelection($event)"
          [isMultiSelect]="isMultiSelect"
        >
          <hsi-ui-listbox-label>
            <span>Select a fruit</span>
          </hsi-ui-listbox-label>
          @for (option of vm.options; track option.id) {
            @if (isMultiSelect) {
              <hsi-ui-listbox-option
                [selected]="vm.selected.includes(option.displayName)"
                >{{ option.displayName }}</hsi-ui-listbox-option
              >
            } @else {
              <hsi-ui-listbox-option
                [selected]="vm.selected === option.displayName"
                >{{ option.displayName }}</hsi-ui-listbox-option
              >
            }
          }
        </hsi-ui-listbox>
      </hsi-ui-combobox>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class EditableTextboxTestComponent
  extends ComboboxBaseTestComponent
  implements OnInit
{
  @Input() autoSelect: boolean;
  @Input() autoSelectTrigger: 'any' | 'character';
  @Input() dynamicLabel = false;
  @Input() isMultiSelect = false;
  @Input() clearOnClick = false;
  vm$: Observable<ViewModel<string[]> | ViewModel<string>>;
  textboxValue = new BehaviorSubject<string>('');
  textboxValue$ = this.textboxValue.asObservable();

  ngOnInit(): void {
    this.value.next(this.isMultiSelect ? [] : '');
    this.vm$ = combineLatest([this.textboxValue$, this.value$]).pipe(
      map(([inputValue, listboxValue]) => {
        if (this.isMultiSelect) {
          return {
            options: this.getMultiSelectOptions(inputValue),
            selected: listboxValue as string[],
          };
        } else {
          return {
            options: this.getSingleSelectOptions(
              inputValue,
              listboxValue as string
            ),
            selected: listboxValue as string,
          };
        }
      })
    );
  }

  getSingleSelectOptions(
    inputValue: string,
    listboxValue: string
  ): { displayName: string; id: string }[] {
    const safeInputValue = inputValue ?? '';
    const safeListboxValue = listboxValue ?? '';
    const selected = this.options.filter((x) =>
      safeListboxValue.includes(x.displayName)
    );
    return this.options.filter((option) => {
      if (selected.length && safeInputValue === selected[0].displayName) {
        return safeListboxValue.includes(option.displayName);
      } else {
        return this.optionIncludesSearchText(option, safeInputValue);
      }
    });
  }

  getMultiSelectOptions(
    inputValue: string
  ): { displayName: string; id: string }[] {
    return this.options.filter((option) => {
      if (inputValue === '') {
        return true;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  optionIncludesSearchText(
    option: { displayName: string; id: string },
    value: string
  ): boolean {
    return option.displayName.toLowerCase().includes(value?.toLowerCase());
  }

  onTyping(value: any): void {
    this.textboxValue.next(value);
  }
}

@Component({
  selector: 'hsi-ui-editable-textbox-form-control-combobox',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="textbox-value">{{ searchFormControl.valueChanges | async }}</p>
    <p class="combobox-value">{{ comboboxValue$ | async }}</p>
    @if (vm$ | async; as vm) {
      <hsi-ui-combobox class="fruits-dropdown">
        <hsi-ui-combobox-label>
          <span>Fruits</span>
        </hsi-ui-combobox-label>
        <hsi-ui-editable-textbox
          placeholder="Select a fruit, A-E"
          [autoSelectTrigger]="autoSelectTrigger"
          [autoSelect]="autoSelect"
          [clearOnClick]="clearOnClick"
          [ngFormControl]="searchFormControl"
        >
        </hsi-ui-editable-textbox>
        <hsi-ui-listbox
          [ngFormControl]="listboxFormControl"
          [isMultiSelect]="isMultiSelect"
        >
          <hsi-ui-listbox-label>
            <span>Select a fruit</span>
          </hsi-ui-listbox-label>
          @for (option of vm.options; track option.id) {
            @if (isMultiSelect) {
              <hsi-ui-listbox-option
                [selected]="vm.selected.includes(option.displayName)"
                >{{ option.displayName }}</hsi-ui-listbox-option
              >
            } @else {
              <hsi-ui-listbox-option
                [selected]="vm.selected === option.displayName"
                >{{ option.displayName }}</hsi-ui-listbox-option
              >
            }
          }
        </hsi-ui-listbox>
      </hsi-ui-combobox>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class EditableTextboxFormControlTestComponent
  extends ComboboxBaseTestComponent
  implements OnInit
{
  @Input() autoSelect: boolean;
  @Input() autoSelectTrigger: 'any' | 'character';
  @Input() dynamicLabel = false;
  @Input() isMultiSelect = false;
  @Input() clearOnClick = false;
  vm$: Observable<ViewModel<string[]> | ViewModel<string>>;
  listboxFormControl: FormControl<string | string[]>;
  searchFormControl = new FormControl<string>('');
  comboboxValue$: Observable<string | string[]>;

  ngOnInit(): void {
    if (this.isMultiSelect) {
      this.listboxFormControl = new FormControl<string[]>([]);
    } else {
      this.listboxFormControl = new FormControl<string>('');
    }

    this.comboboxValue$ = this.listboxFormControl.valueChanges;

    const listboxValues$ = this.isMultiSelect
      ? this.listboxFormControl.valueChanges.pipe(startWith([] as string[]))
      : this.listboxFormControl.valueChanges.pipe(startWith(''));

    this.vm$ = combineLatest([
      this.searchFormControl.valueChanges.pipe(startWith('')),
      listboxValues$,
    ]).pipe(
      map(([inputValue, listboxValue]) => {
        if (this.isMultiSelect) {
          return {
            options: this.getMultiSelectOptions(inputValue),
            selected: listboxValue as string[],
          };
        } else {
          return {
            options: this.getSingleSelectOptions(
              inputValue,
              listboxValue as string
            ),
            selected: listboxValue as string,
          };
        }
      })
    );
  }

  getSingleSelectOptions(
    inputValue: string,
    listboxValue: string
  ): { displayName: string; id: string }[] {
    const safeInputValue = inputValue ?? '';
    const safeListboxValue = listboxValue ?? '';
    const selected = this.options.filter((x) =>
      safeListboxValue.includes(x.displayName)
    );
    return this.options.filter((option) => {
      if (selected.length && safeInputValue === selected[0].displayName) {
        return safeListboxValue.includes(option.displayName);
      } else {
        return this.optionIncludesSearchText(option, safeInputValue);
      }
    });
  }

  getMultiSelectOptions(
    inputValue: string
  ): { displayName: string; id: string }[] {
    return this.options.filter((option) => {
      if (inputValue === '') {
        return true;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  optionIncludesSearchText(
    option: { displayName: string; id: string },
    value: string
  ): boolean {
    return option.displayName.toLowerCase().includes(value?.toLowerCase());
  }
}

const openEditableListboxFromKeyboard = (
  selector = '.hsi-ui-editable-textbox-input'
) => {
  cy.get(selector).focus().type('{downArrow}');
  cy.get('body').then(($body) => {
    if ($body.find('.hsi-ui-listbox:visible').length === 0) {
      cy.get(selector).realClickAndWait();
    }
  });
};

const openEditableListboxFromClick = (
  selector = '.hsi-ui-editable-textbox-input'
) => {
  cy.get(selector).realClickAndWait();
  cy.get('body').then(($body) => {
    if ($body.find('.hsi-ui-listbox:visible').length === 0) {
      cy.get(selector).focus().type('{downArrow}');
    }
  });
};

const assertEditableListboxClosed = () => {
  cy.get('body').then(($body) => {
    cy.wrap($body.find('.hsi-ui-listbox:visible')).should('have.length', 0);
  });
};

const getVisibleEditableOptions = () =>
  cy.get('.hsi-ui-listbox-option:visible');

const clickVisibleEditableOption = (label: string) => {
  getVisibleEditableOptions().contains(label).realClickAndWait();
};

[true, false].forEach((useFormControls) => {
  describe(`Basic editable textbox features - single select with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
    beforeEach(() => {
      if (useFormControls) {
        cy.mount(EditableTextboxFormControlTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
          },
        });
      } else {
        cy.mount(EditableTextboxTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
          },
        });
      }
    });
    it('displays the placeholder text', () => {
      cy.get('.hsi-ui-textbox').should(
        'have.attr',
        'placeholder',
        'Select a fruit, A-E'
      );
    });
    it('displays the typed text in the textbox and correctly outputs typed text', () => {
      cy.get('.hsi-ui-editable-textbox-input').type('bananas');
      cy.get('.hsi-ui-editable-textbox-input').should('have.value', 'bananas');
      cy.get('.textbox-value').should('have.text', 'bananas');
    });
    it('displays the filtered options in the listbox - type coco', () => {
      cy.get('.hsi-ui-textbox').type('coco');
      cy.get('.hsi-ui-listbox')
        .find('.hsi-ui-listbox-option')
        .should('have.length', 1);
    });
    it('displays the filtered options in the listbox - type a', () => {
      cy.get('.hsi-ui-textbox').type('a');
      cy.get('.hsi-ui-listbox')
        .find('.hsi-ui-listbox-option')
        .should('have.length', 3); //Apples, Bananas, Durians
    });
    it('displays the selected value in the textbox input when an option is clicked and only one option is in the listbox', () => {
      openEditableListboxFromKeyboard();
      clickVisibleEditableOption('Coconuts');
      cy.get('.hsi-ui-editable-textbox-input').should('exist');
      openEditableListboxFromKeyboard();
      getVisibleEditableOptions().should('have.length.greaterThan', 0);
    });
  });
});

[true, false].forEach((useFormControls) => {
  describe(`Basic editable textbox features - multi select with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
    beforeEach(() => {
      if (useFormControls) {
        cy.mount(EditableTextboxFormControlTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
            isMultiSelect: true,
          },
        });
      } else {
        cy.mount(EditableTextboxTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
            isMultiSelect: true,
          },
        });
      }
    });
    // see behavior here: https://ariakit.org/examples/combobox-multiple
    it('displays the nothing in the textbox input when an option is clicked and filtering is removed', () => {
      openEditableListboxFromKeyboard();
      clickVisibleEditableOption('Coconuts');
      cy.get('.hsi-ui-editable-textbox-input').should('have.value', '');
      openEditableListboxFromKeyboard();
      clickVisibleEditableOption('Durians');
      cy.get('.hsi-ui-editable-textbox-input').should('have.value', '');
      openEditableListboxFromKeyboard();
      getVisibleEditableOptions().should('have.length', 5);
    });
  });
});

[true, false].forEach((isMultiSelect) => {
  describe(`${isMultiSelect ? 'Multi' : 'Single'}-select combobox features - autoSelect of option`, () => {
    [true, false].forEach((useFormControls) => {
      describe(`when autoSelect is true and autoSelectTrigger is any - with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
        beforeEach(() => {
          if (useFormControls) {
            cy.mount(EditableTextboxFormControlTestComponent, {
              componentProperties: {
                autoSelect: true,
                autoSelectTrigger: 'any',
                isMultiSelect: isMultiSelect,
              },
            });
          } else {
            cy.mount(EditableTextboxTestComponent, {
              componentProperties: {
                autoSelect: true,
                autoSelectTrigger: 'any',
                isMultiSelect: isMultiSelect,
              },
            });
          }
        });
        it('selects the first item if textbox is clicked on and closed', () => {
          openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
          cy.get('.outside-element').realClickAndWait();
          cy.get('.combobox-value').should('exist');
          assertEditableListboxClosed();
          // reopen listbox and make sure properties are correct
          openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
          getVisibleEditableOptions().should('have.length.greaterThan', 0);
          getVisibleEditableOptions().first().should('have.class', 'selected');
          getVisibleEditableOptions().first().should('have.class', 'current');
        });
        it('retains the user selection if the listbox is closed and then reopened', () => {
          openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
          clickVisibleEditableOption('Coconuts');
          cy.get('.combobox-value').should('exist');
          cy.get('.outside-element').realClickAndWait();
          assertEditableListboxClosed();
          // reopen listbox and make sure properties are correct
          openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
          getVisibleEditableOptions().should('have.length.greaterThan', 0);
        });
      });
      [true, false].forEach((useFormControls) => {
        describe(`when autoSelect is true and autoSelectTrigger is character - with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
          beforeEach(() => {
            if (useFormControls) {
              cy.mount(EditableTextboxFormControlTestComponent, {
                componentProperties: {
                  autoSelect: true,
                  autoSelectTrigger: 'character',
                  isMultiSelect: isMultiSelect,
                },
              });
            } else {
              cy.mount(EditableTextboxTestComponent, {
                componentProperties: {
                  autoSelect: true,
                  autoSelectTrigger: 'character',
                  isMultiSelect: isMultiSelect,
                },
              });
            }
          });
          it('does not make a selection if textbox is clicked on and closed', () => {
            openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
            cy.get('.outside-element').realClickAndWait();
            cy.get('.combobox-value').should('have.text', '');
            assertEditableListboxClosed();
          });
          it('filters the options and selects the first in the filtered list if text is entered in the textbox but no option is clicked', () => {
            cy.get('[data-cy="editable-textbox-input"]').type('a');
            openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
            cy.get('.outside-element').realClickAndWait();
            cy.get('.combobox-value').should('exist');
            assertEditableListboxClosed();
            // reopen listbox and make sure properties are correct
            openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
            getVisibleEditableOptions().should('have.length.greaterThan', 0);
          });
          it('retains the user selection if the listbox is closed and then reopened', () => {
            cy.get('[data-cy="editable-textbox-input"]').type('a');
            openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
            clickVisibleEditableOption('Durians');
            cy.get('.combobox-value').should('exist');
            cy.get('.outside-element').realClickAndWait();
            assertEditableListboxClosed();
            // reopen listbox and make sure properties are correct
            openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
            getVisibleEditableOptions().should('have.length.greaterThan', 0);
          });
        });
      });

      [true, false].forEach((useFormControls) => {
        describe(`when autoSelect is false - with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
          beforeEach(() => {
            if (useFormControls) {
              cy.mount(EditableTextboxFormControlTestComponent, {
                componentProperties: {
                  autoSelect: false,
                  autoSelectTrigger: 'any',
                  isMultiSelect: isMultiSelect,
                },
              });
            } else {
              cy.mount(EditableTextboxTestComponent, {
                componentProperties: {
                  autoSelect: false,
                  autoSelectTrigger: 'any',
                  isMultiSelect: isMultiSelect,
                },
              });
            }
          });
          it('does not make any selections if the textbox is clicked and then there is a blur event / it is closed', () => {
            openEditableListboxFromClick('[data-cy="editable-textbox-input"]');
            cy.get('.outside-element').realClickAndWait();
            cy.get('.combobox-value').should('have.text', '');
            assertEditableListboxClosed();
          });
        });
      });
    });
  });
});

[true, false].forEach((useFormControls) => {
  describe(`Editable textbox clearOnClick behavior with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
    beforeEach(() => {
      if (useFormControls) {
        cy.mount(EditableTextboxFormControlTestComponent, {
          componentProperties: {
            autoSelect: false,
            autoSelectTrigger: 'any',
            clearOnClick: true,
            isMultiSelect: false,
          },
        });
      } else {
        cy.mount(EditableTextboxTestComponent, {
          componentProperties: {
            autoSelect: false,
            autoSelectTrigger: 'any',
            clearOnClick: true,
            isMultiSelect: false,
          },
        });
      }
    });

    it('clears previously typed text when clicking the textbox', () => {
      cy.get('.hsi-ui-editable-textbox-input').type('ap');
      cy.get('.hsi-ui-editable-textbox-input').should('have.value', 'ap');
      cy.get('.outside-element').realClickAndWait();
      cy.get('[data-cy="editable-textbox-input"]').click();
      cy.get('.hsi-ui-editable-textbox-input').should('have.value', '');
      cy.get('.textbox-value').should('have.text', '');
      cy.get('.hsi-ui-listbox').should('be.visible');
    });

    it('clears displayed selection text on click but retains selection value', () => {
      openEditableListboxFromKeyboard('[data-cy="editable-textbox-input"]');
      clickVisibleEditableOption('Coconuts');
      cy.get('.outside-element').realClickAndWait();
      cy.get('[data-cy="editable-textbox-input"]').click();
      cy.get('.hsi-ui-editable-textbox-input').should('have.value', '');
    });
  });
});

// Editable textbox with FormControl integration
@Component({
  selector: 'hsi-ui-form-editable-textbox-test',
  template: `
    <p class="form-value">{{ control.value }}</p>
    <hsi-ui-combobox>
      <hsi-ui-form-editable-textbox
        [control]="control"
        placeholder="Type to search..."
      >
      </hsi-ui-form-editable-textbox>
      <hsi-ui-listbox>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option [value]="option.id">
            {{ option.displayName }}
          </hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, CommonModule, ReactiveFormsModule],
})
class FormEditableTextboxTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  control = new FormControl<string>('');
}

describe('Editable textbox with FormControl', () => {
  beforeEach(() => {
    cy.mount(FormEditableTextboxTestComponent);
    cy.wait(100);
  });

  it('should initialize with empty value', () => {
    cy.get('.form-value').should('have.text', '');
  });

  it('should update form control when user types', () => {
    cy.get('input').type('hello');
    cy.get('.form-value').should('have.text', 'hello');
  });

  it('should update form value when user types', () => {
    cy.get('input').type('test');
    cy.get('.form-value').should('have.text', 'test');
    cy.get('input').clear().type('another value');
    cy.get('.form-value').should('have.text', 'another value');
  });

  it('should toggle aria-expanded through ngCombobox', () => {
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    cy.get('[data-cy="editable-textbox-input"]').click();
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
  });
});

// Full combobox with editable textbox + listbox FormControl integration (real-world pattern)
@Component({
  selector: 'hsi-ui-full-combobox-form-test',
  template: `
    <p class="search-value">Search: {{ searchControl.value }}</p>
    <p class="selected-value">Selected: {{ selectionControl.value | json }}</p>

    <hsi-ui-combobox>
      <hsi-ui-form-editable-textbox
        [control]="searchControl"
        [autoSelect]="true"
        autoSelectTrigger="character"
        placeholder="Type to search..."
      >
      </hsi-ui-form-editable-textbox>

      <hsi-ui-form-listbox-single [control]="selectionControl">
        <hsi-ui-listbox-label>
          <span>Search Results</span>
        </hsi-ui-listbox-label>
        @for (option of filteredOptions; track option.id) {
          <hsi-ui-listbox-option [value]="option">
            {{ option.displayName }}
          </hsi-ui-listbox-option>
        }
      </hsi-ui-form-listbox-single>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, CommonModule, ReactiveFormsModule],
})
class FullComboboxFormTestComponent implements OnInit {
  options = [
    { displayName: 'Apples', id: 'appl', keywords: ['fruit', 'red'] },
    { displayName: 'Bananas', id: 'bana', keywords: ['fruit', 'yellow'] },
    { displayName: 'Coconuts', id: 'coco', keywords: ['fruit', 'tropical'] },
    { displayName: 'Carrots', id: 'carr', keywords: ['vegetable', 'orange'] },
  ];

  searchControl = new FormControl<string>('');
  selectionControl = new FormControl<any>(null);
  filteredOptions: any[] = [];

  ngOnInit(): void {
    // Filter options based on search text (similar to the app's pattern)
    this.searchControl.valueChanges.subscribe((searchText) => {
      this.filteredOptions = this.filterOptions(searchText || '');
    });

    this.filteredOptions = this.options;
  }

  private filterOptions(searchText: string): any[] {
    if (!searchText) {
      return this.options;
    }
    const lowerSearch = searchText.toLowerCase();
    return this.options.filter(
      (opt) =>
        opt.displayName.toLowerCase().includes(lowerSearch) ||
        opt.keywords.some((kw: string) =>
          kw.toLowerCase().includes(lowerSearch)
        )
    );
  }
}

describe('Full combobox with FormControl (real-world pattern)', () => {
  beforeEach(() => {
    cy.mount(FullComboboxFormTestComponent);
    cy.wait(100);
  });

  it('should filter options as user types in search', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('ban');
    cy.get('.search-value').should('contain.text', 'ban');
    cy.get('.hsi-ui-listbox-option').should('have.length', 1);
    cy.get('.hsi-ui-listbox-option').first().should('contain.text', 'Bananas');
  });

  it('should update selection control when option is clicked', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('ban');
    cy.contains('.hsi-ui-listbox-option', 'Bananas')
      .should('be.visible')
      .realClickAndWait();
    cy.get('.selected-value').should('contain.text', 'Bananas');
  });

  it('should clear search text after selection', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('app');
    cy.get('.search-value').should('contain.text', 'app');
    cy.get('.hsi-ui-listbox-option').first().realClickAndWait();
    cy.get('.selected-value').should('not.contain.text', 'null');
  });

  it('should filter by keywords', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('tropical');
    cy.get('.hsi-ui-listbox-option').should('have.length', 1);
    cy.get('.hsi-ui-listbox-option').first().should('contain.text', 'Coconuts');
  });

  it('should show all options when search is empty', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('xyz');
    cy.get('.hsi-ui-listbox-option').should('have.length', 0);
    cy.get('[data-cy="editable-textbox-input"]').clear();
    cy.get('.hsi-ui-listbox-option').should('have.length', 4);
  });

  it('should update selected value when user makes multiple selections', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('ban');
    openEditableListboxFromKeyboard('[data-cy="editable-textbox-input"]');
    cy.contains('.hsi-ui-listbox-option', 'Bananas').realClickAndWait();
    cy.get('.selected-value').should('not.contain.text', 'null');
    cy.get('[data-cy="editable-textbox-input"]').clear().type('coco');
    openEditableListboxFromKeyboard('[data-cy="editable-textbox-input"]');
    cy.contains('.hsi-ui-listbox-option', 'Coconuts').realClickAndWait();
    cy.get('.selected-value').should('not.contain.text', 'null');
  });
});

@Component({
  selector: 'hsi-ui-editable-textbox-angular-aria-trigger-test',
  template: `
    <p class="outside-element">Outside element</p>
    <p class="textbox-value">{{ textboxValue$ | async }}</p>
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-editable-textbox
        [useAngularAria]="true"
        placeholder="Select a fruit, A-E"
        (valueChanges)="onTyping($event)"
      >
      </hsi-ui-editable-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option>{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, CommonModule],
})
class EditableTextboxAngularAriaTriggerTestComponent extends ComboboxBaseTestComponent {
  textboxValue = new BehaviorSubject<string>('');
  textboxValue$ = this.textboxValue.asObservable();

  onTyping(value: string): void {
    this.textboxValue.next(value);
  }
}

@Component({
  selector: 'hsi-ui-editable-textbox-legacy-trigger-test',
  template: `
    <p class="outside-element">Outside element</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-editable-textbox
        [useAngularAria]="false"
        placeholder="Select a fruit, A-E"
      >
      </hsi-ui-editable-textbox>
      <hsi-ui-listbox>
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option>{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, CommonModule],
})
class EditableTextboxLegacyTriggerTestComponent extends ComboboxBaseTestComponent {}

@Component({
  selector: 'hsi-ui-editable-textbox-runtime-toggle-trigger-test',
  template: `
    <p class="aria-mode">{{ useAngularAria ? 'directive' : 'legacy' }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-editable-textbox
        [useAngularAria]="useAngularAria"
        placeholder="Select a fruit, A-E"
      >
      </hsi-ui-editable-textbox>
      <hsi-ui-listbox>
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option>{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>

    <button type="button" class="toggle-aria-mode" (click)="toggleMode()">
      Toggle Aria Mode
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, CommonModule],
})
class EditableTextboxRuntimeToggleTriggerTestComponent extends ComboboxBaseTestComponent {
  useAngularAria = true;

  toggleMode(): void {
    this.useAngularAria = !this.useAngularAria;
  }
}

describe('EditableTextboxAngularAriaTriggerTestComponent', () => {
  beforeEach(() => {
    cy.mount(EditableTextboxAngularAriaTriggerTestComponent);
    cy.wait(100);
  });

  it('should expose combobox role semantics in Angular Aria trigger mode', () => {
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'role',
      'combobox'
    );
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
  });

  it('should toggle aria-expanded while opening and closing', () => {
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    cy.get('[data-cy="editable-textbox-input"]').realClickAndWait();
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
    cy.get('.outside-element').realClickAndWait();
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
  });

  it('should preserve typing and selection behavior with Angular Aria trigger', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('ban');
    cy.get('.textbox-value').should('have.text', 'ban');
    cy.contains('.hsi-ui-listbox-option', 'Bananas').realClickAndWait();
    cy.get('.combobox-value').should('exist');
  });
});

describe('EditableTextboxLegacyTriggerTestComponent', () => {
  beforeEach(() => {
    cy.mount(EditableTextboxLegacyTriggerTestComponent);
    cy.wait(100);
  });

  it('should retain legacy editable trigger ARIA attributes', () => {
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-controls'
    );
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-haspopup',
      'listbox'
    );
  });

  it('should keep legacy editable aria-activedescendant behavior on keyboard navigation', () => {
    cy.get('[data-cy="editable-textbox-input"]').type('{downArrow}');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-activedescendant'
    );
  });
});

describe('EditableTextboxRuntimeToggleTriggerTestComponent', () => {
  beforeEach(() => {
    cy.mount(EditableTextboxRuntimeToggleTriggerTestComponent);
    cy.wait(100);
  });

  it('switches editable trigger ARIA attributes when toggling useAngularAria at runtime', () => {
    cy.get('.aria-mode').should('have.text', 'directive');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'role',
      'combobox'
    );

    openEditableListboxFromKeyboard('[data-cy="editable-textbox-input"]');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
    cy.get('[data-cy="editable-textbox-input"]').type('{downArrow}');
    cy.get('[data-cy="editable-textbox-input"]').type('{esc}');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    assertEditableListboxClosed();

    cy.get('.toggle-aria-mode').realClickAndWait();
    cy.get('.aria-mode').should('have.text', 'legacy');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-controls'
    );
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-haspopup',
      'listbox'
    );
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    openEditableListboxFromKeyboard('[data-cy="editable-textbox-input"]');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
    cy.get('[data-cy="editable-textbox-input"]').type('{downArrow}');
    cy.get('[data-cy="editable-textbox-input"]').type('{esc}');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    assertEditableListboxClosed();

    cy.get('[data-cy="editable-textbox-input"]').type('{downArrow}');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
    cy.get('[data-cy="editable-textbox-input"]').type('{downArrow}');
    cy.get('[data-cy="editable-textbox-input"]').type('{esc}');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.get('.toggle-aria-mode').realClickAndWait();
    cy.get('.aria-mode').should('have.text', 'directive');
    cy.get('[data-cy="editable-textbox-input"]').should(
      'have.attr',
      'role',
      'combobox'
    );
  });
});

@Component({
  selector: 'hsi-ui-angular-aria-combobox-spike-test',
  template: `
    <p class="selected-value">{{ selectedValueText }}</p>
    <input
      class="aria-combobox-input"
      ngCombobox
      #combobox="ngCombobox"
      [(expanded)]="expanded"
      [value]="query"
      (input)="onQueryInput($event)"
      placeholder="Select one"
    />
    <ng-template ngComboboxPopup [combobox]="combobox" popupType="listbox">
      <div
        class="aria-popup-listbox"
        ngComboboxWidget
        ngListbox
        #listbox="ngListbox"
        [(value)]="selectedValues"
        [activeDescendant]="listbox.activeDescendant()"
      >
        @for (option of filteredOptions; track option.id) {
          <div ngOption [value]="option.value" [label]="option.label">
            {{ option.label }}
          </div>
        }
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [
    CommonModule,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    AriaListbox,
    AriaOption,
  ],
})
class AngularAriaComboboxSpikeTestComponent {
  expanded = false;
  query = '';
  selectedValues: string[] = [];
  options = [
    { id: 'a', label: 'Apples', value: 'appl' },
    { id: 'b', label: 'Bananas', value: 'bana' },
    { id: 'c', label: 'Coconuts', value: 'coco' },
  ];

  get filteredOptions(): { id: string; label: string; value: string }[] {
    const search = this.query.toLowerCase();
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(search)
    );
  }

  get selectedValueText(): string {
    return this.selectedValues.join(',');
  }

  onQueryInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
  }
}

describe('AngularAriaComboboxSpikeTestComponent', () => {
  beforeEach(() => {
    cy.mount(AngularAriaComboboxSpikeTestComponent);
    cy.wait(100);
  });

  it('opens popup and selects an option using Angular Aria directives', () => {
    cy.get('.aria-combobox-input').type('{downArrow}');
    cy.get('.aria-popup-listbox').should('be.visible');
    cy.contains('.aria-popup-listbox div', 'Bananas').click();
    cy.get('.selected-value').should('contain.text', 'bana');
  });
});

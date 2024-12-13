/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// SPECIFICATIONS
// - If the user clicks on the select all button and it is not selected, all options are selected. If an option is disabled, its status does not change.
// - If a user clicks on the select all button and it is selected, all options are deselected. If an option is disabled, its status does not change.
// - If a user changes the selected status of an option through clicking, the select all button updates accordingly.
// - If the @Input selected property on an option changes, and the select all button was selected beforehand (i.e. option was deselected), the select all button should no longer be selected
// - If the @Input selected property on an option changes, and after the selection all options are selected (option was selected), the select all button should be selected
// - If the @Input selected property of the select all button changes and the the select all button was previously selected, all options should be unselected. In an option is disabled, its status does not change.
// - The combobox should only emit a value when the user manually selects an option.
// - No selection, deselection, or value emission should occur on disabling or enabling an option. (This is a property of ListboxOption in general, not specific to select-all, but just to clarify)

@Component({
  selector: 'hsi-ui-combobox-select-all-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox
        [displaySelected]="displaySelected"
        [countSelectedLabel]="countSelectedLabel"
      >
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-select-all-listbox-option
          >Select all</hsi-ui-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option>{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSelectAllMultiSelectTestComponent extends ComboboxBaseTestComponent {
  @Input() displaySelected = false;
  @Input() countSelectedLabel = { singular: 'fruit', plural: 'fruits' };
}

describe('ComboboxSelectAllMultiComponent', () => {
  describe('toggling the select all / options with a click', () => {
    beforeEach(() => {
      cy.mount(ComboboxSelectAllMultiSelectTestComponent, {
        declarations: [ComboboxSelectAllMultiSelectTestComponent],
        imports: [ComboboxModule, MatIconModule],
        componentProperties: { displaySelected: true },
      });
    });
    it('correctly selects and deselects options when toggled', () => {
      cy.get('.combobox-textbox').click();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).should('not.have.class', 'selected');
      });
      // toggle on select all button, expect all options to be selected
      cy.get('.listbox-option').eq(0).realClick();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).should('have.class', 'selected');
      });
      // toggle off select all button, expect all options to not be selected
      cy.get('.listbox-option').eq(0).realClick();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).should('not.have.class', 'selected');
      });
    });

    it('reponds to user selection and deselection of other options', () => {
      cy.get('.combobox-textbox').click();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).realClick();
      });
      cy.get('.listbox-option').eq(0).should('have.class', 'selected');
      cy.get('.listbox-option').eq(2).realClick();
      cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');
    });
  });
});

@Component({
  selector: 'hsi-ui-combobox-external-selected',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    @for (index of [0, 1, 2, 3, 4]; track index) {
      <button (click)="addToSelected(index)" class="select-option-button"
        >Select option with {{ index }} index</button
      >
      <button (click)="removeFromSelected(index)" class="deselect-option-button"
        >Deselect option with {{ index }} index</button
      >
    }
    <button (click)="clearValue()" class="clear-value-button"
      >Clear value</button
    >
    <p class="emitted-combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="displaySelected">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-select-all-listbox-option
          >Select all</hsi-ui-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="(selected$ | async).includes(option.displayName)"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxExternalSelectedTestComponent {
  @Input() displaySelected = false;
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  selected = new BehaviorSubject<string[]>([]);
  selected$ = this.selected.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(values: string[]): void {
    this.value.next(values);
    this.selected.next(values);
  }

  addToSelected(i: number) {
    const currSelected = this.selected.value.filter(
      (v) => v !== this.options[i].displayName
    );
    this.selected.next([...currSelected, this.options[i].displayName]);
  }

  removeFromSelected(i: number) {
    const currSelected = this.selected.value.filter(
      (v) => v !== this.options[i].displayName
    );
    this.selected.next(currSelected);
  }

  clearValue() {
    this.value.next([]);
  }
}

describe('ComboboxExternalSelectedTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalSelectedTestComponent, {
      declarations: [ComboboxExternalSelectedTestComponent],
      imports: [ComboboxModule, MatIconModule],
      componentProperties: { displaySelected: true },
    });
  });

  it('the select all option should respond to the selected property of an option being changed from outside - deselection', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.deselect-option-button').eq(0).realClick();
    cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');
  });

  it('the select all option should respond to the selected property of an option being changed from outside - selection', () => {
    cy.get('.combobox-textbox').click();
    [1, 2, 3, 4].forEach((i) => {
      cy.get('.listbox-option').eq(i).realClick();
    });
    cy.get('.select-option-button').eq(4).realClick();
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');
  });

  it('the combobox should not emit a new value when an option is selected from outside and should emit a new value on user selection', () => {
    cy.get('.combobox-textbox').click();
    [1, 2, 3, 4].forEach((i) => {
      cy.get('.listbox-option').eq(i).realClick();
    });
    cy.get('.clear-value-button').realClick();
    cy.get('.emitted-combobox-value').should('have.text', '');
    cy.get('.select-option-button').eq(4).realClick();
    cy.get('.emitted-combobox-value').should('have.text', '');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Durians,Elderberries'
    );
  });

  // Cypress is not able to execute the click on the clear all button in any test that follows the one above
  // The test below is what we should use here, but even if I duplicate the test above in this block, it will pass in the first instance and fail in the second
  // it('the combobox should not emit a new value when an option is deselected from outside and should emit a new value on user selection', () => {
  //   cy.get('.combobox-textbox').click();
  //   cy.get('.listbox-option').eq(0).realClick();
  //   cy.wait(500);
  //   cy.get('.clear-value-button').realClick();
  //   cy.get('.emitted-combobox-value').should('have.text', '');
  //   cy.get('.deselect-option-button').eq(0).realClick();
  //   cy.get('.emitted-combobox-value').should('have.text', '');
  //   cy.get('.combobox-textbox').click();
  //   cy.get('.listbox-option').eq(2).realClick();
  //   cy.get('.emitted-combobox-value').should(
  //     'have.text',
  //     'Coconuts,Durians,Elderberries'
  //   );
  // });
});

@Component({
  selector: 'hsi-ui-combobox-external-disable',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <button (click)="addAppleToDisabled()" class="disable-apple-button"
      >Disable apple</button
    >
    <button (click)="removeAppleFromSelected()" class="enable-apple-button"
      >Enable apple</button
    >
    <p class="emitted-combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="displaySelected">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-select-all-listbox-option
          >Select all</hsi-ui-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [disabled]="(disabled$ | async).includes(option.displayName)"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxExternalDisableTestComponent {
  @Input() displaySelected = false;
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  disabled = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(values: string[]): void {
    this.value.next(values);
  }

  addAppleToDisabled() {
    const currentDisabled = this.disabled.value.filter((x) => x !== 'Apples');
    this.disabled.next([...currentDisabled, 'Apples']);
  }

  removeAppleFromDisabled() {
    const currentDisabled = this.disabled.value;
    this.disabled.next(currentDisabled.filter((d) => d !== 'Apples'));
  }
}

describe('ComboboxExternalDisableTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalDisableTestComponent, {
      declarations: [ComboboxExternalDisableTestComponent],
      imports: [ComboboxModule, MatIconModule],
      componentProperties: { displaySelected: true },
    });
  });

  it('the select all option should not change with a change to the disabled property of options from the outside', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.disable-apple-button').realClick();
    cy.get('.listbox-option').eq(1).should('have.class', 'disabled');
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');

    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'disabled');
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
  });
});

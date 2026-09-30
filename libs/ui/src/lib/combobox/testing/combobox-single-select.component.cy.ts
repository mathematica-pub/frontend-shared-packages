/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HsiUiComboboxModule } from '@mathstack/ui';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

function openListboxFromKeyboard(): void {
  cy.get('[data-cy="combobox-textbox"]')
    .focus()
    .trigger('keydown', { key: 'ArrowDown' });
  cy.get('.hsi-ui-listbox').should('be.visible');
  cy.get('.hsi-ui-listbox-option:visible', { timeout: 10000 }).should(
    'have.length.greaterThan',
    0
  );
}

function openListboxFromClick(): void {
  cy.get('[data-cy="combobox-textbox"]').as('textbox').should('be.visible');
  cy.get('body').then(($body) => {
    if ($body.find('.hsi-ui-listbox:visible').length === 0) {
      cy.get('@textbox').realClickAndWait();
    }
  });
  cy.get('body').then(($body) => {
    if ($body.find('.hsi-ui-listbox:visible').length === 0) {
      cy.get('@textbox').focus().trigger('keydown', { key: 'ArrowDown' });
    }
  });
  cy.get('.hsi-ui-listbox', { timeout: 10000 }).should('be.visible');
  cy.get('.hsi-ui-listbox-option:visible', { timeout: 10000 }).should(
    'have.length.greaterThan',
    0
  );
}

function getVisibleOptions() {
  return cy.get('.hsi-ui-listbox:visible').find('.hsi-ui-listbox-option');
}

// Simple single select combobox that displays selected
@Component({
  selector: 'hsi-ui-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Select a fruit, A-E</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox">
        <span boxLabel>Select a fruit</span>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
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
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectOnlyComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleTestComponent);
    cy.wait(100);
  });
  describe('click behavior after load', () => {
    it('should not emit a value on load', () => {
      cy.get('.combobox-value').should('have.text', '');
    });
    it('listbox should not be visible on load', () => {
      cy.get('.hsi-ui-listbox').should('not.exist');
    });
    it('should open the combobox on click', () => {
      cy.get('[data-cy="combobox-textbox"]').click();
      cy.get('.hsi-ui-listbox').should('be.visible');
    });
    it('should emit the correct value on option click', () => {
      openListboxFromKeyboard();
      getVisibleOptions().first().click();
      cy.get('.combobox-value').should('have.text', 'Apples');
    });
    it('should display value on textbox', () => {
      openListboxFromKeyboard();
      getVisibleOptions().first().click();
      cy.get('.hsi-ui-textbox-label').should('include.text', 'Apples');
      openListboxFromKeyboard();
      getVisibleOptions().eq(1).click();
      cy.get('.hsi-ui-textbox-label').should('include.text', 'Bananas');
      cy.get('.hsi-ui-textbox-label').should('not.include.text', 'Apples');
    });
    it('listbox should close on option click', () => {
      openListboxFromClick();
      getVisibleOptions().first().click();
      cy.get('.hsi-ui-listbox').should('not.exist');
    });
    it('selected option should be highlighted on listbox reopen', () => {
      openListboxFromKeyboard();
      getVisibleOptions().first().click();
      cy.get('.hsi-ui-textbox-label').should('include.text', 'Apples');
      openListboxFromKeyboard();
      getVisibleOptions().first().should('have.attr', 'aria-selected', 'true');
    });
    it('clicking outside the combobox should close the listbox', () => {
      cy.get('[data-cy="combobox-textbox"]').realClickAndWait();
      cy.get('.hsi-ui-listbox').should('be.visible');
      cy.get('.outside-element').realClickAndWait();
      cy.get('.hsi-ui-listbox').should('not.exist');
    });
  });

  it('keeps selected option highlighted when reopening', () => {
    openListboxFromClick();
    getVisibleOptions().eq(2).click();
    openListboxFromClick();
    getVisibleOptions().eq(2).should('have.class', 'selected');
    getVisibleOptions().eq(3).click();
    openListboxFromClick();
    getVisibleOptions().eq(3).should('have.class', 'selected');
  });
});
// Single select combobox with some disabled options
@Component({
  selector: 'hsi-ui-combobox-single-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox>
        <span boxLabel>Select a fruit</span>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option [disabled]="option.displayName.length > 7">{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxSingleSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleSelectDisabledOptionsComponent);
  });
  it('can select non-disabled options', () => {
    openListboxFromKeyboard();
    getVisibleOptions().first().click();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
  it('cannot select disabled options', () => {
    openListboxFromClick();
    getVisibleOptions().eq(4).click();
    cy.get('.combobox-value').should('not.have.text', 'Elderberries');
  });
});

// Single select combobox with a pre-set selected option
@Component({
  selector: 'hsi-ui-combobox-select-from-outside-single-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox>
        <span boxLabel>Select a fruit</span>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="option.displayName === 'Coconuts'"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxSelectFromOutsideSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectFromOutsideSingleComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectFromOutsideSingleTestComponent);
  });
  it('should display the selected option in the textbox on load', () => {
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
    openListboxFromKeyboard();
    getVisibleOptions().eq(2).should('have.class', 'selected');
  });
  it('can switch the selected option on click', () => {
    openListboxFromKeyboard();
    getVisibleOptions().first().click();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

// Single select combobox with groups
@Component({
  selector: 'hsi-ui-combobox-grouped-single-test',
  template: `
    <hsi-ui-combobox class="pixar-movies-dropdown">
      <hsi-ui-combobox-label>
        <span>Star Wars Movies Combobox</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox">
        <p boxLabel
          >This combobox stores your favorite of the first 6 Star Wars
          movies!</p
        >
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span class="group-label">Original Trilogy</span>
          </hsi-ui-listbox-label>
          @for (option of optionsGroup1; track option.id) {
            <hsi-ui-listbox-option [value]="option.id">{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span class="group-label">Prequel Trilogy</span>
          </hsi-ui-listbox-label>
          @for (option of optionsGroup2; track option.id) {
            <hsi-ui-listbox-option [value]="option.id">{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">Selected id value: {{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedSingleTestComponent {
  optionsGroup1 = [
    { displayName: 'A New Hope', id: 'newHope' },
    { displayName: 'The Empire Strikes Back', id: 'empire' },
    { displayName: 'Return of the Jedi', id: 'returnJedi' },
  ];
  optionsGroup2 = [
    { displayName: 'The Phantom Menace', id: 'phantom' },
    { displayName: 'Attack of the Clones', id: 'clones' },
    { displayName: 'Revenge of the Sith', id: 'sith' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(selectedId: string): void {
    this.value.next(selectedId);
  }
}

describe('ComboboxGroupedSingleTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedSingleTestComponent);
    cy.wait(100);
  });
  it('can select values from different groups', () => {
    openListboxFromKeyboard();
    getVisibleOptions().first().click();
    cy.get('.hsi-ui-textbox-label').should('include.text', 'A New Hope');
    openListboxFromKeyboard();
    getVisibleOptions().eq(4).click();
    cy.get('.hsi-ui-textbox-label').should(
      'include.text',
      'Attack of the Clones'
    );
    cy.get('.hsi-ui-textbox-label').should('not.include.text', 'A New Hope');
  });
});

@Component({
  selector: 'hsi-ui-ng-form-listbox-single-test',
  template: `
    <p class="display-control-value">{{ control.valueChanges | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Select a fruit</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox [ngFormControl]="control">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="control.value === option.id"
            [value]="option.id"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class NgFormListboxSingleTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  control: FormControl<any> = new FormControl(null);
}

describe('NgFormListboxSingleTestComponent', () => {
  beforeEach(() => {
    cy.mount(NgFormListboxSingleTestComponent);
    cy.wait(100);
  });
  it('can make one selection', () => {
    openListboxFromClick();
    getVisibleOptions().should('have.length.greaterThan', 1);
    getVisibleOptions().eq(1).click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas');
    openListboxFromClick();
    getVisibleOptions().eq(1).should('have.class', 'selected');
  });
  it('can change selection', () => {
    openListboxFromClick();
    getVisibleOptions().should('have.length.greaterThan', 1);
    getVisibleOptions().eq(1).click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas');
    openListboxFromClick();
    getVisibleOptions().first().click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
    openListboxFromClick();
    getVisibleOptions().first().should('have.class', 'selected');
    getVisibleOptions().eq(1).should('not.have.class', 'selected');
  });
  it('selecting option should close the listbox', () => {
    openListboxFromClick();
    getVisibleOptions().first().click();
    cy.get('.hsi-ui-listbox').should('not.exist');
  });
  it('control value should match selected combobox value', () => {
    openListboxFromClick();
    getVisibleOptions().eq(1).click();
    cy.get('.display-control-value').should('have.text', 'bana');
  });
});

// Single-select with FormControl integration
@Component({
  selector: 'hsi-ui-form-listbox-single-test',
  template: `
    <p class="outside-element">Click outside element</p>
    <p class="form-value">{{ control.value }}</p>
    <p class="form-touched">{{ control.touched }}</p>
    <p class="form-dirty">{{ control.dirty }}</p>

    <hsi-ui-combobox>
      <hsi-ui-textbox>
        <span boxLabel>Select a fruit</span>
      </hsi-ui-textbox>
      <hsi-ui-form-listbox-single [control]="control">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option [value]="option.id">
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
class FormListboxSingleTestComponent extends ComboboxBaseTestComponent {
  control = new FormControl<string | null>(null);
}

describe('Single-select with FormControl', () => {
  beforeEach(() => {
    cy.mount(FormListboxSingleTestComponent);
    cy.wait(100);
  });

  it('should initialize with null value', () => {
    cy.get('.form-value').should('have.text', '');
  });

  it('should update form control when option is clicked', () => {
    openListboxFromClick();
    getVisibleOptions().first().click();
    cy.get('.form-value').should('have.text', 'appl');
  });

  it('should mark form as touched after user interaction', () => {
    cy.get('.form-touched').should('have.text', 'false');
    openListboxFromClick();
    getVisibleOptions().first().click();
    cy.get('.form-touched').should('have.text', 'true');
  });

  it('should handle multiple selections and form updates', () => {
    openListboxFromKeyboard();
    getVisibleOptions().eq(1).click();
    cy.get('.form-value').should('have.text', 'bana');
    openListboxFromKeyboard();
    getVisibleOptions().eq(2).click();
    cy.get('.form-value').should('have.text', 'coco');
  });
});

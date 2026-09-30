import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HsiUiComboboxModule } from '@mathstack/ui';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

function triggerTextboxKey(key: string): void {
  cy.get('.hsi-ui-textbox-container').trigger('keydown', { key });
}

@Component({
  selector: 'hsi-ui-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox" [useListboxLabelAsBoxPlaceholder]="true">
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
class ComboboxSingleKeyboardTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation with a generic listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleKeyboardTestComponent);
    cy.get('.hsi-ui-textbox-container').focus();
  });
  describe('correctly opens the combobox with the open keys ', () => {
    it('opens the listbox on down arrow and first option is current', () => {
      cy.get('.hsi-ui-textbox-container').trigger('keydown', {
        key: 'ArrowDown',
      });
      cy.get('.hsi-ui-listbox').should('be.visible');
      cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    });
    it('opens the listbox on down arrow', () => {
      cy.get('.hsi-ui-textbox-container').trigger('keydown', {
        key: 'ArrowDown',
      });
      cy.get('.hsi-ui-listbox').should('be.visible');
    });
    it('opens the listbox on up arrow', () => {
      cy.get('.hsi-ui-textbox-container').trigger('keydown', {
        key: 'ArrowUp',
      });
      cy.get('.hsi-ui-listbox').should('be.visible');
    });
  });
});

describe('keyboard navigation with a single select listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleKeyboardTestComponent);
  });
  it('opens and closes from keyboard', () => {
    cy.get('.hsi-ui-textbox').should('be.visible');
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    triggerTextboxKey('Escape');
    cy.get('.hsi-ui-listbox').should('not.exist');
  });

  it('navigates and selects from keyboard', () => {
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    triggerTextboxKey('Enter');
    cy.get('.hsi-ui-listbox').should('not.exist');
  });

  it('keeps navigation within list bounds', () => {
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    triggerTextboxKey('ArrowUp');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    triggerTextboxKey('ArrowUp');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');

    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
  });
});

@Component({
  selector: 'hsi-ui-combobox-multi-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox" [useListboxLabelAsBoxPlaceholder]="true">
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
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
class ComboboxMultiKeyboardTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation with a multi select listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiKeyboardTestComponent);
  });
  it('opens from keyboard and marks first option current', () => {
    cy.realPressAndWait('Tab');
    cy.get('.hsi-ui-textbox-container').should('be.focused');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
  });

  it('selects and toggles options with keyboard', () => {
    cy.realPressAndWait('Tab');
    cy.get('.hsi-ui-textbox-container').should('be.focused');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');

    triggerTextboxKey('Enter');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'selected');
    triggerTextboxKey('Enter');
    cy.get('.hsi-ui-listbox-option')
      .first()
      .should('not.have.class', 'selected');
  });

  it('keeps navigation within list bounds', () => {
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');

    triggerTextboxKey('ArrowUp');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    triggerTextboxKey('ArrowUp');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');

    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');

    triggerTextboxKey('Escape');
    cy.get('.hsi-ui-listbox').should('not.exist');
  });
});

@Component({
  selector: 'hsi-ui-combobox-single-angular-aria-keyboard-test',
  template: `
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox" [useAngularAria]="true">
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
class ComboboxSingleAngularAriaKeyboardTestComponent extends ComboboxBaseTestComponent {}

@Component({
  selector: 'hsi-ui-combobox-single-angular-aria-keyboard-disabled-test',
  template: `
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox" [useAngularAria]="true">
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
class ComboboxSingleAngularAriaKeyboardDisabledTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation in Angular Aria trigger mode', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleAngularAriaKeyboardTestComponent);
  });

  it('opens and navigates options with keyboard', () => {
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox').should('be.visible');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
  });

  it('selects an option with keyboard and updates value', () => {
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    triggerTextboxKey('Enter');
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

describe('keyboard navigation in Angular Aria trigger mode with disabled options', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleAngularAriaKeyboardDisabledTestComponent);
  });

  it('marks disabled options and skips them during keyboard navigation', () => {
    cy.get('.hsi-ui-textbox-container').focus();
    triggerTextboxKey('ArrowDown');
    cy.get('.hsi-ui-listbox-option')
      .eq(2)
      .should('have.attr', 'aria-disabled', 'true');
    cy.get('.hsi-ui-listbox-option')
      .eq(4)
      .should('have.attr', 'aria-disabled', 'true');

    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
  });
});

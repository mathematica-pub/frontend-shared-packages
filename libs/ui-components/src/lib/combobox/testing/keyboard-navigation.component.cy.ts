import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { HsiUiComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

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
        <span class="material-symbols-outlined expand-more" boxIcon>
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
})
class ComboboxSingleKeyboardTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation with a generic listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleKeyboardTestComponent, {
      declarations: [ComboboxSingleKeyboardTestComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
    cy.get('.combobox-textbox').trigger('focus');
  });
  it('correctly opens the combobox with the open keys ', () => {
    it('opens the listbox on enter and first option is current, then arrows through', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: 'Enter' });
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.listbox-option').first().should('have.class', 'current');
    });
    it('opens the listbox on space', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: ' ' });
      cy.get('.combobox-listbox').should('be.visible');
    });
    it('opens the listbox on down arrow', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: 'ArrowDown' });
      cy.get('.combobox-listbox').should('be.visible');
    });
    it('opens the listbox on up arrow', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: 'ArrowUp' });
      cy.get('.combobox-listbox').should('be.visible');
    });
  });
});

describe('keyboard navigation with a single select listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleKeyboardTestComponent, {
      declarations: [ComboboxSingleKeyboardTestComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  it('correctly responds to keyboard navigation and selection', () => {
    // realPress('tab') will not work on first mounted component shrug
    cy.get('.combobox-textbox').should('be.visible');
    cy.get('.combobox-textbox').focus();
    // opens the combobox on enter
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.combobox-listbox').should('be.visible');
    // apllies current class to first option on enter
    cy.get('.listbox-option').first().should('have.class', 'current');
    // closes the combobox with escape
    cy.get('.combobox-textbox').type('{esc}');
    cy.get('.combobox-listbox').should('not.be.visible');
    // applies current class to first option on down arrow
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{downArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // selects an option using the keyboard and updates the value
    cy.get('.combobox-textbox').type('{downarrow}{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas');
    // focus remains on first option when up arrow is presse
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.listbox-option').eq(1).should('have.class', 'current');
    cy.get('.combobox-textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.combobox-textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // focus remains on last option when down arrow is pressed
    cy.get('.combobox-textbox').type('{esc}');
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type(
      '{downArrow}{downArrow}{downArrow}{downArrow}'
    );
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
    cy.get('.combobox-textbox').type('{downArrow}');
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
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
})
class ComboboxMultiKeyboardTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation with a multi select listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiKeyboardTestComponent, {
      declarations: [ComboboxMultiKeyboardTestComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  it('correctly responds to keyboard navigation and selection', () => {
    // textbox receives focus on tab
    cy.realPress('Tab');
    cy.get('.combobox-textbox').should('be.focused');
    // opens the combobox on enter
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.combobox-listbox').should('be.visible');
    // apllies current class to first option on enter
    cy.get('.listbox-option').first().should('have.class', 'current');
    // closes the combobox with escape
    cy.get('.combobox-textbox').type('{esc}');
    cy.get('.combobox-listbox').should('not.be.visible');
    // applies current class to first option on down arrow
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{downArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // selects and unselects options using the keyboard and updates the value
    cy.get('.combobox-textbox').type('{downarrow}{enter}');
    cy.get('.combobox-textbox').type('{downarrow}{downarrow}{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas,Durians');
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas');
    // focus remains on first option when up arrow is presse
    cy.get('.combobox-textbox').type('{upArrow}{upArrow}{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.combobox-textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // focus remains on last option when down arrow is pressed
    cy.get('.combobox-textbox').type(
      '{enter}{downArrow}{downArrow}{downArrow}{downArrow}'
    );
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
    cy.get('.combobox-textbox').type('{downArrow}');
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// Simple single select combobox that displays selected
@Component({
  selector: 'hsi-ui-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox" [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [labelIsBoxPlaceholder]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</hsi-ui-listbox-option>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectOnlyComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleTestComponent, {
      declarations: [ComboboxSingleTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  describe('click behavior after load', () => {
    it('should not emit a value on load', () => {
      cy.get('.combobox-value').should('have.text', '');
    });
    it('listbox should not be visible on load', () => {
      cy.get('.combobox-listbox').should('not.be.visible');
    });
    it('should open the combobox on click', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.combobox-listbox').should('be.visible');
    });
    it('should emit the correct value on option click', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.combobox-value').should('have.text', 'Apples');
    });
    it('should display value on textbox', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.textbox').should('include.text', 'Apples');
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').eq(1).realClick();
      cy.get('.textbox').should('include.text', 'Bananas');
      cy.get('.textbox').should('not.include.text', 'Apples');
    });
    it('listbox should close on option click', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().click();
      cy.get('.combobox-listbox').should('not.be.visible');
    });
    it('selected option should be highlighted on listbox reopen', () => {
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').first().realClick();
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').first().should('have.class', 'current');
    });
    it('clicking outside the combobox should close the listbox', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.combobox-listbox').should('not.be.visible');
    });
  });
  describe('label options', () => {
    it('should display the listbox label in the textbox on load', () => {
      cy.get('.textbox-label').should('have.text', 'Select a fruit');
    });
    it('should display the selected option in the textbox after selection', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.textbox-label').should('have.text', 'Apples');
    });
  });
  describe('keyboard behavior', () => {
    beforeEach(() => {
      cy.get('.combobox-textbox').trigger('focus');
    });
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
    // TODO: get typing chars to work
  });
});

// Simple single select combobox that does not display selected
@Component({
  selector: 'hsi-ui-combobox-single-no-display-selected-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [labelIsBoxPlaceholder]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</hsi-ui-listbox-option>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSingleTestNoDisplaySelectedComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleTestNoDisplaySelectedComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleTestNoDisplaySelectedComponent, {
      declarations: [ComboboxSingleTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('does not display selected', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox').should('not.include.text', 'Apples');
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

// Single select combobox with some disabled options
@Component({
  selector: 'hsi-ui-combobox-single-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [labelIsBoxPlaceholder]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option
          *ngFor="let option of options"
          [disabled]="option.displayName.length > 7"
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSingleSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleSelectDisabledOptionsComponent, {
      declarations: [ComboboxSingleSelectDisabledOptionsComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('can select non-disabled options', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
  it('cannot select disabled options', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(4).realClick();
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
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [labelIsBoxPlaceholder]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option
          *ngFor="let option of options; let i = index"
          [selected]="i === 2"
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSelectFromOutsideSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectFromOutsideSingleComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectFromOutsideSingleTestComponent, {
      declarations: [ComboboxSelectFromOutsideSingleTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('should display the selected option in the textbox on load', () => {
    cy.wait(1000);
    cy.get('.textbox-label').should('have.text', 'Coconuts');
  });
  it('can switch the selected option on click', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

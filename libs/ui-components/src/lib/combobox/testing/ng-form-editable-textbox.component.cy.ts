/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-ng-form-editable-textbox-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-ng-form-editable-textbox
        placeholder="Select a fruit, A-E"
        [inputControl]="inputControl"
        [autoSelectTrigger]="autoSelectTrigger"
        [autoSelect]="autoSelect"
      >
      </hsi-ui-ng-form-editable-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</hsi-ui-listbox-option>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="textbox-value">{{ inputControl.value }}</p>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class NgFormEditableTextboxTestComponent extends ComboboxBaseTestComponent {
  @Input() autoSelect: boolean;
  @Input() autoSelectTrigger: 'any' | 'character';
  @Input() displaySelected = false;
  inputControl = new FormControl('');
}

describe('Basic ngForm editable textbox features', () => {
  beforeEach(() => {
    cy.mount(NgFormEditableTextboxTestComponent, {
      declarations: [NgFormEditableTextboxTestComponent],
      imports: [ComboboxModule, MatIconModule],
      componentProperties: {
        autoSelect: true,
        autoSelectTrigger: 'any',
      },
    });
  });
  it('displays the placeholder text', () => {
    cy.get('.combobox-textbox').should(
      'have.attr',
      'placeholder',
      'Select a fruit, A-E'
    );
  });
  it('displays the typed text in the textbox and correctly outputs typed text', () => {
    cy.get('.combobox-textbox').type('bananas');
    cy.get('.combobox-textbox').should('have.value', 'bananas');
    cy.get('.textbox-value').should('have.text', 'bananas');
  });
});

describe('Combobox features - autoSelect of option', () => {
  describe('when autoSelect is true and autoSelectTrigger is any', () => {
    beforeEach(() => {
      cy.mount(NgFormEditableTextboxTestComponent, {
        declarations: [NgFormEditableTextboxTestComponent],
        imports: [ComboboxModule, MatIconModule],
        componentProperties: {
          autoSelect: true,
          autoSelectTrigger: 'any',
        },
      });
    });
    it('selects the first item if textbox is clicked on and closed', () => {
      cy.get('.fruits-dropdown').find('input').click();
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.combobox-value').should('have.text', 'Apples');
      cy.get('.combobox-listbox').should('not.be.visible');
    });
  });
  describe('when autoSelect is true and autoSelectTrigger is character', () => {
    beforeEach(() => {
      cy.mount(NgFormEditableTextboxTestComponent, {
        declarations: [NgFormEditableTextboxTestComponent],
        imports: [ComboboxModule, MatIconModule],
        componentProperties: {
          autoSelect: true,
          autoSelectTrigger: 'character',
        },
      });
    });
    it('does not make a selection if textbox is clicked on and closed', () => {
      cy.get('.fruits-dropdown').find('input').click();
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.combobox-value').should('have.text', '');
      cy.get('.combobox-listbox').should('not.be.visible');
    });
    it('makes a selection if a character is typed and then the listbox is closed', () => {
      cy.get('.fruits-dropdown').find('input').type('whatever');
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.combobox-value').should('have.text', 'Apples');
      cy.get('.combobox-listbox').should('not.be.visible');
    });
  });
  describe('when autoSelect is false', () => {
    beforeEach(() => {
      cy.mount(NgFormEditableTextboxTestComponent, {
        declarations: [NgFormEditableTextboxTestComponent],
        imports: [ComboboxModule, MatIconModule],
        componentProperties: {
          autoSelect: false,
          autoSelectTrigger: 'any',
        },
      });
    });
    it('does not make any selections if the textbox is clicked and then there is a blur event / it is closed', () => {
      cy.get('.fruits-dropdown').find('input').click();
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.combobox-value').should('have.text', '');
      cy.get('.combobox-listbox').should('not.be.visible');
    });
  });
});

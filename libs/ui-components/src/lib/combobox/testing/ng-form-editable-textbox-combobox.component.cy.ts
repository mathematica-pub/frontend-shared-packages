/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { Observable, combineLatest, map, of, startWith } from 'rxjs';
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
        [formControl]="inputControl"
        [autoSelectTrigger]="autoSelectTrigger"
        [autoSelect]="autoSelect"
      >
      </hsi-ui-ng-form-editable-textbox>
      <hsi-ui-listbox
        (valueChanges)="onSelection($event)"
        [isMultiSelect]="isMultiSelect"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options$ | async; track option.id) {
          <hsi-ui-listbox-option>{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="textbox-value">{{ inputControl.value }}</p>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class NgFormEditableTextboxTestComponent
  extends ComboboxBaseTestComponent
  implements OnInit
{
  @Input() autoSelect: boolean;
  @Input() autoSelectTrigger: 'any' | 'character';
  @Input() displaySelected = false;
  @Input() isMultiSelect = false;
  options$: Observable<{ displayName: string; id: string }[]>;
  inputControl = new FormControl('');

  ngOnInit(): void {
    this.options$ = combineLatest([
      of(this.options),
      this.inputControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([options, text]) => {
        return options.filter((option) =>
          option.displayName.toLowerCase().includes(text.toLowerCase())
        );
      })
    );
  }
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
  it('displays the filtered options in the listbox', () => {
    cy.get('.combobox-textbox').type('coco');
    cy.get('.combobox-listbox')
      .find('.listbox-option')
      .should('have.length', 1);
  });
  it('displays the filtered options in the listbox', () => {
    cy.get('.combobox-textbox').type('a');
    cy.get('.combobox-listbox')
      .find('.listbox-option')
      .should('have.length', 3); //Apples, Bananas, Durians
  });
});

[true, false].forEach((isMultiSelect) => {
  describe(`${isMultiSelect ? 'Multi' : 'Single'}-select combobox features - autoSelect of option`, () => {
    describe('when autoSelect is true and autoSelectTrigger is any', () => {
      beforeEach(() => {
        cy.mount(NgFormEditableTextboxTestComponent, {
          declarations: [NgFormEditableTextboxTestComponent],
          imports: [ComboboxModule, MatIconModule],
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
            isMultiSelect: isMultiSelect,
          },
        });
      });
      it('selects the first item if textbox is clicked on and closed', () => {
        cy.get('.fruits-dropdown').find('input').click();
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.outside-element').realClick();
        cy.get('.combobox-value').should('have.text', 'Apples');
        cy.get('.combobox-listbox').should('not.be.visible');
        // reopen listbox and make sure properties are correct
        cy.get('.fruits-dropdown').find('input').click();
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .should('have.length', 5);
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .first()
          .should('have.class', 'selected');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .first()
          .should('have.class', 'current');
      });
      it('retains the user selection if the listbox is closed and then reopened', () => {
        cy.get('.fruits-dropdown').find('input').click();
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.combobox-listbox').find('.listbox-option').eq(2).realClick();
        cy.get('.combobox-value').should('have.text', 'Coconuts');
        cy.get('.outside-element').realClick();
        cy.get('.combobox-listbox').should('not.be.visible');
        // reopen listbox and make sure properties are correct
        cy.get('.fruits-dropdown').find('input').click();
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .should('have.length', 5);
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .eq(2)
          .should('have.class', 'selected');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .eq(2)
          .should('have.class', 'current');
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
            isMultiSelect: isMultiSelect,
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
      it('filters the options and selects the first in the filtered list if text is entered in the textbox but no option is clicked', () => {
        cy.get('.fruits-dropdown').find('input').type('a');
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.outside-element').realClick();
        cy.get('.combobox-value').should('have.text', 'Apples');
        cy.get('.combobox-listbox').should('not.be.visible');
        // reopen listbox and make sure properties are correct
        cy.get('.fruits-dropdown').find('input').click();
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .should('have.length', 3);
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .first()
          .should('have.class', 'selected');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .first()
          .should('have.class', 'current');
      });
      it('retains the user selection if the listbox is closed and then reopened', () => {
        cy.get('.fruits-dropdown').find('input').type('a');
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.combobox-listbox').find('.listbox-option').eq(2).realClick();
        cy.get('.combobox-value').should('have.text', 'Durians');
        cy.get('.outside-element').realClick();
        cy.get('.combobox-listbox').should('not.be.visible');
        // reopen listbox and make sure properties are correct
        cy.get('.fruits-dropdown').find('input').click();
        cy.get('.combobox-listbox').should('be.visible');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .should('have.length', 3);
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .eq(2)
          .should('have.class', 'selected');
        cy.get('.combobox-listbox')
          .find('.listbox-option')
          .eq(2)
          .should('have.class', 'current');
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
            isMultiSelect: isMultiSelect,
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
});

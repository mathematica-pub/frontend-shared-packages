/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-ng-form-listbox-single-test',
  template: `
    <p class="display-control-value">{{ control.value }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Select a fruit</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox [formControl]="control">
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
    cy.mount(NgFormListboxSingleTestComponent, {
      declarations: [NgFormListboxSingleTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('can make one selection', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
  });
  it('can change selection', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.listbox-option').first().should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('not.have.class', 'selected');
  });
  it('selecting option should close the listbox', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-listbox').should('not.be.visible');
  });
  it('control value should match selected combobox value', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.display-control-value').realClick();
    cy.get('.display-control-value').should('have.text', 'bana');
  });
});

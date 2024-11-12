/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-ng-form-listbox-multi-test',
  template: `
    <p class="display-control-values">{{ control.value.join(', ') }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="true">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-ng-form-listbox-multi [control]="control">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option
          *ngFor="let option of options"
          [selected]="control.value.includes(option.id)"
          [value]="option.id"
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-ng-form-listbox-multi>
    </hsi-ui-combobox>
    <button (click)="setSelectAll()" class="super-cool-button-pls-click-me"
      >Set all selected</button
    >
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class NgFormListboxMultiTestComponent implements OnInit {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  control: FormControl<string[]>;

  ngOnInit(): void {
    this.control = new FormControl([]);
  }

  setSelectAll() {
    this.control.setValue(this.options.map((x) => x.id));
  }
}

describe('NgFormListboxMultiTestComponent', () => {
  beforeEach(() => {
    cy.mount(NgFormListboxMultiTestComponent, {
      declarations: [NgFormListboxMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('can make more than one selection', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.listbox-option').first().should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
  });
  it('can unselect selections', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.listbox-option').first().should('not.have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('not.have.class', 'selected');
  });
  it('clicking outside the combobox should close the listbox', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-listbox').should('be.visible');
    cy.get('.display-control-values').realClick();
    cy.get('.combobox-listbox').should('not.be.visible');
  });
  it('should have correct control values', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.display-control-values').realClick();
    cy.get('.display-control-values').should('have.text', 'appl, bana');
  });
});

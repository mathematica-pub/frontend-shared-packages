/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { ComboboxService } from '../combobox.service';

const scss = `
  .combobox-textbox {
    background: white;
    border: 1px solid blue;
    padding: 12px;
  }
`;

@Component({
  selector: 'hsi-ui-ng-form-editable-textbox-test',
  template: `
    <hsi-ui-ng-form-editable-textbox [inputControl]="inputControl">
    </hsi-ui-ng-form-editable-textbox>
    <p class="value-display">Textbox value is: {{ inputControl.value }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class NgFormEditableTextboxTestComponent {
  inputControl = new FormControl('apples');
}

describe('NgFormListboxSingleTestComponent', () => {
  beforeEach(() => {
    cy.mount(NgFormEditableTextboxTestComponent, {
      declarations: [NgFormEditableTextboxTestComponent],
      imports: [ComboboxModule, MatIconModule],
      providers: [ComboboxService],
    });
  });
  it('displays inputControl value', () => {
    cy.get('.combobox-textbox').should('have.value', 'apples');
    cy.get('.value-display').should('have.text', 'Textbox value is: apples');
  });
  it('can change FormControl value', () => {
    cy.get('.combobox-textbox').should('have.value', 'apples');
    cy.get('.combobox-textbox').type('bananas');
    cy.get('.combobox-textbox').should('have.value', 'applesbananas');
    cy.get('.value-display').should(
      'have.text',
      'Textbox value is: applesbananas'
    );
  });
});

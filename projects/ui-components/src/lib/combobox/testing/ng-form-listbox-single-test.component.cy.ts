/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { SingleSelectListboxValue } from '../listbox/listbox.component';

const scss = `
  .combobox-textbox {
    background: white;
    border: 1px solid blue;
    padding: 12px;
  }
  .textbox-label {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 500px; // required for ellipsis to work; maybe take this off later
  }
  .textbox-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .textbox-icon .material-symbols-outlined {
    transform: scale(1.5);
    font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 48;
  }
  .textbox-icon.open {
    transform: rotate(180deg);
  }
  .combobox-listbox.open {
    background: white;
    border-right: 1px solid orange;
    border-bottom: 1px solid orange;
    border-left: 1px solid orange;
    border-radius: 2px;
  }
  .listbox-label {
    padding: 8px 12px 4px 12px;
  }
  .listbox-option .option-label {
    padding: 12px;
  }
  .listbox-option:hover {
    background: blanchedalmond;
  }
  .listbox-option.current {
    outline: 2px solid red;
    outline-offset: -2px;
  }
  .listbox-option.current:not(.selected) {
    background: blanchedalmond;
  }
  .listbox-option.selected {
    background: blanchedalmond;
  }
  .combobox-value {
    padding-top: 16px;
  }
`;

@Component({
  selector: 'hsi-ui-ng-form-listbox-multi-test',
  template: `
    <p class="display-control-value">{{ control.value }}</p>
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
      <hsi-ui-ng-form-listbox-single [control]="control">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option
          *ngFor="let option of options"
          [selected]="control.value === option.id"
          [value]="option.id"
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-ng-form-listbox-single>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class NgFormListboxSingleTestComponent implements OnInit {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  control: FormControl<SingleSelectListboxValue<string>>;

  ngOnInit(): void {
    this.control = new FormControl(null);
  }
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
  // it('can change selection', () => {
  //   cy.get('.combobox-textbox').click();
  //   cy.get('.listbox-option').eq(1).realClick();
  //   cy.get('.textbox-label').should('have.text', 'Bananas');
  //   cy.get('.listbox-option').first().realClick();
  //   cy.get('.textbox-label').should('have.text', 'Apples');
  //   cy.get('.listbox-option').first().should('have.class', 'selected');
  //   cy.get('.listbox-option').eq(1).should('not.have.class', 'selected');
  // });
  // it('clicking outside the combobox should close the listbox', () => {
  //   cy.get('.combobox-textbox').click();
  //   cy.get('.listbox-option').first().realClick();
  //   cy.get('.combobox-listbox').should('be.visible');
  //   cy.get('.display-control-value').realClick();
  //   cy.get('.combobox-listbox').should('not.be.visible');
  // });
  it('should have correct control value', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.display-control-value').realClick();
    cy.get('.display-control-value').should('have.text', 'bana');
  });
});

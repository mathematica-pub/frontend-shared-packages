/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-combobox-select-all-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="displaySelected">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [countSelectedOptionsLabel]="countSelectedOptionsLabel"
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-select-all-listbox-option
          >Select all</hsi-ui-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option>{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSelectAllMultiSelectTestComponent extends ComboboxBaseTestComponent {
  @Input() displaySelected = false;
  @Input() countSelectedOptionsLabel = { singular: 'fruit', plural: 'fruits' };
}

describe('ComboboxSelectAllMultiComponent', () => {
  describe('basic select all functionality', () => {
    beforeEach(() => {
      cy.mount(ComboboxSelectAllMultiSelectTestComponent, {
        declarations: [ComboboxSelectAllMultiSelectTestComponent],
        imports: [ComboboxModule, MatIconModule],
        componentProperties: { displaySelected: true },
      });
    });
    it('the select all button selects all when clicked and automatically deselects when not all options are selected', () => {
      cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
      cy.get('.combobox-textbox').click();
      cy.get('.textbox-label').should('have.text', '0 fruits selected');
      cy.get('.listbox-option').eq(0).realClick();
      cy.get('.textbox-label').should('have.text', '5 fruits selected');
      cy.get('.listbox-option').eq(1).realClick();
      cy.get('.textbox-label').should('have.text', '4 fruits selected');
      cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');
    });
  });
});

@Component({
  selector: 'hsi-ui-combobox-external-disable',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <button (click)="addAppleToDisabled()" class="disable-apple-button"
      >Disable apple</button
    >
    <button (click)="removeAppleFromSelected()" class="enable-apple-button"
      >Enable apple</button
    >
    <p class="emitted-combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="displaySelected">
        <p boxLabel>Select a fruit, A-E</p>
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
        <hsi-ui-select-all-listbox-option
          >Select all</hsi-ui-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [disabled]="(disabled$ | async).includes(option.displayName)"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxExternalDisableTestComponent {
  @Input() displaySelected = false;
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  disabled = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(values: string[]): void {
    this.value.next(values);
  }

  addAppleToDisabled() {
    const currentDisabled = this.disabled.value.filter((x) => x !== 'Apples');
    this.disabled.next([...currentDisabled, 'Apples']);
  }

  removeAppleFromDisabled() {
    const currentDisabled = this.disabled.value;
    this.disabled.next(currentDisabled.filter((d) => d !== 'Apples'));
  }
}

describe('ComboboxExternalDisableTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalDisableTestComponent, {
      declarations: [ComboboxExternalDisableTestComponent],
      imports: [ComboboxModule, MatIconModule],
      componentProperties: { displaySelected: true },
    });
  });

  it('the select all option should not change with a change to the disabled property of options from the outside', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.disable-apple-button').realClick();
    cy.get('.listbox-option').eq(1).should('have.class', 'disabled');
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');

    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'disabled');
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
  });
});

@Component({
  selector: 'hsi-ui-combobox-external-selected',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <button (click)="addCoconutToSelected()" class="select-coconut-button"
      >Select coconut</button
    >
    <button
      (click)="removeCoconutFromSelected()"
      class="deselect-coconut-button"
      >Deselect coconut</button
    >
    <p class="emitted-combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="displaySelected">
        <p boxLabel>Select a fruit, A-E</p>
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
        <hsi-ui-select-all-listbox-option
          >Select all</hsi-ui-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="(selected$ | async).includes(option.displayName)"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxExternalSelectedTestComponent {
  @Input() displaySelected = false;
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  selected = new BehaviorSubject<string[]>([]);
  selected$ = this.selected.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(values: string[]): void {
    this.value.next(values);
    this.selected.next(values);
  }

  addCoconutToSelected() {
    const currSelected = this.selected.value.filter((v) => v !== 'Coconuts');
    this.selected.next([...currSelected, 'Coconuts']);
  }

  removeCoconutFromSelected() {
    const currSelected = this.selected.value.filter((v) => v !== 'Coconuts');
    this.selected.next(currSelected);
  }
}

describe('ComboboxExternalSelectedTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalSelectedTestComponent, {
      declarations: [ComboboxExternalSelectedTestComponent],
      imports: [ComboboxModule, MatIconModule],
      componentProperties: { displaySelected: true },
    });
  });

  it('the select all option should respond to the selected property of an option being changed from outside - deselection', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.deselect-coconut-button').realClick();
    // should not reemit a new value
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.outside-element').click();
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Durians, Elderberries'
    );
    cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');
  });

  it('the select all option should respond to the selected property of an option being changed from outside - selection', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();

    cy.get('.deselect-coconut-button').realClick();
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Durians, Elderberries'
    );
    cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');

    cy.get('.select-coconut-button').realClick();
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');
  });
});

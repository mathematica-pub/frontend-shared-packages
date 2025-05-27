/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-combobox-grouped-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value() }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="isMulti"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 1</span>
          </hsi-ui-listbox-label>
          @for (option of options1; track option.id) {
            <hsi-ui-listbox-option>{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 2</span>
          </hsi-ui-listbox-label>
          @for (option of options2; track option.id) {
            <hsi-ui-listbox-option>{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedTestComponent {
  @Input() isMulti = false;
  options1 = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  options2 = [
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = signal<string[] | null>(null);

  onSelection(event: any): void {
    this.value.set(event);
  }
}

describe('Single-select grouped combobox with a default (dynamic) label', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedTestComponent, {
      componentProperties: { isMulti: false },
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected value afterwards', () => {
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Durians');
  });
  it('emits the expected value when an option is selected', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Durians');
  });
  it('correctly applies the selected class when an option is clicked', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(0).should('have.class', 'selected');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-listbox-option').eq(0).should('not.have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(3).should('have.class', 'selected');
  });
});

describe('Multi-select grouped combobox with a default (dynamic) label', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedTestComponent, {
      componentProperties: { isMulti: true },
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected values afterwards', () => {
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples, Durians');
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
  });
  it('emits the expected value when an option is selected', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Durians');
  });
  it('correctly applies the selected class when an option is clicked', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(0).should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-listbox-option').eq(0).should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(3).should('have.class', 'selected');
  });
});

@Component({
  selector: 'hsi-ui-combobox-grouped-count-label-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value() }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-textbox [selectedCountLabel]="countLabel">
        <p boxLabel>Select a fruit</p>
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
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 1</span>
          </hsi-ui-listbox-label>
          @for (option of options1; track option.id) {
            <hsi-ui-listbox-option>{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 2</span>
          </hsi-ui-listbox-label>
          @for (option of options2; track option.id) {
            <hsi-ui-listbox-option>{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedCountLabelTestComponent {
  options1 = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  options2 = [
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = signal<string[] | null>(null);
  countLabel = { singular: 'fruit', plural: 'fruits' };

  onSelection(event: any): void {
    this.value.set(event);
  }
}

describe('Multi-select grouped combobox with external selections', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedCountLabelTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and the count label afterwards', () => {
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', '0 fruits selected');
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '1 fruit selected');
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '2 fruits selected');
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '0 fruits selected');
  });
});

@Component({
  selector: 'hsi-ui-combobox-grouped-external-selections-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value() }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit</p>
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
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 1</span>
          </hsi-ui-listbox-label>
          @for (option of options1; track option.id) {
            <hsi-ui-listbox-option
              [selected]="option.displayName === 'Bananas'"
              >{{ option.displayName }}</hsi-ui-listbox-option
            >
          }
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 2</span>
          </hsi-ui-listbox-label>
          @for (option of options2; track option.id) {
            <hsi-ui-listbox-option
              [selected]="option.displayName === 'Durians'"
              >{{ option.displayName }}</hsi-ui-listbox-option
            >
          }
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedExternalSelectionsTestComponent {
  options1 = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  options2 = [
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = signal<string[] | null>(null);
  countLabel = { singular: 'fruit', plural: 'fruits' };

  onSelection(event: any): void {
    this.value.set(event);
  }
}

describe('Multi-select grouped combobox with external selections', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedExternalSelectionsTestComponent);
  });
  it('textbox label shows externally selected options on load', () => {
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas, Durians');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas, Durians');
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should(
      'have.text',
      'Apples, Bananas, Durians'
    );
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
  });
  it('does not emit a value until a user actively makes a selection', () => {
    cy.get('.combobox-value').should('have.text', '');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas,Durians');
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
  });
  it('correctly applies the selected class', () => {
    cy.get('.hsi-ui-listbox-option').eq(1).should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(3).should('have.class', 'selected');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).should('not.have.class', 'selected');
  });
});

@Component({
  selector: 'hsi-ui-combobox-grouped-changing-options-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value() }}</p>
    <button class="filter-options-button" (click)="filterOptions()"
      >Filter options</button
    >
    <button class="restore-options-button" (click)="restoreOptions()"
      >Restore options</button
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit</p>
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
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 1</span>
          </hsi-ui-listbox-label>
          @for (option of options1(); track option.id) {
            <hsi-ui-listbox-option>{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 2</span>
          </hsi-ui-listbox-label>
          @for (option of options2(); track option.id) {
            <hsi-ui-listbox-option>{{
              option.displayName
            }}</hsi-ui-listbox-option>
          }
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedDynamicOptionsTestComponent {
  optionsABC = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  optionsDE = [
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  options1 = signal(this.optionsABC);
  options2 = signal(this.optionsDE);
  value = signal(null);
  countLabel = { singular: 'fruit', plural: 'fruits' };

  onSelection(event: any): void {
    this.value.set(event);
  }

  filterOptions(): void {
    this.options1.set([
      { displayName: 'Apples', id: 'appl' },
      { displayName: 'Coconuts', id: 'coco' },
    ]);
    this.options2.set([{ displayName: 'Elderberries', id: 'elde' }]);
  }

  restoreOptions(): void {
    this.options1.set(this.optionsABC);
    this.options2.set(this.optionsDE);
  }
}

describe('Multi-select grouped combobox with dynamic options', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedDynamicOptionsTestComponent);
  });
  it('combobox correctly changes options when options are changed externally', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').should('have.length', 5);
    cy.get('.filter-options-button').click();
    cy.get('.hsi-ui-listbox-option').should('have.length', 3);
    cy.get('.restore-options-button').click();
    cy.get('.hsi-ui-listbox-option').should('have.length', 5);
  });
  it('has the correct textbox label when options are removed', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.filter-options-button').click();
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
  });
  it('does not emit a new value if the options change even when the textbox label changes', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
    cy.get('.filter-options-button').click();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
  });
  it.only('does not restore selected values when options are added back in', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.filter-options-button').click();
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
    cy.get('.restore-options-button').click();
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
  });
});

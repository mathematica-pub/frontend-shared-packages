/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { HsiUiComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// Simple single select combobox that displays selected
@Component({
  selector: 'hsi-ui-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Select a fruit, A-E</span>
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
class ComboboxSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectOnlyComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleTestComponent, {
      declarations: [ComboboxSingleTestComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  describe('click behavior after load', () => {
    it('should not emit a value on load', () => {
      cy.get('.combobox-value').should('have.text', '');
    });
    it('listbox should not be visible on load', () => {
      cy.get('.hsi-ui-listbox').should('not.be.visible');
    });
    it('should open the combobox on click', () => {
      cy.get('.hsi-ui-textbox').click();
      cy.get('.hsi-ui-listbox').should('be.visible');
    });
    it('should emit the correct value on option click', () => {
      cy.get('.hsi-ui-textbox').click();
      cy.get('.hsi-ui-listbox-option').first().realClick();
      cy.get('.combobox-value').should('have.text', 'Apples');
    });
    it('should display value on textbox', () => {
      cy.get('.hsi-ui-textbox').click();
      cy.get('.hsi-ui-listbox-option').first().realClick();
      cy.get('.hsi-ui-textbox-label').should('include.text', 'Apples');
      cy.get('.hsi-ui-textbox').click();
      cy.get('.hsi-ui-listbox-option').eq(1).realClick();
      cy.get('.hsi-ui-textbox-label').should('include.text', 'Bananas');
      cy.get('.hsi-ui-textbox-label').should('not.include.text', 'Apples');
    });
    it('listbox should close on option click', () => {
      cy.get('.hsi-ui-textbox').click();
      cy.get('.hsi-ui-listbox-option').first().click();
      cy.get('.hsi-ui-listbox').should('not.be.visible');
    });
    it('selected option should be highlighted on listbox reopen', () => {
      cy.get('.hsi-ui-textbox').realClick();
      cy.get('.hsi-ui-listbox-option').first().realClick();
      cy.get('.hsi-ui-textbox').realClick();
      cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    });
    it('clicking outside the combobox should close the listbox', () => {
      cy.get('.hsi-ui-textbox').click();
      cy.get('.hsi-ui-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.hsi-ui-listbox').should('not.be.visible');
    });
  });

  it('the current class is on the first selected option if there is one or on the 0th option when opened', () => {
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    cy.get('.hsi-ui-textbox').type('{esc}');
    cy.get('.hsi-ui-listbox').should('not.be.visible');
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'current');
    cy.get('.hsi-ui-textbox').type('{esc}');
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'current');
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(3).should('have.class', 'current');
  });
});

// Single select combobox with some disabled options
@Component({
  selector: 'hsi-ui-combobox-single-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [useListboxLabelAsBoxPlaceholder]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option [disabled]="option.displayName.length > 7">{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSingleSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleSelectDisabledOptionsComponent, {
      declarations: [ComboboxSingleSelectDisabledOptionsComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  it('can select non-disabled options', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
  it('cannot select disabled options', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(4).realClick();
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
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [useListboxLabelAsBoxPlaceholder]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="option.displayName === 'Coconuts'"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSelectFromOutsideSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectFromOutsideSingleComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectFromOutsideSingleTestComponent, {
      declarations: [ComboboxSelectFromOutsideSingleTestComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  it('should display the selected option in the textbox on load', () => {
    cy.wait(1000);
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Coconuts');
  });
  it('can switch the selected option on click', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

// Single select combobox with groups
@Component({
  selector: 'hsi-ui-combobox-grouped-single-test',
  template: `
    <hsi-ui-combobox class="pixar-movies-dropdown">
      <hsi-ui-combobox-label>
        <span>Star Wars Movies Combobox</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox class="textbox">
        <p boxLabel
          >This combobox stores your favorite of the first 6 Star Wars
          movies!</p
        >
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span class="group-label">Original Trilogy</span>
          </hsi-ui-listbox-label>
          <hsi-ui-listbox-option
            *ngFor="let option of optionsGroup1"
            [value]="option.id"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span class="group-label">Prequel Trilogy</span>
          </hsi-ui-listbox-label>
          <hsi-ui-listbox-option
            *ngFor="let option of optionsGroup2"
            [value]="option.id"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">Selected id value: {{ selected$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxGroupedSingleTestComponent {
  optionsGroup1 = [
    { displayName: 'A New Hope', id: 'newHope' },
    { displayName: 'The Empire Strikes Back', id: 'empire' },
    { displayName: 'Return of the Jedi', id: 'returnJedi' },
  ];
  optionsGroup2 = [
    { displayName: 'The Phantom Menace', id: 'phantom' },
    { displayName: 'Attack of the Clones', id: 'clones' },
    { displayName: 'Revenge of the Sith', id: 'sith' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(selectedId: string): void {
    this.value.next(selectedId);
  }
}

describe('ComboboxGroupedSingleTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedSingleTestComponent, {
      declarations: [ComboboxGroupedSingleTestComponent],
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  it('can select values from different groups', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-textbox-label').should('include.text', 'A New Hope');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(4).realClick();
    cy.get('.hsi-ui-textbox-label').should(
      'include.text',
      'Attack of the Clones'
    );
    cy.get('.hsi-ui-textbox-label').should('not.include.text', 'A New Hope');
  });
});

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
      imports: [HsiUiComboboxModule, MatIconModule],
    });
  });
  it('can make one selection', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas');
    cy.get('.hsi-ui-listbox-option').eq(1).should('have.class', 'selected');
  });
  it('can change selection', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(1).should('not.have.class', 'selected');
  });
  it('selecting option should close the listbox', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-listbox').should('not.be.visible');
  });
  it('control value should match selected combobox value', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.display-control-value').realClick();
    cy.get('.display-control-value').should('have.text', 'bana');
  });
});

/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ComboboxService, HsiUiComboboxModule } from '@hsi/ui-components';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-combobox-simple-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit, A-E</p>
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
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option *ngFor="let option of options"
          ><span
            aria-hidden="true"
            class="material-symbols-outlined icon checkbox"
            selectedIcon
          >
            check_box
          </span>
          <span
            unselectedIcon
            aria-hidden="true"
            class="material-symbols-outlined icon checkbox"
          >
            check_box_outline_blank </span
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxSimpleMultiSelectTestComponent extends ComboboxBaseTestComponent {}

describe('Default multi-select combobox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSimpleMultiSelectTestComponent);
  });

  it('should not have accessibility violations', () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it('the current class is on the first selected option if there is one or on the 0th option once opened', () => {
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'current');
    cy.get('.hsi-ui-textbox').type('{esc}');
    cy.get('.hsi-ui-listbox').should('not.be.visible');
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'current');
    cy.get('.hsi-ui-textbox').type('{esc}');
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'current');
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.hsi-ui-textbox').type('{esc}');
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(0).should('have.class', 'current');
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).should('have.class', 'current');
    cy.get('.hsi-ui-textbox').type('{esc}');
    cy.get('.hsi-ui-textbox').realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'current');
  });
});

// Multi select combobox with dropdown options that get
// updated by interacting with outside button components
@Component({
  selector: 'hsi-ui-combobox-external-label-change',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <button (click)="disableApple()" class="disable-apple"
      >Disable apple, select banana</button
    >
    <button (click)="enableApple()" class="enable-apple-button"
      >Enable apple</button
    >
    <button (click)="selectCoconut()" class="select-coconut-button"
      >Select coconut</button
    >
    <button (click)="deselectCoconut()" class="deselect-coconut-button"
      >Deelect coconut</button
    >
    <button (click)="clearValue()" class="clear-value-button"
      >Clear value</button
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox
        [selectedCountLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
        <p boxLabel>Select a fruit, A-E</p>
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
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="(selected$ | async).includes(option.displayName)"
            [disabled]="(disabled$ | async).includes(option.displayName)"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
  providers: [ComboboxService],
})
class ComboboxExternalLabelChangeTestComponent {
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
  disabled = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  value = new BehaviorSubject<any>('Apples');
  value$ = this.value.asObservable();

  onSelection(event: string[]): void {
    this.value.next(event);
    this.selected.next(event);
  }

  disableApple() {
    this.addToArray(0, 'disabled');
  }

  enableApple() {
    this.removeFromArray(0, 'disabled');
  }

  selectCoconut() {
    this.addToArray(2, 'selected');
  }

  deselectCoconut() {
    this.removeFromArray(2, 'selected');
  }

  addToArray(i: number, array: 'selected' | 'disabled'): void {
    const curr = this[array].value;
    if (!curr.includes(this.options[i].displayName)) {
      this[array].next([...curr, this.options[i].displayName]);
    }
  }

  removeFromArray(i: number, array: 'selected' | 'disabled'): void {
    this[array].next(
      this[array].value.filter((x) => x !== this.options[i].displayName)
    );
  }

  clearValue() {
    this.value.next('');
  }
}

describe('ComboboxExternalLabelChangeTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalLabelChangeTestComponent);
  });

  it('should not have accessibility violations', () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it('the textbox has the correct label and it changes with change in input selected property', () => {
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '2 fruits selected');
    cy.get('.deselect-coconut-button').realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '1 fruit selected');
  });

  it('the combobox should not emit with external change in input selected property', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.select-coconut-button').click();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });

  it('the combobox should emit with clicking on options', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.hsi-ui-listbox-option').eq(4).realClick();
    cy.get('.combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.hsi-ui-textbox-label').should('have.text', '5 fruits selected');
  });

  it('combobox should emit the correct selection if there is a click after the selection status is changed programmatically', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').click();
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-listbox-option').eq(3).realClick();
    cy.get('.combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians'
    );
  });

  it('combobox should emit correctly if there is a click after the selection status is changed programmatically and the new value is the same as the old', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.clear-value-button').click();
    cy.get('.combobox-value').should('have.text', '');
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

// Multi select combobox with some disabled options
@Component({
  selector: 'hsi-ui-combobox-multi-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <button (click)="selectCoconut()" class="select-coconut-button"
      >Select coconut</button
    >
    <button (click)="deselectCoconut()" class="deselect-coconut-button"
      >Deelect coconut</button
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [useListboxLabelAsBoxPlaceholder]="true">
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
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
})
class ComboboxMultiSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {
  selected = new BehaviorSubject<string[]>([]);
  selected$ = this.selected.asObservable();

  selectCoconut() {
    this.addToArray(2, 'selected');
  }

  addToArray(i: number, array: 'selected' | 'disabled'): void {
    const curr = this[array].value;
    if (!curr.includes(this.options[i].displayName)) {
      this[array].next([...curr, this.options[i].displayName]);
    }
  }
}

describe('ComboboxMultiSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiSelectDisabledOptionsComponent);
  });

  it('should not have accessibility violations', () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it('can select non-disabled options', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(0).realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
  });
  it('cannot select disabled options / disabled options have correct class', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'disabled');
    cy.get('.hsi-ui-listbox-option').eq(4).should('have.class', 'disabled');
    cy.get('.hsi-ui-listbox-option').eq(2).realClick();
    cy.get('.hsi-ui-listbox-option').eq(4).realClick();
    cy.get('.hsi-ui-listbox-option').eq(2).should('not.have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(4).should('not.have.class', 'selected');
    cy.get('.combobox-value').should('not.have.text', 'Coconuts,Elderberries');
  });
  it('cannot change selected property of disabled options from the outside', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').eq(2).should('have.class', 'disabled');
    cy.get('.select-coconut-button').click();
    cy.get('.hsi-ui-listbox-option').eq(2).should('not.have.class', 'selected');
    cy.get('.combobox-value').should('not.have.text', 'Coconuts');
  });
});

@Component({
  selector: 'hsi-ui-ng-form-listbox-multi-test',
  template: `
    <p class="display-control-values">{{ control.value.join(', ') }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox [ngFormControl]="control" [isMultiSelect]="true">
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="control.value.includes(option.id)"
            [value]="option.id"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <button (click)="setSelectAll()" class="super-cool-button-pls-click-me"
      >Set all selected</button
    >
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [HsiUiComboboxModule, MatIconModule, CommonModule],
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
    cy.mount(NgFormListboxMultiTestComponent);
  });

  it('should not have accessibility violations', () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it('can make more than one selection', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.hsi-ui-listbox-option').first().should('have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(1).should('have.class', 'selected');
  });
  it('can unselect selections', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Bananas');
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.hsi-ui-textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.hsi-ui-listbox-option')
      .first()
      .should('not.have.class', 'selected');
    cy.get('.hsi-ui-listbox-option').eq(1).should('not.have.class', 'selected');
  });
  it('clicking outside the combobox should close the listbox', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-listbox').should('be.visible');
    cy.get('.display-control-values').realClick();
    cy.get('.hsi-ui-listbox').should('not.be.visible');
  });
  it('should have correct control values', () => {
    cy.get('.hsi-ui-textbox').click();
    cy.get('.hsi-ui-listbox-option').first().realClick();
    cy.get('.hsi-ui-listbox-option').eq(1).realClick();
    cy.get('.display-control-values').realClick();
    cy.get('.display-control-values').should('have.text', 'appl, bana');
  });
});

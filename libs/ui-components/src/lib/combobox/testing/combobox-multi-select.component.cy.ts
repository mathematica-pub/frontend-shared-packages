/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxService } from '../combobox.service';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// Multi select combobox with static label text
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
      <hsi-ui-textbox [displaySelected]="displaySelected">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [countSelectedOptionsLabel]="{ singular: 'fruit', plural: 'fruits' }"
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</hsi-ui-listbox-option>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSimpleMultiSelectTestComponent extends ComboboxBaseTestComponent {
  @Input() displaySelected = false;
}

describe('ComboboxMultiComponent', () => {
  describe('With a static textbox label', () => {
    beforeEach(() => {
      cy.mount(ComboboxSimpleMultiSelectTestComponent, {
        declarations: [ComboboxSimpleMultiSelectTestComponent],
        imports: [ComboboxModule, MatIconModule],
      });
    });
    it('the textbox has the correct label and it does not change with selections', () => {
      cy.get('.combobox-textbox').realClick();
      cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
      cy.get('.listbox-option').first().realClick();
      cy.get('.listbox-option').eq(1).realClick();
      cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
      cy.get('.outside-element').realClick();
      cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    });
  });
  describe('with a textbox label that displays selected options', () => {
    beforeEach(() => {
      cy.mount(ComboboxSimpleMultiSelectTestComponent, {
        declarations: [ComboboxSimpleMultiSelectTestComponent],
        imports: [ComboboxModule, MatIconModule],
        providers: [ComboboxService],
        componentProperties: { displaySelected: true },
      });
    });
    it('the textbox has the correct label and it changes with selections', () => {
      cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
      cy.get('.combobox-textbox').click();
      cy.get('.textbox-label').should('have.text', '0 fruits selected');
      cy.get('.listbox-option').eq(0).realClick();
      cy.get('.listbox-option').eq(1).realClick();
      cy.get('.textbox-label').should('have.text', '2 fruits selected');
      cy.get('.listbox-option').eq(1).realClick();
      cy.get('.textbox-label').should('have.text', '1 fruit selected');
    });
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
      <hsi-ui-listbox
        [countSelectedOptionsLabel]="{ singular: 'fruit', plural: 'fruits' }"
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select a fruit</span>
        </hsi-ui-listbox-label>
        <hsi-ui-listbox-option
          *ngFor="let option of options$ | async"
          [selected]="option.selected"
          [disabled]="option.disabled"
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <button
      (click)="disableAppleSelectBanana()"
      class="disable-apple-select-banana-button"
      >Disable apple, select banana</button
    >
    <button (click)="selectCoconut()" class="select-coconut-button"
      >Select coconut</button
    >
    <button (click)="enableApple()" class="enable-apple-button"
      >Enable apple</button
    >
    <button (click)="clearValue()" class="clear-value-button"
      >Clear value</button
    >
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxExternalLabelChangeTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl', selected: true, disabled: false },
    { displayName: 'Bananas', id: 'bana', selected: false, disabled: false },
    { displayName: 'Coconuts', id: 'coco', selected: false, disabled: false },
    { displayName: 'Durians', id: 'duri', selected: false, disabled: false },
    {
      displayName: 'Elderberries',
      id: 'elde',
      selected: false,
      disabled: false,
    },
  ];
  _options = new BehaviorSubject<any[]>(this.options);
  options$ = this._options.asObservable();
  selected = new BehaviorSubject<boolean>(false);
  selected$ = this.selected.asObservable();
  value = new BehaviorSubject<any>('Apples');
  value$ = this.value.asObservable();

  onSelection(event: any): void {
    this.value.next(event);
  }

  disableAppleSelectBanana() {
    const newOptions = cloneDeep(this._options.value);
    newOptions[0].disabled = true;
    newOptions[0].selected = false;
    newOptions[1].selected = true;
    this._options.next(newOptions);
  }

  enableApple() {
    const newOptions = cloneDeep(this._options.value);
    newOptions[0].disabled = false;
    this._options.next(newOptions);
  }

  selectCoconut() {
    const newOptions = cloneDeep(this._options.value);
    newOptions[2].selected = true;
    this._options.next(newOptions);
  }

  clearValue() {
    this.value.next('');
  }
}

describe('ComboboxExternalLabelChangeTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalLabelChangeTestComponent, {
      declarations: [ComboboxExternalLabelChangeTestComponent],
      imports: [ComboboxModule, MatIconModule],
      providers: [ComboboxService],
    });
  });

  it('the textbox has the correct label and it changes with change in input property', () => {
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.disable-apple-select-banana-button').click();
    cy.get('.select-coconut-button').click();
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
  });

  it('the combobox should not emit with external change in input property', () => {
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.disable-apple-select-banana-button').click();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });

  it('the combobox should emit with clicking on options', () => {
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.listbox-option').eq(4).realClick();
    cy.get('.combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.textbox-label').should('have.text', '5 fruits selected');
  });

  it('combobox should emit correctly if there is a click after the selection status is changed programmatically', () => {
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.disable-apple-select-banana-button').click();
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.combobox-value').should('have.text', 'Bananas,Coconuts,Durians');
  });

  it('combobox should emit correctly if there is a click after the selection status is changed programmatically and the new value is the same as the old', () => {
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.disable-apple-select-banana-button').click();
    cy.get('.enable-apple-button').click();
    cy.get('.clear-value-button').click();
    cy.get('.combobox-value').should('have.text', '');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
  });
});

// Multi select combobox with some disabled options
@Component({
  selector: 'hsi-ui-combobox-multi-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [labelIsBoxPlaceholder]="true"
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
})
class ComboboxMultiSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {}

describe('ComboboxMultiSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiSelectDisabledOptionsComponent, {
      declarations: [ComboboxMultiSelectDisabledOptionsComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('can select non-disabled options', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
  });
  it('cannot select disabled options', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(4).realClick();
    cy.get('.combobox-value').should('not.have.text', 'Coconuts,Elderberries');
  });
});

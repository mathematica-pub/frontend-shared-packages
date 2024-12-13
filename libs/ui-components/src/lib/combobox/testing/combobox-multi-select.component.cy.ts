/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
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
  selector: 'hsi-ui-combobox-static-label-test',
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
class ComboboxStaticLabelTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxMultiComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxStaticLabelTestComponent, {
      declarations: [ComboboxStaticLabelTestComponent],
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
  it('accessibility: focus the textbox on tab', () => {
    cy.realPress('Tab');
    cy.get('.combobox-textbox').should('be.focused');
  });
  it('accessibility: opens the combobox on enter when focused', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.combobox-listbox').should('be.visible');
  });
  it('accessibility: closes combobox with escape key', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.combobox-listbox').should('be.visible');
    cy.get('.combobox-textbox').type('{esc}');
    cy.get('.combobox-listbox').should('not.be.visible');
  });
  it('accessibility: highlights the first option on enter', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.listbox-option').first().should('have.class', 'current');
  });
  it('accessibility: highlights the first option on down button', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{downArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
  });
  it('accessibility: selects and unselects options using the keyboard and updates the value', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.combobox-textbox').type('{downarrow}{enter}');
    cy.get('.combobox-textbox').type('{downarrow}{downarrow}{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas,Durians');
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas');
  });
  it('accessibility: focus remains on first option when up arrow is pressed', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type('{enter}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.combobox-textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
  });
  it('accessibility: focus remains on last option when down arrow is pressed', () => {
    cy.get('.combobox-textbox').focus();
    cy.get('.combobox-textbox').type(
      '{enter}{downArrow}{downArrow}{downArrow}{downArrow}'
    );
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
    cy.get('.combobox-textbox').type('{downArrow}');
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
  });
});

// Multi select combobox with dynamic label that updates on option selection
@Component({
  selector: 'hsi-ui-combobox-selected-options-count-label-test',
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
class ComboboxSelectedOptionsCountLabelTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectedOptionsCountLabelTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectedOptionsCountLabelTestComponent, {
      declarations: [ComboboxSelectedOptionsCountLabelTestComponent],
      imports: [ComboboxModule, MatIconModule],
      providers: [ComboboxService],
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

// Multi select combobox with dynamic label that uses groups
@Component({
  selector: 'hsi-ui-combobox-grouped-multi-test',
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
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 1</span>
          </hsi-ui-listbox-label>
          <hsi-ui-listbox-option *ngFor="let option of options1">{{
            option.displayName
          }}</hsi-ui-listbox-option>
        </hsi-ui-listbox-group>
        <hsi-ui-listbox-group>
          <hsi-ui-listbox-label>
            <span>Group 2</span>
          </hsi-ui-listbox-label>
          <hsi-ui-listbox-option *ngFor="let option of options2">{{
            option.displayName
          }}</hsi-ui-listbox-option>
        </hsi-ui-listbox-group>
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxGroupedMultiTestComponent {
  options1 = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  options2 = [
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(event: any): void {
    this.value.next(event);
  }
}

describe('ComboboxGroupedMultiTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedMultiTestComponent, {
      declarations: [ComboboxGroupedMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
      providers: [ComboboxService],
    });
  });

  it('can select from multiple groups', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', '0 fruits selected');
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

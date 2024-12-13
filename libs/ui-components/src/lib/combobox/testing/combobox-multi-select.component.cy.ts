/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
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
      <hsi-ui-textbox [dynamicLabel]="false">
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
        <hsi-ui-listbox-option *ngFor="let option of options"
          ><span class="material-symbols-outlined icon checkbox" selectedIcon>
            check_box
          </span>
          <span unselectedIcon class="material-symbols-outlined icon checkbox">
            check_box_outline_blank </span
          >{{ option.displayName }}</hsi-ui-listbox-option
        >
      </hsi-ui-listbox>
    </hsi-ui-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSimpleMultiSelectTestComponent extends ComboboxBaseTestComponent {}

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

    it('the current class is on the first selected option if there is one or on the 0th option when opened', () => {
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').first().should('have.class', 'current');
      cy.get('.combobox-textbox').type('{esc}');
      cy.get('.combobox-listbox').should('not.be.visible');
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').eq(2).realClick();
      cy.get('.listbox-option').eq(2).should('have.class', 'selected');
      cy.get('.listbox-option').eq(2).should('have.class', 'current');
      cy.get('.combobox-textbox').type('{esc}');
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').eq(2).should('have.class', 'current');
      cy.get('.listbox-option').eq(2).realClick();
      cy.get('.combobox-textbox').type('{esc}');
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').eq(0).should('have.class', 'current');
      cy.get('.listbox-option').eq(2).realClick();
      cy.get('.listbox-option').eq(3).realClick();
      cy.get('.listbox-option').eq(3).should('have.class', 'current');
      cy.get('.combobox-textbox').type('{esc}');
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').eq(2).should('have.class', 'current');
    });
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
      <hsi-ui-textbox
        [countSelectedLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
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
class ComboboxSelectedOptionsCountLabelTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectedOptionsCountLabelTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectedOptionsCountLabelTestComponent, {
      declarations: [ComboboxSelectedOptionsCountLabelTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  describe('with a textbox label that displays counts of selected options', () => {
    beforeEach(() => {
      cy.mount(ComboboxSelectedOptionsCountLabelTestComponent, {
        declarations: [ComboboxSelectedOptionsCountLabelTestComponent],
        imports: [ComboboxModule, MatIconModule],
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
        [countSelectedLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
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
    cy.mount(ComboboxExternalLabelChangeTestComponent, {
      declarations: [ComboboxExternalLabelChangeTestComponent],
      imports: [ComboboxModule, MatIconModule],
      providers: [ComboboxService],
    });
  });

  it('the textbox has the correct label and it changes with change in input selected property', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').realClick();
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
    cy.get('.deselect-coconut-button').realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
  });

  it('the combobox should not emit with external change in input selected property', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.select-coconut-button').click();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });

  it('the combobox should emit with clicking on options', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
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

  it('combobox should emit the correct selection if there is a click after the selection status is changed programmatically', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').click();
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians'
    );
  });

  it('combobox should emit correctly if there is a click after the selection status is changed programmatically and the new value is the same as the old', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.clear-value-button').click();
    cy.get('.combobox-value').should('have.text', '');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(2).realClick();
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
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Fruits</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [useListboxLabelAsBoxPlaceholder]="true">
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
    cy.get('.listbox-option').eq(0).realClick();
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
      <hsi-ui-textbox
        [countSelectedLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
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

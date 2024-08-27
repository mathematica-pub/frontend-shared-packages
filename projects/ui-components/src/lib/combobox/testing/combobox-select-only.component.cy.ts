/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxService } from '../combobox.service';

class ComboboxBaseTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(event: any): void {
    this.value.next(event);
  }
}

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
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
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
  selector: 'app-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </app-textbox>
      <app-listbox
        [labelIsBoxPlaceholder]="true"
        (valueChanges)="onSelection($event)"
      >
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</app-listbox-option>
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectOnlyComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleTestComponent, {
      declarations: [ComboboxSingleTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  describe('click behavior after load', () => {
    it('should not emit a value on load', () => {
      cy.get('.combobox-value').should('have.text', '');
    });
    it('listbox should not be visible on load', () => {
      cy.get('.combobox-listbox').should('not.be.visible');
    });
    it('should open the combobox on click', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.combobox-listbox').should('be.visible');
    });
    it('should emit the correct value on option click', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.combobox-value').should('have.text', 'Apples');
    });
    it('listbox should close on option click', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().click();
      cy.get('.combobox-listbox').should('not.be.visible');
    });
    it('selected option should be highlighted on listbox reopen', () => {
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').first().realClick();
      cy.get('.combobox-textbox').realClick();
      cy.get('.listbox-option').first().should('have.class', 'current');
    });
    it('clicking outside the combobox should close the listbox', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.combobox-listbox').should('not.be.visible');
    });
  });
  describe('label options', () => {
    it('should display the listbox label in the textbox on load', () => {
      cy.get('.textbox-label').should('have.text', 'Select a fruit');
    });
    it('should display the selected option in the textbox after selection', () => {
      cy.get('.combobox-textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.textbox-label').should('have.text', 'Apples');
    });
  });
  describe('keyboard behavior', () => {
    beforeEach(() => {
      cy.get('.combobox-textbox').trigger('focus');
    });
    it('opens the listbox on enter and first option is current, then arrows through', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: 'Enter' });
      cy.get('.combobox-listbox').should('be.visible');
      cy.get('.listbox-option').first().should('have.class', 'current');
    });
    it('opens the listbox on space', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: ' ' });
      cy.get('.combobox-listbox').should('be.visible');
    });
    it('opens the listbox on down arrow', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: 'ArrowDown' });
      cy.get('.combobox-listbox').should('be.visible');
    });
    it('opens the listbox on up arrow', () => {
      cy.get('.combobox-textbox').trigger('keydown', { key: 'ArrowUp' });
      cy.get('.combobox-listbox').should('be.visible');
    });
    // TODO: get typing chars to work
  });
});

@Component({
  selector: 'app-combobox-select-from-outside-single-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </app-textbox>
      <app-listbox
        [labelIsBoxPlaceholder]="true"
        (valueChanges)="onSelection($event)"
      >
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option
          *ngFor="let option of options; let i = index"
          [selected]="i === 2"
          >{{ option.displayName }}</app-listbox-option
        >
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxSelectFromOutsideSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectFromOutsideSingleComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectFromOutsideSingleTestComponent, {
      declarations: [ComboboxSelectFromOutsideSingleTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('should display the selected option in the textbox on load', () => {
    cy.wait(1000);
    cy.get('.textbox-label').should('have.text', 'Coconuts');
  });
  it('can switch the selected option on click', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

@Component({
  selector: 'app-combobox-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [displaySelected]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </app-textbox>
      <app-listbox
        [labelIsBoxPlaceholder]="true"
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</app-listbox-option>
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboxMultiSelectOnlyTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxMultiComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiSelectOnlyTestComponent, {
      declarations: [ComboboxMultiSelectOnlyTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('can make more than one selection', () => {
    cy.get('.combobox-textbox').realClick();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.listbox-option').first().should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
  });
  it('clicking outside the combobox should close the listbox', () => {
    cy.get('.combobox-textbox').click();
    cy.get('.combobox-listbox').should('be.visible');
    cy.get('.outside-element').realClick();
    cy.get('.combobox-listbox').should('not.be.visible');
  });
  //TODO: test keyboard navigation
});

@Component({
  selector: 'app-combobox-static-label-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox>
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</app-listbox-option>
      </app-listbox>
    </app-combobox>
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
});

@Component({
  selector: 'app-combobox-selected-options-count-label-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [displaySelected]="true">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </app-textbox>
      <app-listbox
        [countSelectedOptionsLabel]="{ singular: 'fruit', plural: 'fruits' }"
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option *ngFor="let option of options">{{
          option.displayName
        }}</app-listbox-option>
      </app-listbox>
    </app-combobox>
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

@Component({
  selector: 'app-combobox-external-label-change',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [displaySelected]="true">
        <p boxLabel>Select a fruit, A-E</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </app-textbox>
      <app-listbox
        [countSelectedOptionsLabel]="{ singular: 'fruit', plural: 'fruits' }"
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option
          *ngFor="let option of options$ | async"
          [selected]="option.selected"
          [disabled]="option.disabled"
          >{{ option.displayName }}</app-listbox-option
        >
      </app-listbox>
    </app-combobox>
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

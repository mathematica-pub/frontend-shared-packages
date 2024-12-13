/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject, startWith } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

@Component({
  selector: 'hsi-ui-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
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
class ComboboxStaticLabelTestComponent extends ComboboxBaseTestComponent {}

describe('Textbox with a static label', () => {
  beforeEach(() => {
    cy.mount(ComboboxStaticLabelTestComponent, {
      declarations: [ComboboxStaticLabelTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label does not change with a selection', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

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
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox (valueChanges)="onSelection($event)">
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
class ComboboxDynamicLabelTestComponent extends ComboboxBaseTestComponent {}

describe('Single-select combobox with a dynamic label', () => {
  beforeEach(() => {
    cy.mount(ComboboxDynamicLabelTestComponent, {
      declarations: [ComboboxDynamicLabelTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected value afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.combobox-value').should('have.text', 'Bananas');
  });
});

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
      <hsi-ui-textbox>
        <p boxLabel>Select a fruit</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
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
class ComboboxDynamicLabelMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a dynamic label', () => {
  beforeEach(() => {
    cy.mount(ComboboxDynamicLabelMultiTestComponent, {
      declarations: [ComboboxDynamicLabelMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected value afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit');
    cy.get('.combobox-textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

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
          <span>Select fruits</span>
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
class ComboboListboxPlaceholderMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a listboxLabel as placeholder', () => {
  beforeEach(() => {
    cy.mount(ComboboListboxPlaceholderMultiTestComponent, {
      declarations: [ComboboListboxPlaceholderMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected value afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.combobox-value').should('have.text', '');
  });
});

// Test behavior if user provides both a boxLabel and listboxLabel as placeholder
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
      <hsi-ui-textbox [useListboxLabelAsBoxPlaceholder]="true">
        <p boxLabel>Select a fruit</p>
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select fruits</span>
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
class ComboboListboxPlaceholderWithBoxLabelMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a boxLabel and listboxLabel as placeholder', () => {
  beforeEach(() => {
    cy.mount(ComboboListboxPlaceholderWithBoxLabelMultiTestComponent, {
      declarations: [ComboboListboxPlaceholderWithBoxLabelMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected value afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.combobox-value').should('have.text', '');
  });
});

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
      <hsi-ui-textbox
        [useListboxLabelAsBoxPlaceholder]="true"
        [countSelectedLabel]="{ plural: 'fruits', singular: 'fruit' }"
      >
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select fruits</span>
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
class ComboboCountLabelMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a count label and a listboxLabel as placeholder', () => {
  beforeEach(() => {
    cy.mount(ComboboCountLabelMultiTestComponent, {
      declarations: [ComboboCountLabelMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', '0 fruits selected');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', '0 fruits selected');
  });
});

// Multi select combobox with dynamic label that uses groups
@Component({
  selector: 'hsi-ui-combobox-grouped-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Select a fruit, A-E</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox
        [countSelectedLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
        <p boxLabel>Select a fruit</p>
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
    });
  });

  it('can select from multiple groups', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit');
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
      <hsi-ui-textbox
        [useListboxLabelAsBoxPlaceholder]="true"
        [customTextboxLabel]="customLabel"
      >
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select fruits</span>
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
class ComboboCustomLabelMultiTestComponent extends ComboboxBaseTestComponent {
  customLabel = (options: ListboxOptionComponent[]) => {
    if (options.length === 0) {
      return 'You need to select something';
    } else if (options.length === 1) {
      return `Only 1 fruit selected`;
    } else {
      return `Yay ${options.length} fruits selected`;
    }
  };
}

describe('Multi-select combobox with a custom label and a listboxLabel as placeholder', () => {
  beforeEach(() => {
    cy.mount(ComboboCustomLabelMultiTestComponent, {
      declarations: [ComboboCustomLabelMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select fruits');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should(
      'have.text',
      'You need to select something'
    );
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Only 1 fruit selected');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Yay 2 fruits selected');
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should(
      'have.text',
      'You need to select something'
    );
  });
});

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
          <span>Select fruits</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id; let i = $index) {
          <hsi-ui-listbox-option [selected]="i === 2 || i === 4">{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboInitialSelectionsMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a dynamic label and initial selections', () => {
  beforeEach(() => {
    cy.mount(ComboboInitialSelectionsMultiTestComponent, {
      declarations: [ComboboInitialSelectionsMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Coconuts, Elderberries');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', 'Coconuts, Elderberries');
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.textbox-label').should('have.text', 'Elderberries');
  });
});

@Component({
  selector: 'hsi-ui-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ formControlValue$ | async }}</p>
    <hsi-ui-combobox class="fruits-dropdown">
      <hsi-ui-combobox-label>
        <span>Select a fruit, A-E</span>
      </hsi-ui-combobox-label>
      <hsi-ui-textbox [useListboxLabelAsBoxPlaceholder]="true">
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox [isMultiSelect]="true" [formControl]="formControl">
        <hsi-ui-listbox-label>
          <span>Select fruits</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id) {
          <hsi-ui-listbox-option
            [selected]="formControl.value.includes(option.displayName)"
            >{{ option.displayName }}</hsi-ui-listbox-option
          >
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboInitialSelectionsNgFormMultiTestComponent extends ComboboxBaseTestComponent {
  formControl = new FormControl(['Coconuts', 'Elderberries']);
  formControlValue$ = this.formControl.valueChanges.pipe(
    startWith(this.formControl.value)
  );
}

describe('Multi-select combobox with a dynamic label and initial selections', () => {
  beforeEach(() => {
    cy.mount(ComboboInitialSelectionsNgFormMultiTestComponent, {
      declarations: [ComboboInitialSelectionsNgFormMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Coconuts, Elderberries');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', 'Coconuts, Elderberries');
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.textbox-label').should('have.text', 'Elderberries');
  });
});

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
      <hsi-ui-textbox
        [useListboxLabelAsBoxPlaceholder]="true"
        [countSelectedLabel]="{ plural: 'fruits', singular: 'fruit' }"
      >
        <span class="material-symbols-outlined expand-more" boxIcon>
          expand_more
        </span>
      </hsi-ui-textbox>
      <hsi-ui-listbox
        [isMultiSelect]="true"
        (valueChanges)="onSelection($event)"
      >
        <hsi-ui-listbox-label>
          <span>Select fruits</span>
        </hsi-ui-listbox-label>
        @for (option of options; track option.id; let i = $index) {
          <hsi-ui-listbox-option [selected]="i === 2 || i === 4">{{
            option.displayName
          }}</hsi-ui-listbox-option>
        }
      </hsi-ui-listbox>
    </hsi-ui-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
})
class ComboboInitialSelectionsCountMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a count label and initial selections', () => {
  beforeEach(() => {
    cy.mount(ComboboInitialSelectionsCountMultiTestComponent, {
      declarations: [ComboboInitialSelectionsCountMultiTestComponent],
      imports: [ComboboxModule, MatIconModule],
    });
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
    cy.get('.combobox-textbox').click();
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
  });
});

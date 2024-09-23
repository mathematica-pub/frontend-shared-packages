/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxService } from '../combobox.service';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ComboboxServiceStub } from '../testing/combobox.service.stub';
import { ListboxFilteringServiceStub } from '../testing/listbox-filtering.service.stub';
import { ListboxScrollServiceStub } from '../testing/listbox-scroll.service.stub';
import { NgFormListboxMultiComponent } from './ng-form-listbox-multi.component';

describe('NgFormListboxMultiComponent', () => {
  let component: NgFormListboxMultiComponent<any>;
  let fixture: ComponentFixture<NgFormListboxMultiComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgFormListboxMultiComponent],
      providers: [
        {
          provide: ComboboxService,
          useValue: new ComboboxServiceStub(),
        },
        {
          provide: ListboxFilteringService,
          useValue: new ListboxFilteringServiceStub(),
        },
        {
          provide: ListboxScrollService,
          useValue: new ListboxScrollServiceStub(),
        },
      ],
    });
    fixture = TestBed.createComponent(NgFormListboxMultiComponent);
    component = fixture.componentInstance;
  });

  describe('emitValue', () => {
    beforeEach(() => {
      component.control = {
        setValue: jasmine.createSpy('setValue'),
      } as any;
    });

    it('calls control.setValue with the correct value', () => {
      component.selectedOptions.next([{ value: '1' }, { value: '2' }] as any);
      component.emitValue();
      expect(component.control.setValue).toHaveBeenCalledWith(['1', '2']);
    });
  });
});

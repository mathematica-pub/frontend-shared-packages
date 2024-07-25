/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxService } from '../combobox.service';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ComboboxServiceStub } from '../testing/combobox.service.stub';
import { ListboxFilteringServiceStub } from '../testing/listbox-filtering.service.stub';
import { ListboxScrollServiceStub } from '../testing/listbox-scroll.service.stub';
import { NgFormListboxSingleComponent } from './ng-form-listbox-single.component';

describe('NgFormListboxSingleComponent', () => {
  let component: NgFormListboxSingleComponent<any>;
  let fixture: ComponentFixture<NgFormListboxSingleComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgFormListboxSingleComponent],
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
    }).compileComponents();
    fixture = TestBed.createComponent(NgFormListboxSingleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

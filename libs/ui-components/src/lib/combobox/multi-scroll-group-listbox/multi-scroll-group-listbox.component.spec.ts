/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxService } from '../combobox.service';
import { ListboxFilteringService } from '../listbox-filtering/listbox-filtering.service';
import { ListboxScrollService } from '../listbox-scroll/listbox-scroll.service';
import { ComboboxMainServiceStub } from '../testing/main.service.stub';
import { MultiFiltersListboxComponent } from './multi-scroll-group-listbox.component';

describe('MultiFiltersListboxComponent', () => {
  let component: MultiFiltersListboxComponent;
  let fixture: ComponentFixture<MultiFiltersListboxComponent>;
  let mainServiceStub: ComboboxMainServiceStub;

  beforeEach(() => {
    mainServiceStub = new ComboboxMainServiceStub();
    TestBed.configureTestingModule({
      declarations: [MultiFiltersListboxComponent],
      providers: [
        {
          provide: ComboboxService,
          useValue: mainServiceStub.comboboxServiceStub,
        },
        {
          provide: ListboxFilteringService,
          useValue: mainServiceStub.listboxFilteringServiceStub,
        },
        {
          provide: ListboxScrollService,
          useValue: mainServiceStub.listboxScrollServiceStub,
        },
      ],
    });
    fixture = TestBed.createComponent(MultiFiltersListboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

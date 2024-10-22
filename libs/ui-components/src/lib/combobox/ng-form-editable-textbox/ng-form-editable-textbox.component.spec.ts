import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxService } from '../combobox.service';
import { ComboboxMainServiceStub } from '../testing/main.service.stub';
import { NgFormEditableTextboxComponent } from './ng-form-editable-textbox.component';

describe('NgFormTextboxInputComponent', () => {
  let component: NgFormEditableTextboxComponent;
  let fixture: ComponentFixture<NgFormEditableTextboxComponent>;
  let mainServiceStub: ComboboxMainServiceStub;

  beforeEach(() => {
    mainServiceStub = new ComboboxMainServiceStub();
    TestBed.configureTestingModule({
      declarations: [NgFormEditableTextboxComponent],
      providers: [
        {
          provide: ComboboxService,
          useValue: mainServiceStub.comboboxServiceStub,
        },
      ],
    });
    fixture = TestBed.createComponent(NgFormEditableTextboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxService } from '../combobox.service';
import { ComboboxMainServiceStub } from '../testing/main.service.stub';
import { EditableTextboxComponent } from './editable-textbox.component';

describe('EditableTextboxComponent', () => {
  let component: EditableTextboxComponent;
  let fixture: ComponentFixture<EditableTextboxComponent>;
  let mainServiceStub: ComboboxMainServiceStub;

  beforeEach(() => {
    mainServiceStub = new ComboboxMainServiceStub();
    TestBed.configureTestingModule({
      imports: [EditableTextboxComponent],
      providers: [
        {
          provide: ComboboxService,
          useValue: mainServiceStub.comboboxServiceStub,
        },
      ],
    });
    fixture = TestBed.createComponent(EditableTextboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

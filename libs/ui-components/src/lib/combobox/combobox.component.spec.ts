/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ComboboxComponent } from './combobox.component';
import { ComboboxService } from './combobox.service';
import { ComboboxMainServiceStub } from './testing/stubs/main.service.stub';

@Component({
  selector: 'hsi-ui-test-cmp',
  template: `<app-combobox
    ><app-combobox-label></app-combobox-label
  ></app-combobox>`,
})
class TestWrapperComponent {}

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;
  let mainServiceStub: ComboboxMainServiceStub;

  beforeEach(() => {
    mainServiceStub = new ComboboxMainServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        TestWrapperComponent,
        ComboboxComponent,
        ComboboxLabelComponent,
      ],
    })
      .overrideComponent(ComboboxComponent, {
        set: {
          providers: [
            {
              provide: ComboboxService,
              useValue: mainServiceStub.comboboxServiceStub,
            },
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ComboboxComponent);
    component = fixture.componentInstance;
  });

  describe('ngAfterViewInit', () => {
    it('should call setComboboxElRef with comboboxElRef', () => {
      component.comboboxElRef = 'comboboxElRef' as any;
      component.ngAfterViewInit();
      expect(
        mainServiceStub.comboboxServiceStub.setComboboxElRef
      ).toHaveBeenCalledOnceWith('comboboxElRef' as any);
    });
  });
});

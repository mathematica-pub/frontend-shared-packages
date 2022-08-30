/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { ChartComponentStub } from '../testing/stubs/chart.component.stub';
import { InputEventDirectiveStub } from '../testing/stubs/input-event.stub';

describe('ClickEvent', () => {
  let directive: InputEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InputEventDirectiveStub,
        Renderer2,
        {
          provide: ChartComponent,
          useValue: ChartComponentStub,
        },
      ],
    });
    directive = TestBed.inject(InputEventDirectiveStub);
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(directive, 'handleNewEvent');
      directive.inputEvent$ = of([0]);
    });
    it('calls handleNewEvent with the correct value()', () => {
      directive.ngOnInit();
      expect(directive.handleNewEvent).toHaveBeenCalledOnceWith([0]);
    });
  });
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InputEventDirectiveStub } from '../testing/stubs/input-event.directive.stub';

describe('InputEvent', () => {
  let directive: InputEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputEventDirectiveStub, Renderer2],
    });
    directive = TestBed.inject(InputEventDirectiveStub);
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(directive, 'handleNewEvent');
      directive.inputEvent$ = of([0]);
    });
    it('calls handleNewEvent with the correct value() if inputEvent$ is defined', () => {
      TestBed.runInInjectionContext(() => {
        directive.ngOnInit();
      });
      expect(directive.handleNewEvent).toHaveBeenCalledOnceWith([0]);
    });
    it('does not call handleNewEvent() if inputEvent$ is undefined', () => {
      directive.inputEvent$ = undefined;
      TestBed.runInInjectionContext(() => {
        directive.ngOnInit();
      });
      expect(directive.handleNewEvent).toHaveBeenCalledTimes(0);
    });
  });
});

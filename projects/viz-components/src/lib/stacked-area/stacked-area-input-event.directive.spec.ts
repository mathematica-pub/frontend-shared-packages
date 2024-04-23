/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { StackedAreaComponentStub } from '../testing/stubs/stacked-area.component.stub';
import { StackedAreaInputEventDirective } from './stacked-area-input-event.directive';
import { STACKED_AREA, StackedAreaComponent } from './stacked-area.component';

describe('StackedAreaInputDirective', () => {
  let directive: StackedAreaInputEventDirective<
    any,
    string,
    StackedAreaComponent<any, string>
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StackedAreaInputEventDirective,
        {
          provide: STACKED_AREA,
          useValue: StackedAreaComponentStub,
        },
      ],
    });
    directive = TestBed.inject(
      StackedAreaInputEventDirective<
        any,
        string,
        StackedAreaComponent<any, string>
      >
    );
  });

  describe('handleNewEvent', () => {
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let removeASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
      applyASpy = jasmine.createSpy('applyEffect');
      removeASpy = jasmine.createSpy('removeEffect');
      applyBSpy = jasmine.createSpy('applyEffect');
      removeBSpy = jasmine.createSpy('removeEffect');
      effectA = {
        applyEffect: applyASpy,
        removeEffect: removeASpy,
      };
      effectB = {
        applyEffect: applyBSpy,
        removeEffect: removeBSpy,
      };
      directive.effects = [effectA, effectB];
    });
    it('calls apply effect with the correct values if inputEvent is truthy', () => {
      directive.handleNewEvent('hello');
      expect(applyASpy).toHaveBeenCalledWith(directive, 'hello');
      expect(applyBSpy).toHaveBeenCalledWith(directive, 'hello');
    });
    it('does not call remove effect if inputEvent is truthy', () => {
      directive.handleNewEvent('hello');
      expect(removeASpy).not.toHaveBeenCalled();
      expect(removeBSpy).not.toHaveBeenCalled();
    });
    it('calls remove effect with the correct values if inputEvent is falsy', () => {
      directive.handleNewEvent(null);
      expect(removeASpy).toHaveBeenCalledWith(directive, null);
      expect(removeBSpy).toHaveBeenCalledWith(directive, null);
    });
    it('does not call apply effect if inputEvent is falsy', () => {
      directive.handleNewEvent(null);
      expect(applyASpy).not.toHaveBeenCalled();
      expect(applyBSpy).not.toHaveBeenCalled();
    });
  });
});

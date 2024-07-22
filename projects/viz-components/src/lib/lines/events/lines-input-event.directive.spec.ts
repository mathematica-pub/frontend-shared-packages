/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { LinesComponentStub } from '../../testing/stubs/lines.component.stub';
import { LINES, LinesComponent } from '../lines.component';
import { LinesInputEventDirective } from './lines-input-event.directive';

describe('LinesInputDirective', () => {
  let directive: LinesInputEventDirective<any, LinesComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinesInputEventDirective,
        {
          provide: LINES,
          useValue: LinesComponentStub,
        },
      ],
    });
    directive = TestBed.inject(LinesInputEventDirective);
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

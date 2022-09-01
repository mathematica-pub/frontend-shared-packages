import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LinesComponentStub } from '../testing/stubs/lines.component.stub';
import { LinesHoverEventDirective } from './lines-hover-event.directive';
import { LINES } from './lines.component';

describe('LinesHoverEventDirective', () => {
  let directive: LinesHoverEventDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinesHoverEventDirective,
        Renderer2,
        {
          provide: LINES,
          useValue: LinesComponentStub,
        },
      ],
    });
    directive = TestBed.inject(LinesHoverEventDirective);
    directive.unlistenTouchStart = () => {
      return;
    };
    directive.unlistenPointerEnter = () => {
      return;
    };
  });

  describe('chartPointerEnter()', () => {
    let event: any;
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    beforeEach(() => {
      event = 'event';
      applyASpy = jasmine.createSpy('applyEffect');
      applyBSpy = jasmine.createSpy('applyEffect');
      effectA = {
        applyEffect: applyASpy,
      };
      effectB = {
        applyEffect: applyBSpy,
      };
      directive.effects = [effectA, effectB] as any;
    });
    it('calls apply effect with the correct value', () => {
      directive.chartPointerEnter(event);
      expect(applyASpy).toHaveBeenCalledWith(directive);
      expect(applyBSpy).toHaveBeenCalledWith(directive);
    });
  });

  describe('chartPointerLeave()', () => {
    let event: any;
    let effectA: any;
    let removeASpy: jasmine.Spy;
    let effectB: any;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
      event = 'event';
      removeASpy = jasmine.createSpy('removeEffect');
      removeBSpy = jasmine.createSpy('removeEffect');
      effectA = {
        removeEffect: removeASpy,
      };
      effectB = {
        removeEffect: removeBSpy,
      };
      directive.effects = [effectA, effectB] as any;
    });
    it('calls remove effect with the correct value', () => {
      directive.chartPointerLeave(event);
      expect(removeASpy).toHaveBeenCalledWith(directive);
      expect(removeBSpy).toHaveBeenCalledWith(directive);
    });
  });
});

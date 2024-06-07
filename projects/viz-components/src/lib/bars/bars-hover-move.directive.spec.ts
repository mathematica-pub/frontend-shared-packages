/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BarsComponentStub } from '../testing/stubs/bars.component.stub';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BARS, BarsComponent } from './bars.component';

describe('BarsHoverMoveDirective', () => {
  let directive: BarsHoverMoveDirective<
    any,
    string,
    BarsComponent<any, string>
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BarsHoverMoveDirective,
        Renderer2,
        {
          provide: BARS,
          useValue: BarsComponentStub,
        },
      ],
    });
    directive = TestBed.inject(
      BarsHoverMoveDirective<any, string, BarsComponent<any, string>>
    );
    directive.unlistenTouchStart = [
      () => {
        return;
      },
    ];
    directive.unlistenPointerEnter = [
      () => {
        return;
      },
    ];
    directive.unlistenPointerMove = () => {
      return;
    };
    directive.unlistenPointerLeave = () => {
      return;
    };
  });

  describe('elementPointerEnter', () => {
    let event;
    let el;
    beforeEach(() => {
      el = document.createElement('div');
      el.id = 'bar-4';
      event = {
        target: el,
      };
      spyOn(directive, 'getBarIndex').and.returnValue(4);
    });
    it('sets barIndex to the correct value', () => {
      directive.onElementPointerEnter(event);
      expect(directive.barIndex).toEqual(4);
    });
    it('sets elRef to the correct value', () => {
      directive.onElementPointerEnter(event);
      expect(directive.elRef.nativeElement).toEqual(el);
    });
  });

  describe('elementPointerMove()', () => {
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let removeASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    let removeBSpy: jasmine.Spy;
    let event: any;
    beforeEach(() => {
      spyOn(directive, 'getPointerValuesArray').and.returnValue([1, 2]);
      event = 'event';
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
    it('calls getPointerValuesArray once', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.getPointerValuesArray).toHaveBeenCalledOnceWith(
        event as any
      );
    });
    it('sets pointerX to the correct value', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.pointerX).toEqual(1);
    });
    it('sets pointerY to the correct value', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.pointerY).toEqual(2);
    });
    it('calls apply effect on each effect in effects array if effects exist', () => {
      directive.onElementPointerMove(event as any);
      expect(applyASpy).toHaveBeenCalledOnceWith(directive);
      expect(applyBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('does not call apply effect on each effect in effects array if effects do not exist', () => {
      directive.effects = undefined;
      directive.onElementPointerMove(event as any);
      expect(applyASpy).not.toHaveBeenCalled();
      expect(applyBSpy).not.toHaveBeenCalled();
    });
  });

  describe('elementPointerLeave', () => {
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
    it('calls remove effect on each effect in effects array', () => {
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledOnceWith(directive);
      expect(removeBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('does not call remove effect on each effect in effects array if effects do not exist', () => {
      directive.effects = undefined;
      directive.onElementPointerLeave();
      expect(removeASpy).not.toHaveBeenCalled();
      expect(removeBSpy).not.toHaveBeenCalled();
    });
    it('sets barIndex to undefined', () => {
      directive.barIndex = 1;
      directive.onElementPointerLeave();
      expect(directive.barIndex).toBeUndefined();
    });
    it('sets elRef to undefined', () => {
      directive.elRef = 'elRef' as any;
      directive.onElementPointerLeave();
      expect(directive.elRef).toBeUndefined();
    });
  });
});

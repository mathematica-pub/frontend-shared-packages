/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BarsComponentStub } from '../../testing/stubs/bars.component.stub';
import { BARS, BarsComponent } from '../bars.component';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';

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
    let datum;
    beforeEach(() => {
      el = document.createElement('div');
      el.id = 'bar-4';
      datum = {
        index: 5,
        categorical: 'categorical',
        quantitative: 2,
        ordinal: 'ordinal',
      };
      event = {
        target: el,
      };
      spyOn(directive, 'getBarDatum').and.returnValue(datum);
    });
    it('sets barDatum to the correct value', () => {
      directive.onElementPointerEnter(event);
      expect(directive.barDatum).toEqual(datum);
    });
    it('sets elRef to the correct value', () => {
      directive.onElementPointerEnter(event);
      expect(directive.elRef.nativeElement).toEqual(el);
    });
  });

  describe('elementPointerMove()', () => {
    let actionA: any;
    let applyASpy: jasmine.Spy;
    let removeASpy: jasmine.Spy;
    let actionB: any;
    let applyBSpy: jasmine.Spy;
    let removeBSpy: jasmine.Spy;
    let event: any;
    beforeEach(() => {
      spyOn(directive, 'getPointerValuesArray').and.returnValue([1, 2]);
      event = 'event';
      applyASpy = jasmine.createSpy('onStart');
      removeASpy = jasmine.createSpy('onEnd');
      applyBSpy = jasmine.createSpy('onStart');
      removeBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onStart: applyASpy,
        onEnd: removeASpy,
      };
      actionB = {
        onStart: applyBSpy,
        onEnd: removeBSpy,
      };
      directive.actions = [actionA, actionB];
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
    it('calls apply action on each action in actions array if actions exist', () => {
      directive.onElementPointerMove(event as any);
      expect(applyASpy).toHaveBeenCalledOnceWith(directive);
      expect(applyBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('does not call apply action on each action in actions array if actions do not exist', () => {
      directive.actions = undefined as any;
      directive.onElementPointerMove(event as any);
      expect(applyASpy).not.toHaveBeenCalled();
      expect(applyBSpy).not.toHaveBeenCalled();
    });
  });

  describe('elementPointerLeave', () => {
    let actionA: any;
    let applyASpy: jasmine.Spy;
    let removeASpy: jasmine.Spy;
    let actionB: any;
    let applyBSpy: jasmine.Spy;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
      applyASpy = jasmine.createSpy('onStart');
      removeASpy = jasmine.createSpy('onEnd');
      applyBSpy = jasmine.createSpy('onStart');
      removeBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onStart: applyASpy,
        onEnd: removeASpy,
      };
      actionB = {
        onStart: applyBSpy,
        onEnd: removeBSpy,
      };
      directive.actions = [actionA, actionB];
    });
    it('calls remove action on each action in actions array', () => {
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledOnceWith(directive);
      expect(removeBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('does not call remove action on each action in actions array if actions do not exist', () => {
      directive.actions = undefined as any;
      directive.onElementPointerLeave();
      expect(removeASpy).not.toHaveBeenCalled();
      expect(removeBSpy).not.toHaveBeenCalled();
    });
    it('sets barDatum to undefined', () => {
      directive.barDatum = {
        index: 1,
        color: 'categorical',
        quantitative: 2,
        ordinal: 'ordinal',
      };
      directive.onElementPointerLeave();
      expect(directive.barDatum).toBeUndefined();
    });
    it('sets elRef to undefined', () => {
      directive.elRef = 'elRef' as any;
      directive.onElementPointerLeave();
      expect(directive.elRef).toBeUndefined();
    });
  });
});

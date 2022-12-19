import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverEventDirective } from '../events/hover-event';
import { BarsComponentStub } from '../testing/stubs/bars.component.stub';
import { HoverEventDirectiveStub } from '../testing/stubs/hover-event-stub';
import { BarsHoverEventDirective } from './bars-hover-event.directive';
import { BARS } from './bars.component';

describe('BarsHoverEventDirective', () => {
  let directive: BarsHoverEventDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BarsHoverEventDirective,
        Renderer2,
        {
          provide: BARS,
          useValue: BarsComponentStub,
        },
        {
          provide: HoverEventDirective,
          useValue: HoverEventDirectiveStub,
        },
      ],
    });
    directive = TestBed.inject(BarsHoverEventDirective);
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
    directive.unlistenPointerLeave = () => {
      return;
    };
  });

  describe('setElements()', () => {
    let nodesSpy: jasmine.Spy;
    beforeEach(() => {
      nodesSpy = jasmine.createSpy('nodes').and.returnValue(['el' as any]);
      directive.bars = {
        bars: {
          nodes: nodesSpy,
        },
      } as any;
    });
    it('sets elements to the correct value', () => {
      directive.setListenedElements();
      expect(directive.elements).toEqual(['el' as any]);
    });
  });

  describe('elementPointerEnter()', () => {
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    let event: any;
    beforeEach(() => {
      event = {
        target: document.createElement('div'),
      };
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
    it('calls apply effect with the correct value if there are effects', () => {
      directive.elementPointerEnter(event as any);
      expect(applyASpy).toHaveBeenCalledWith(directive);
      expect(applyBSpy).toHaveBeenCalledWith(directive);
    });
    it('does not call apply effect with the correct value if there no effects', () => {
      directive.effects = undefined;
      directive.elementPointerEnter(event as any);
      expect(applyASpy).toHaveBeenCalledTimes(0);
      expect(applyBSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('elementPointerLeave()', () => {
    let effectA: any;
    let removeASpy: jasmine.Spy;
    let effectB: any;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
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
    it('calls remove effect with the correct value if effects exist', () => {
      directive.elementPointerLeave();
      expect(removeASpy).toHaveBeenCalledWith(directive);
      expect(removeBSpy).toHaveBeenCalledWith(directive);
    });

    it('calls does not call remove effect with the correct value if there are no effects', () => {
      directive.effects = undefined;
      directive.elementPointerLeave();
      expect(removeASpy).toHaveBeenCalledTimes(0);
      expect(removeBSpy).toHaveBeenCalledTimes(0);
    });
  });
});

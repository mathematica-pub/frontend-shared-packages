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
    it('sets elements to the correct value', () => {
      directive.bars = {
        chart: {
          svgRef: {
            nativeElement: 'el',
          },
        },
      } as any;
      directive.setElements();
      expect(directive.elements).toEqual(['el' as any]);
    });
  });

  describe('elementPointerEnter()', () => {
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    beforeEach(() => {
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
      directive.elementPointerEnter();
      expect(applyASpy).toHaveBeenCalledWith(directive);
      expect(applyBSpy).toHaveBeenCalledWith(directive);
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
    it('calls remove effect with the correct value', () => {
      directive.elementPointerLeave();
      expect(removeASpy).toHaveBeenCalledWith(directive);
      expect(removeBSpy).toHaveBeenCalledWith(directive);
    });
  });
});

import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverEventDirective } from '../events/hover-event';
import { HoverEventDirectiveStub } from '../testing/stubs/hover-event-stub';
import { LinesComponentStub } from '../testing/stubs/lines.component.stub';
import { LinesHoverDirective } from './lines-hover.directive';
import { LINES } from './lines.component';

describe('LinesHoverDirective', () => {
  let directive: LinesHoverDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinesHoverDirective,
        Renderer2,
        {
          provide: LINES,
          useValue: LinesComponentStub,
        },
        {
          provide: HoverEventDirective,
          useValue: HoverEventDirectiveStub,
        },
      ],
    });
    directive = TestBed.inject(LinesHoverDirective);
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
      spyOn(directive, 'setListeners');
      directive.lines = {
        chart: {
          svgRef: {
            nativeElement: 'el',
          },
        },
      } as any;
      directive.setListenedElements();
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
      directive.onElementPointerEnter();
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
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledWith(directive);
      expect(removeBSpy).toHaveBeenCalledWith(directive);
    });
  });
});

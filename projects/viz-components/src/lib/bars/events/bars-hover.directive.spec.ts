/* eslint-disable @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverDirective } from '../../events/hover.directive';
import { BarsComponentStub } from '../../testing/stubs/bars.component.stub';
import { HoverDirectiveStub } from '../../testing/stubs/hover.directive.stub';
import { BARS, BarsComponent } from '../bars.component';
import { BarsHoverDirective } from './bars-hover.directive';

describe('BarsHoverDirective', () => {
  let directive: BarsHoverDirective<any, string, BarsComponent<any, string>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BarsHoverDirective,
        Renderer2,
        {
          provide: BARS,
          useValue: BarsComponentStub,
        },
        {
          provide: HoverDirective,
          useValue: HoverDirectiveStub,
        },
      ],
    });
    directive = TestBed.inject(
      BarsHoverDirective<any, string, BarsComponent<any, string>>
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
    directive.unlistenPointerLeave = () => {
      return;
    };
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
      directive.onElementPointerEnter(event as any);
      expect(applyASpy).toHaveBeenCalledWith(directive);
      expect(applyBSpy).toHaveBeenCalledWith(directive);
    });
    it('does not call apply effect with the correct value if there no effects', () => {
      directive.effects = undefined;
      directive.onElementPointerEnter(event as any);
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
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledWith(directive);
      expect(removeBSpy).toHaveBeenCalledWith(directive);
    });

    it('calls does not call remove effect with the correct value if there are no effects', () => {
      directive.effects = undefined;
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledTimes(0);
      expect(removeBSpy).toHaveBeenCalledTimes(0);
    });
  });
});

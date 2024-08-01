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
    let actionA: any;
    let applyASpy: jasmine.Spy;
    let actionB: any;
    let applyBSpy: jasmine.Spy;
    let event: any;
    beforeEach(() => {
      event = {
        target: document.createElement('div'),
      };
      applyASpy = jasmine.createSpy('onStart');
      applyBSpy = jasmine.createSpy('onStart');
      actionA = {
        onStart: applyASpy,
      };
      actionB = {
        onStart: applyBSpy,
      };
      directive.actions = [actionA, actionB] as any;
    });
    it('calls onStart with the correct value if there are actions', () => {
      directive.onElementPointerEnter(event as any);
      expect(applyASpy).toHaveBeenCalledWith(directive);
      expect(applyBSpy).toHaveBeenCalledWith(directive);
    });
    it('does not call onStart with the correct value if there no actions', () => {
      directive.actions = undefined;
      directive.onElementPointerEnter(event as any);
      expect(applyASpy).toHaveBeenCalledTimes(0);
      expect(applyBSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('elementPointerLeave()', () => {
    let actionA: any;
    let removeASpy: jasmine.Spy;
    let actionB: any;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
      removeASpy = jasmine.createSpy('onEnd');
      removeBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onEnd: removeASpy,
      };
      actionB = {
        onEnd: removeBSpy,
      };
      directive.actions = [actionA, actionB] as any;
    });
    it('calls onEnd with the correct value if actions exist', () => {
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledWith(directive);
      expect(removeBSpy).toHaveBeenCalledWith(directive);
    });

    it('calls does not call onEnd with the correct value if there are no actions', () => {
      directive.actions = undefined;
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledTimes(0);
      expect(removeBSpy).toHaveBeenCalledTimes(0);
    });
  });
});

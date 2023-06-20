/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverMoveDirectiveStub } from '../testing/stubs/hover-move.directive.stub';

describe('HoverMoveDirective', () => {
  let directive: HoverMoveDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HoverMoveDirectiveStub, Renderer2],
    });
    directive = TestBed.inject(HoverMoveDirectiveStub);
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
  });

  describe('onPointerEnter()', () => {
    let event: any;
    let element: any;
    beforeEach(() => {
      event = 'event';
      element = 'element';
      spyOn(directive, 'onElementPointerEnter');
      spyOn(directive, 'setPointerMoveListener');
      spyOn(directive, 'setPointerLeaveListener');
    });
    it('calls elementPointerEnter()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.onElementPointerEnter).toHaveBeenCalledOnceWith(
        event as any
      );
    });
    it('calls setPointerMoveListener()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.setPointerMoveListener).toHaveBeenCalledOnceWith(
        element as any
      );
    });
    it('calls setPointerLeaveListener()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.setPointerLeaveListener).toHaveBeenCalledOnceWith(
        element as any
      );
    });
  });
});

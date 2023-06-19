/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverAndMoveEventDirectiveStub } from '../testing/stubs/hover-move-event.stub';

describe('HoverAndMoveEvent', () => {
  let directive: HoverAndMoveEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HoverAndMoveEventDirectiveStub, Renderer2],
    });
    directive = TestBed.inject(HoverAndMoveEventDirectiveStub);
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

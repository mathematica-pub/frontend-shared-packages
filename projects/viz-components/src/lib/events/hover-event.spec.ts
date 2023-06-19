/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverEventDirectiveStub } from '../testing/stubs/hover-event-stub';

describe('HoverEvent', () => {
  let directive: HoverEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HoverEventDirectiveStub, Renderer2],
    });
    directive = TestBed.inject(HoverEventDirectiveStub);
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

  describe('ngOnDestroy()', () => {
    let unlistenStartSpy: jasmine.Spy;
    let unlistenEnterSpy: jasmine.Spy;
    beforeEach(() => {
      unlistenStartSpy = jasmine.createSpy();
      unlistenEnterSpy = jasmine.createSpy();
      directive.unlistenTouchStart = [unlistenStartSpy];
      directive.unlistenPointerEnter = [unlistenEnterSpy];
    });
    it('calls unlistenTouchStart()', () => {
      directive.ngOnDestroy();
      expect(unlistenStartSpy).toHaveBeenCalledTimes(1);
    });
    it('calls unlistenPointerEnter()', () => {
      directive.ngOnDestroy();
      expect(unlistenEnterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setListeners()', () => {
    let el: any;
    beforeEach(() => {
      el = 'element';
      directive.elements = [el];
      spyOn(directive, 'setTouchStartListener');
      spyOn(directive, 'setPointerEnterListener');
    });
    it('calls setTouchStartListener()', () => {
      directive.setListeners();
      expect(directive.setTouchStartListener).toHaveBeenCalledTimes(1);
    });
    it('calls setPointerEnterListener()', () => {
      directive.setListeners();
      expect(directive.setPointerEnterListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('onTouchStart()', () => {
    let event: TouchEvent;
    beforeEach(() => {
      event = new TouchEvent('touchstart');
      spyOn(event, 'preventDefault');
    });
    it('calls preventDefault()', () => {
      directive.onTouchStart(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPointerEnter()', () => {
    let event: any;
    let element: any;
    beforeEach(() => {
      event = 'event';
      element = 'element';
      spyOn(directive, 'onElementPointerEnter');
      spyOn(directive, 'setPointerLeaveListener');
    });
    it('calls elementPointerEnter()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.onElementPointerEnter).toHaveBeenCalledOnceWith(event);
    });
    it('calls setPointerLeaveListener()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.setPointerLeaveListener).toHaveBeenCalledOnceWith(
        element
      );
    });
  });
});

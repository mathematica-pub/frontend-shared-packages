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
    directive.unlistenTouchStart = () => {
      return;
    };
    directive.unlistenPointerEnter = () => {
      return;
    };
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      spyOn(directive, 'unlistenTouchStart');
      spyOn(directive, 'unlistenPointerEnter');
    });
    it('calls unlistenTouchStart()', () => {
      directive.ngOnDestroy();
      expect(directive.unlistenTouchStart).toHaveBeenCalledTimes(1);
    });
    it('calls unlistenPointerEnter()', () => {
      directive.ngOnDestroy();
      expect(directive.unlistenPointerEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe('setListeners()', () => {
    let el: any;
    beforeEach(() => {
      el = 'element';
      directive.el = el;
      spyOn(directive, 'setTouchStartListener');
      spyOn(directive, 'setPointerEnterListener');
    });
    it('calls setTouchStartListener()', () => {
      directive.setListeners();
      expect(directive.setTouchStartListener).toHaveBeenCalledOnceWith(el);
    });
    it('calls setPointerEnterListener()', () => {
      directive.setListeners();
      expect(directive.setPointerEnterListener).toHaveBeenCalledOnceWith(el);
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
      spyOn(directive, 'chartPointerEnter');
      spyOn(directive, 'setPointerLeaveListener');
    });
    it('calls chartPointerEnter()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.chartPointerEnter).toHaveBeenCalledOnceWith(event);
    });
    it('calls setPointerLeaveListener()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.setPointerLeaveListener).toHaveBeenCalledOnceWith(
        element
      );
    });
  });
});

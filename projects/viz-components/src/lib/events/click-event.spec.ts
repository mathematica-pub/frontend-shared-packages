/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClickEventDirectiveStub } from '../testing/stubs/click-event.stub';

describe('ClickEvent', () => {
  let directive: ClickEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClickEventDirectiveStub, Renderer2],
    });
    directive = TestBed.inject(ClickEventDirectiveStub);
    directive.unlistenClick = [
      () => {
        return;
      },
    ];
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(directive, 'onClickRemove');
    });
    it('calls onClickRemove() if clickRemoveEvent$ is defined', () => {
      directive.clickRemoveEvent$ = new BehaviorSubject(null).asObservable();
      directive.ngOnInit();
      expect(directive.onClickRemove).toHaveBeenCalledTimes(1);
    });
    it('does not call onClickRemove() if clickRemoveEvent$ is undefined', () => {
      directive.ngOnInit();
      expect(directive.onClickRemove).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnDestroy()', () => {
    let unlistenClickSpy: jasmine.Spy;
    beforeEach(() => {
      unlistenClickSpy = jasmine.createSpy();
      directive.unlistenClick = [unlistenClickSpy];
      directive.unsubscribe = new Subject();
      spyOn(directive.unsubscribe, 'next');
      spyOn(directive.unsubscribe, 'complete');
    });
    it('calls unlistenClick()', () => {
      directive.ngOnDestroy();
      expect(unlistenClickSpy).toHaveBeenCalledTimes(1);
    });
    it('calls unsubscribe.next()', () => {
      directive.ngOnDestroy();
      expect(directive.unsubscribe.next).toHaveBeenCalledTimes(1);
    });
    it('calls unsubscribe.complete()', () => {
      directive.ngOnDestroy();
      expect(directive.unsubscribe.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('setListeners()', () => {
    beforeEach(() => {
      spyOn(directive, 'setClickListeners');
    });
    it('calls setClickListeners()', () => {
      directive.setListeners();
      expect(directive.setClickListeners).toHaveBeenCalledTimes(1);
    });
  });
});

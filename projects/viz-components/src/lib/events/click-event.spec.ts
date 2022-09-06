/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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

  describe('ngOnDestroy()', () => {
    let unlistenClickSpy: jasmine.Spy;
    beforeEach(() => {
      unlistenClickSpy = jasmine.createSpy();
      directive.unlistenClick = [unlistenClickSpy];
    });
    it('calls unlistenClick()', () => {
      directive.ngOnDestroy();
      expect(unlistenClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});

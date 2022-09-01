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
    directive.unlistenClick = () => {
      return;
    };
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      spyOn(directive, 'unlistenClick');
    });
    it('calls unlistenClick()', () => {
      directive.ngOnDestroy();
      expect(directive.unlistenClick).toHaveBeenCalledTimes(1);
    });
  });
});

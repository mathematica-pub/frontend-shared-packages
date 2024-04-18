/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { DataMarksBaseStub } from '../testing/stubs/data-marks-base.stub';
import { EventDirectiveStub } from '../testing/stubs/event.directive.stub';

describe('EventDirective', () => {
  let directive: EventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventDirectiveStub,
        Renderer2,
        {
          provide: DATA_MARKS,
          useClass: DataMarksBaseStub,
        },
      ],
    });
    directive = TestBed.inject(EventDirectiveStub);
  });

  describe('ngAfterViewInit()', () => {
    beforeEach(() => {
      spyOn(directive, 'setListenedElements');
    });
    it('calls setElements', () => {
      directive.ngAfterViewInit();
      expect(directive.setListenedElements).toHaveBeenCalledTimes(1);
    });
  });
});

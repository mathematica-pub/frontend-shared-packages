/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
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
          useClass: DataMarks,
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

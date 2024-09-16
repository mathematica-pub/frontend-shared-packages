/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { EventDirectiveStub } from '../testing/stubs/event.directive.stub';
import { PrimaryMarksStub } from '../testing/stubs/primary-marks.stub';

describe('EventDirective', () => {
  let directive: EventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventDirectiveStub,
        Renderer2,
        {
          provide: VIC_PRIMARY_MARKS,
          useClass: PrimaryMarksStub,
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

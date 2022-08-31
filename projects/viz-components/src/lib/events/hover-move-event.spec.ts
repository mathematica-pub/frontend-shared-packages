/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { ChartComponentStub } from '../testing/stubs/chart.component.stub';
import { HoverAndMoveEventDirectiveStub } from '../testing/stubs/haver-move-event.stub';

describe('HoverAndMoveEvent', () => {
  let directive: HoverAndMoveEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HoverAndMoveEventDirectiveStub,
        Renderer2,
        {
          provide: ChartComponent,
          useValue: ChartComponentStub,
        },
      ],
    });
    directive = TestBed.inject(HoverAndMoveEventDirectiveStub);
    directive.unlistenTouchStart = () => {
      return;
    };
    directive.unlistenPointerEnter = () => {
      return;
    };
  });

  describe('onPointerEnter()', () => {
    let event: any;
    let element: any;
    beforeEach(() => {
      event = 'event';
      element = 'element';
      spyOn(directive, 'chartPointerEnter');
      spyOn(directive, 'setPointerMoveListener');
      spyOn(directive, 'setPointerLeaveListener');
    });
    it('calls chartPointerEnter()', () => {
      directive.onPointerEnter(event as any, element as any);
      expect(directive.chartPointerEnter).toHaveBeenCalledOnceWith(
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

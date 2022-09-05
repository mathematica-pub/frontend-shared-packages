/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { ChartSvgEventDirectiveStub } from '../testing/stubs/svg-chart-event.stub';

describe('SvgChartEvent', () => {
  let directive: ChartSvgEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChartSvgEventDirectiveStub,
        Renderer2,
        {
          provide: DATA_MARKS,
          useClass: DataMarks,
        },
      ],
    });
    directive = TestBed.inject(ChartSvgEventDirectiveStub);
  });

  describe('ngAfterViewInit()', () => {
    beforeEach(() => {
      spyOn(directive, 'setListeners');
      spyOn(directive, 'setEl');
    });
    it('calls setEl', () => {
      directive.ngAfterViewInit();
      expect(directive.setEl).toHaveBeenCalledTimes(1);
    });
    it('calls setListeners()', () => {
      directive.ngAfterViewInit();
      expect(directive.setListeners).toHaveBeenCalledTimes(1);
    });
  });

  describe('setEl()', () => {
    it('sets el to the correct value', () => {
      (directive as any).dataMarks = {
        chart: {
          svgRef: { nativeElement: 'element' },
        },
      } as any;
      directive.setEl();
      expect(directive.el).toEqual('element' as any);
    });
  });
});

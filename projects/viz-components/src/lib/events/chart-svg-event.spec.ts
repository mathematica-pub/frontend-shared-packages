/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { ChartComponentStub } from '../testing/stubs/chart.component.stub';
import { SvgChartEventDirectiveStub } from '../testing/stubs/svg-chart-event.stub';

describe('SvgChartEvent', () => {
  let directive: SvgChartEventDirectiveStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SvgChartEventDirectiveStub,
        Renderer2,
        {
          provide: ChartComponent,
          useValue: ChartComponentStub,
        },
      ],
    });
    directive = TestBed.inject(SvgChartEventDirectiveStub);
  });

  describe('ngAfterViewInit()', () => {
    beforeEach(() => {
      spyOn(directive, 'setListeners');
      (directive as any).chart.svgRef = { nativeElement: 'element' };
    });
    it('sets el to the correct value', () => {
      directive.ngAfterViewInit();
      expect(directive.el).toEqual('element' as any);
    });
    it('calls setListeners()', () => {
      directive.ngAfterViewInit();
      expect(directive.setListeners).toHaveBeenCalledTimes(1);
    });
  });
});

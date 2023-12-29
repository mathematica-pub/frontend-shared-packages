/* eslint-disable @typescript-eslint/no-explicit-any */
import { of } from 'rxjs';
import { XyAxisStub } from '../testing/stubs/xy-axis.stub';
import { XyChartComponentStub } from '../testing/stubs/xy-chart.component.stub';

describe('the XyAxis abstract class', () => {
  let abstractClass: XyAxisStub;
  let chart: XyChartComponentStub;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new XyAxisStub(chart as any);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setAxisFunction');
      spyOn(abstractClass, 'setTranslate');
      spyOn(abstractClass, 'setScale');
    });
    it('calls setScale once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.setScale).toHaveBeenCalledTimes(1);
    });

    it('calls setTranslate once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.setTranslate).toHaveBeenCalledTimes(1);
    });

    it('calls setAxisFunction once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.setAxisFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToScale', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'onScaleUpdate');
    });
    it('calls onScaleUpdate with the correct values', () => {
      const scale$ = of({ useTransition: false, x: 'scale' } as any);
      abstractClass.subscribeToScale(scale$);
      expect(abstractClass.onScaleUpdate).toHaveBeenCalledOnceWith(
        'scale' as any,
        false
      );
    });
  });

  describe('onScaleUpdate()', () => {
    let updateSpy: jasmine.Spy;
    let curr;
    beforeEach(() => {
      updateSpy = spyOn(abstractClass, 'updateAxis');
      abstractClass.chart = { transitionDuration: 500 } as any;
      curr = { range: () => [0, 1] };
    });
    it('sets transitionDuration to 0 if useTransition is false', () => {
      abstractClass.onScaleUpdate(curr, false);
      expect(abstractClass.transitionDuration).toEqual(0);
    });
    it('sets transitionDuration to the chart transitionDuration if useTransition is true', () => {
      abstractClass.onScaleUpdate(curr, true);
      expect(abstractClass.transitionDuration).toEqual(500);
    });
    it('sets scale to the correct value', () => {
      abstractClass.onScaleUpdate(curr, true);
      expect(abstractClass.scale).toEqual(curr);
    });
    it('calls updateAxis once with the correct value', () => {
      abstractClass.onScaleUpdate(curr, true);
      expect(updateSpy).toHaveBeenCalledOnceWith(500);
    });
  });

  describe('updateAxis()', () => {
    let transition: number;
    beforeEach(() => {
      abstractClass.axisFunction = 'func' as any;
      spyOn(abstractClass, 'setAxis');
      spyOn(abstractClass, 'drawAxis');
      spyOn(abstractClass, 'processAxisFeatures');
      transition = 200;
      abstractClass.updateAxis(transition);
    });
    it('calls setAxis once with the correct value', () => {
      expect(abstractClass.setAxis).toHaveBeenCalledOnceWith('func');
    });

    it('calls drawAxis once', () => {
      expect(abstractClass.drawAxis).toHaveBeenCalledTimes(1);
    });

    it('calls processAxisFeatures once', () => {
      expect(abstractClass.processAxisFeatures).toHaveBeenCalledTimes(1);
    });
  });
});

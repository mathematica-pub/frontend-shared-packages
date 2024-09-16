/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgOnChangesUtilities } from 'projects/app-dev-kit/src/public-api';
import { of } from 'rxjs';
import { DestroyRefStub } from '../../testing/stubs/core/destroy-ref.stub';
import { XyAxisStub } from '../../testing/stubs/xy-axis.stub';
import { XyChartComponentStub } from '../../testing/stubs/xy-chart.component.stub';

describe('the XyAxis abstract class', () => {
  let abstractClass: XyAxisStub<number>;
  let chart: XyChartComponentStub;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new XyAxisStub(chart as any, new DestroyRefStub());
  });

  describe('ngOnChanges', () => {
    let objectChangedSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(abstractClass, 'updateAxis');
      objectChangedSpy = spyOn(
        NgOnChangesUtilities,
        'inputObjectChangedNotFirstTime'
      );
    });
    it('calls updateAxis once if inputObjectChangedNotFirstTime returns true', () => {
      objectChangedSpy.and.returnValue(true);
      abstractClass.ngOnChanges({ config: {} } as any);
      expect(abstractClass.updateAxis).toHaveBeenCalledTimes(1);
    });
    it('does not call updateAxis if config is first change', () => {
      objectChangedSpy.and.returnValue(false);
      abstractClass.ngOnChanges({ config: {} } as any);
      expect(abstractClass.updateAxis).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setAxisFunction');
      spyOn(abstractClass, 'setTranslate');
      spyOn(abstractClass, 'subscribeToScale');
    });
    it('calls subscribeToScale once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToScale).toHaveBeenCalledTimes(1);
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
      spyOn(abstractClass, 'getScale').and.returnValue(
        of({
          scale: 'scale',
          useTransition: false,
        } as any)
      );
    });
    it('calls onScaleUpdate with the correct values', () => {
      abstractClass.subscribeToScale();
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
    it('sets scale to the correct value', () => {
      abstractClass.onScaleUpdate(curr, true);
      expect(abstractClass.scale).toEqual(curr);
    });
    it('calls updateAxis once with the correct value if useTransition is true', () => {
      abstractClass.onScaleUpdate(curr, true);
      expect(updateSpy).toHaveBeenCalledOnceWith(500);
    });
    it('calls updateAxis once with the correct value if useTransition is false', () => {
      abstractClass.onScaleUpdate(curr, false);
      expect(updateSpy).toHaveBeenCalledOnceWith(0);
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

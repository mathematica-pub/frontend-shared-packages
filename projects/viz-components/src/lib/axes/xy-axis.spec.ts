import { BehaviorSubject } from 'rxjs';
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
    it('calls onScaleUpdate with the emitted values', () => {
      spyOn(abstractClass, 'onScaleUpdate');
      const scale = new BehaviorSubject<any>(null);
      const scale$ = scale.asObservable();
      abstractClass.subscribeToScale(scale$);
      scale.next('one');
      expect(abstractClass.onScaleUpdate).toHaveBeenCalledOnceWith(
        null,
        'one' as any
      );
    });
  });

  describe('onScaleUpdate()', () => {
    let updateSpy: jasmine.Spy;
    let prev;
    let curr;
    beforeEach(() => {
      updateSpy = spyOn(abstractClass, 'updateAxis');
      abstractClass.chart = { transitionDuration: 500 } as any;
      prev = { range: () => [0, 1] };
      curr = { range: () => [0, 1] };
    });
    it('sets scale to curr', () => {
      curr = { range: () => [0, 9] };
      abstractClass.onScaleUpdate(prev, curr);
      expect(abstractClass.scale.range()).toEqual([0, 9]);
    });

    it('calls updateAxis once with 0 if prev value is falsey', () => {
      abstractClass.onScaleUpdate(null, curr);
      expect(updateSpy).toHaveBeenCalledOnceWith(0);
    });

    it('calls updateAxis with chart.transitionDuration if prev and curr arguments are the same', () => {
      abstractClass.onScaleUpdate(prev, curr);
      expect(updateSpy).toHaveBeenCalledOnceWith(500);
    });

    it('calls updateAxis with 0 if prev and curr arguments are not the same', () => {
      prev = { range: () => [0, 1] };
      curr = { range: () => [0, 2] };
      abstractClass.onScaleUpdate(prev, curr);
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

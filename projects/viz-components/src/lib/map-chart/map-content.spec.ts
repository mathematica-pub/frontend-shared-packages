import { BehaviorSubject } from 'rxjs';
import { MapChartComponentStub } from '../testing/stubs/map-chart.stub';
import { MapContentStub } from '../testing/stubs/map-content.stub';

describe('MapContent abstract class', () => {
  let abstractClass: MapContentStub;
  let chart: MapChartComponentStub;

  beforeEach(() => {
    chart = new MapChartComponentStub();
    abstractClass = new MapContentStub(chart as any);
  });

  describe('subscribeToScalesAndConfig()', () => {
    let setSpy: jasmine.Spy;
    beforeEach(() => {
      abstractClass.chart = {
        attributeDataScale: new BehaviorSubject<any>(null),
        attributeDataConfig: new BehaviorSubject<any>(null),
      } as any;
      abstractClass.chart.attributeDataScale$ = (
        abstractClass.chart as any
      ).attributeDataScale.asObservable();
      abstractClass.chart.attributeDataConfig$ = (
        abstractClass.chart as any
      ).attributeDataConfig.asObservable();
      setSpy = spyOn(abstractClass, 'setScaleAndConfig');
    });

    it('calls setScaleAndConfig once with the correct values when a new config object is emitted from subscription', () => {
      abstractClass.subscribeToScalesAndConfig();
      setSpy.calls.reset();
      (abstractClass.chart as any).attributeDataConfig.next('test config');
      expect(abstractClass.setScaleAndConfig).toHaveBeenCalledOnceWith(
        null,
        'test config' as any
      );
    });

    it('calls setScaleAndConfig once with the correct values when a new scale is emitted from subscription', () => {
      abstractClass.subscribeToScalesAndConfig();
      setSpy.calls.reset();
      (abstractClass.chart as any).attributeDataScale.next('test scale');
      expect(abstractClass.setScaleAndConfig).toHaveBeenCalledOnceWith(
        'test scale' as any,
        null
      );
    });
  });
});

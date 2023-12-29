import { BehaviorSubject } from 'rxjs';
import { MapChartComponentStub } from '../testing/stubs/map-chart.stub';
import { MapDataMarksBaseStub } from '../testing/stubs/map-content.stub';

describe('MapDataMarksBase abstract class', () => {
  let abstractClass: MapDataMarksBaseStub;
  let chart: MapChartComponentStub;

  beforeEach(() => {
    chart = new MapChartComponentStub();
    abstractClass = new MapDataMarksBaseStub(chart as any);
  });

  describe('subscribeToAttributeScaleAndConfig()', () => {
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
      spyOn(abstractClass, 'drawMarks');
    });

    it('sets attributeDataConfig', () => {
      abstractClass.subscribeToAttributeScaleAndConfig();
      (abstractClass.chart as any).attributeDataConfig.next('test config');
      (abstractClass.chart as any).attributeDataScale.next('test scale');
      expect(abstractClass.attributeDataConfig).toEqual('test config' as any);
    });

    it('sets attributeDataScale', () => {
      abstractClass.subscribeToAttributeScaleAndConfig();
      (abstractClass.chart as any).attributeDataConfig.next('test config');
      (abstractClass.chart as any).attributeDataScale.next('test scale');
      expect(abstractClass.attributeDataScale).toEqual('test scale' as any);
    });

    it('calls drawMarks()', () => {
      abstractClass.subscribeToAttributeScaleAndConfig();
      (abstractClass.chart as any).attributeDataConfig.next('test config');
      (abstractClass.chart as any).attributeDataScale.next('test scale');
      expect(abstractClass.drawMarks).toHaveBeenCalled();
    });
  });
});

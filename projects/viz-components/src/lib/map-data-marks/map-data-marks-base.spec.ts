import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapChartComponentStub } from '../testing/stubs/map-chart.component.stub';
import { MapDataMarksBaseStub } from '../testing/stubs/map-data-marks-base.stub';

describe('MapDataMarksBase abstract class', () => {
  let abstractClass: MapDataMarksBaseStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapDataMarksBaseStub,
        {
          provide: MapChartComponent,
          useValue: MapChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(MapDataMarksBaseStub);
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'subscribeToRanges');
      spyOn(abstractClass, 'subscribeToAttributeProperties');
      spyOn(abstractClass, 'initFromConfig');
    });
    it('calls subscribeToRanges once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToRanges).toHaveBeenCalledTimes(1);
    });
    it('calls subscribeToAttributeScaleAndConfig once', () => {
      abstractClass.ngOnInit();
      expect(
        abstractClass.subscribeToAttributeProperties
      ).toHaveBeenCalledTimes(1);
    });
    it('calls initFromConfig once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToAttributeScaleAndConfig()', () => {
    beforeEach(() => {
      abstractClass.chart = {
        attributeProperties: new BehaviorSubject<any>({
          config: undefined,
          scale: undefined,
        }),
      } as any;
      abstractClass.chart.attributeProperties$ = (
        abstractClass.chart as any
      ).attributeProperties.asObservable();
      spyOn(abstractClass, 'drawMarks');
    });
    it('sets attributeDataConfig', () => {
      abstractClass.subscribeToAttributeProperties();
      (abstractClass.chart as any).attributeProperties.next({
        scale: 'test scale',
        config: 'test config',
      });
      expect(abstractClass.attributeDataConfig).toEqual('test config' as any);
    });
    it('sets attributeDataScale', () => {
      abstractClass.subscribeToAttributeProperties();
      (abstractClass.chart as any).attributeProperties.next({
        scale: 'test scale',
        config: 'test config',
      });
      expect(abstractClass.attributeDataScale).toEqual('test scale' as any);
    });
    it('calls drawMarks()', () => {
      abstractClass.subscribeToAttributeProperties();
      (abstractClass.chart as any).attributeProperties.next({
        scale: 'test scale',
        config: 'test config',
      });
      expect(abstractClass.drawMarks).toHaveBeenCalled();
    });
  });
});

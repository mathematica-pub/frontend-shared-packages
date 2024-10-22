/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MapChartComponent } from '../../../charts/map-chart/map-chart.component';
import { MapAuxMarksStub } from '../../../testing/stubs/map-aux-marks.stub';
import { MapChartComponentStub } from '../../../testing/stubs/map-chart.component.stub';

describe('MapAuxMarksBase abstract class', () => {
  let abstractClass: MapAuxMarksStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapAuxMarksStub,
        {
          provide: MapChartComponent,
          useValue: MapChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(MapAuxMarksStub);
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'subscribeToAttributeDataProperties');
    });
    it('calls subscribeToAttributeDataProperties once', () => {
      abstractClass.ngOnInit();
      expect(
        abstractClass.subscribeToAttributeDataProperties
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToAttributeProperties()', () => {
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
      abstractClass.subscribeToAttributeDataProperties();
      (abstractClass.chart as any).attributeProperties.next({
        scale: 'test scale',
        config: 'test config',
      });
      expect(abstractClass.attributeDataConfig).toEqual('test config' as any);
    });
    it('sets attributeDataScale', () => {
      abstractClass.subscribeToAttributeDataProperties();
      (abstractClass.chart as any).attributeProperties.next({
        scale: 'test scale',
        config: 'test config',
      });
      expect(abstractClass.attributeDataScale).toEqual('test scale' as any);
    });
    it('calls drawMarks()', () => {
      abstractClass.subscribeToAttributeDataProperties();
      (abstractClass.chart as any).attributeProperties.next({
        scale: 'test scale',
        config: 'test config',
      });
      expect(abstractClass.drawMarks).toHaveBeenCalled();
    });
  });
});

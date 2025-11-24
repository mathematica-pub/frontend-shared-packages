/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MapChartComponent } from '../../../charts/map-chart/map-chart.component';
import { MapChartComponentStub } from '../../../testing/stubs/map-chart.component.stub';
import { MapPrimaryMarksStub } from '../../../testing/stubs/map-primary-marks.stub';

describe('MapPrimaryMarks abstract class', () => {
  let abstractClass: MapPrimaryMarksStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapPrimaryMarksStub,
        {
          provide: MapChartComponent,
          useValue: MapChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(MapPrimaryMarksStub);
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'subscribeToRanges');
      spyOn(abstractClass, 'subscribeToAttributeDataProperties');
    });
    it('calls subscribeToRanges once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToRanges).toHaveBeenCalledTimes(1);
    });
    it('calls subscribeToAttributeProperties once', () => {
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

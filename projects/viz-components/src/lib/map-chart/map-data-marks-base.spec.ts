import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { MapChartComponentStub } from '../testing/stubs/map-chart.component.stub';
import { MapDataMarksBaseStub } from '../testing/stubs/map-data-marks-base.stub';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { MapChartComponent } from './map-chart.component';

describe('MapDataMarksBase abstract class', () => {
  let abstractClass: MapDataMarksBaseStub;
  let mainServiceStub: MainServiceStub;

  beforeEach(() => {
    mainServiceStub = new MainServiceStub();
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

  describe('ngOnChanges()', () => {
    let configChange: any;
    let changeSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(abstractClass, 'initFromConfig');
      changeSpy = spyOn(NgOnChangesUtilities, 'inputObjectChangedNotFirstTime');
      configChange = {
        config: new SimpleChange('', '', false),
      };
    });

    it('should call inputObjectChangedNotFirstTime once and with the correct parameters', () => {
      abstractClass.ngOnChanges(configChange);
      expect(
        NgOnChangesUtilities.inputObjectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call initFromConfig once if objectOnNgChangesNotFirstTime returns true', () => {
      changeSpy.and.returnValue(true);
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
    it('should call not call initFromConfig if objectOnNgChangesNotFirstTime returns false', () => {
      changeSpy.and.returnValue(false);
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'subscribeToRanges');
      spyOn(abstractClass, 'subscribeToAttributeScaleAndConfig');
      spyOn(abstractClass, 'initFromConfig');
    });
    it('calls subscribeToRanges once', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToRanges).toHaveBeenCalledTimes(1);
    });
    it('calls subscribeToAttributeScaleAndConfig once', () => {
      abstractClass.ngOnInit();
      expect(
        abstractClass.subscribeToAttributeScaleAndConfig
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

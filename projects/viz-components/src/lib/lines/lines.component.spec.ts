/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../core/services/utilities.service';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesComponent } from './lines.component';
import { LinesConfig } from './lines.config';

describe('LineChartComponent', () => {
  let component: LinesComponent;
  let fixture: ComponentFixture<LinesComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LinesComponent],
      providers: [
        XyChartComponent,
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { tooltip: { show: false, type: 'html' } },
    } as any;
    component.config = new LinesConfig();
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    beforeEach(() => {
      spyOn(component, 'setMethodsFromConfigAndDraw');
      configChange = {
        config: new SimpleChange('', '', false),
      };
    });

    it('should call objectOnNgChangesNotFirstTime once and with the correct parameters', () => {
      component.ngOnChanges(configChange);
      expect(
        mainServiceStub.utilitiesServiceStub
          .objectOnNgChangesChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call setMethodsFromConfigAndDraw once if objectOnNgChangesNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectOnNgChangesChangedNotFirstTime.and.returnValue(
        true
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
    it('should call setMethodsFromConfigAndDraw once if objectOnNgChangesNotFirstTime returns false', () => {
      mainServiceStub.utilitiesServiceStub.objectOnNgChangesChangedNotFirstTime.and.returnValue(
        false
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component, 'subscribeToRanges');
      spyOn(component, 'subscribeToScales');
      spyOn(component, 'setMethodsFromConfigAndDraw');
    });
    it('calls subscribeToRanges once', () => {
      component.ngOnInit();
      expect(component.subscribeToRanges).toHaveBeenCalledTimes(1);
    });

    it('calls subscribeToScales once', () => {
      component.ngOnInit();
      expect(component.subscribeToScales).toHaveBeenCalledTimes(1);
    });

    it('calls setMethodsFromConfigAndDraw once', () => {
      component.ngOnInit();
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setLine');
      spyOn(component, 'setLinesD3Data');
      spyOn(component, 'setLinesKeyFunction');
      spyOn(component, 'setMarkersD3Data');
      spyOn(component, 'setMarkersKeyFunction');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });
    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initDomains once', () => {
      expect(component.initDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
    });

    it('calls setLine once', () => {
      expect(component.setLine).toHaveBeenCalledTimes(1);
    });

    it('calls setLinesD3Data once', () => {
      expect(component.setLinesD3Data).toHaveBeenCalledTimes(1);
    });

    it('calls setLinesKeyFunction once', () => {
      expect(component.setLinesKeyFunction).toHaveBeenCalledTimes(1);
    });

    it('calls setMarkersD3Data once', () => {
      expect(component.setMarkersD3Data).toHaveBeenCalledTimes(1);
    });

    it('calls setMarkersKeyFunction once', () => {
      expect(component.setMarkersKeyFunction).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'setLine');
      spyOn(component, 'drawMarks');
      component.resizeMarks();
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls setLine once', () => {
      expect(component.setLine).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with zero as the argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(0);
    });
  });

  describe('canBeDrawnByPath()', () => {
    it('integration: returns true if value is a number', () => {
      expect(component.canBeDrawnByPath(1)).toEqual(true);
    });

    it('integration: returns true if value is a Date', () => {
      expect(component.canBeDrawnByPath(new Date())).toEqual(true);
    });

    it('integration: returns false if value is undefined', () => {
      expect(component.canBeDrawnByPath(undefined)).toEqual(false);
    });

    it('integration: returns false if value is a string', () => {
      expect(component.canBeDrawnByPath('string')).toEqual(false);
    });

    it('integration: returns false if value is null', () => {
      expect(component.canBeDrawnByPath(null)).toEqual(false);
    });

    it('integration: returns false if value is an object', () => {
      expect(component.canBeDrawnByPath({ oops: 'not a num' })).toEqual(false);
    });

    it('integration: returns false if value is an array', () => {
      expect(component.canBeDrawnByPath(['not a num'])).toEqual(false);
    });

    it('integration: returns false if value is boolean', () => {
      expect(component.canBeDrawnByPath(true)).toEqual(false);
    });
  });

  describe('initCategoryScale', () => {
    beforeEach(() => {
      component.config = {
        category: {
          colorScale: 'color',
        },
      } as any;
      component.chart = {
        updateCategoryScale: jasmine.createSpy('updateCategoryScale'),
      } as any;
    });
    it('calls updateCategoryScale on chart once with the correct value', () => {
      component.initCategoryScale();
      expect(component.chart.updateCategoryScale).toHaveBeenCalledOnceWith(
        'color' as any
      );
    });
  });

  describe('setScaledSpaceProperties', () => {
    let xScaleTypeSpy: jasmine.Spy;
    let yScaleTypeSpy: jasmine.Spy;
    beforeEach(() => {
      xScaleTypeSpy = jasmine.createSpy('scaleType');
      yScaleTypeSpy = jasmine.createSpy('scaleType');
      component.config = {
        x: {
          scaleType: xScaleTypeSpy,
          domain: [0, 1],
        },
        y: {
          scaleType: yScaleTypeSpy,
          domain: [0, 2],
        },
      } as any;
      component.ranges = {
        x: [0, 5],
        y: [0, 10],
      } as any;
      component.chart = {
        updateXScale: jasmine.createSpy('updateXScale'),
        updateYScale: jasmine.createSpy('updateYScale'),
      } as any;
    });
    it('calls updateXScale on chart once', () => {
      component.setScaledSpaceProperties();
      expect(component.chart.updateXScale).toHaveBeenCalledTimes(1);
    });

    it('calls x.scaleType once with the correct values', () => {
      component.setScaledSpaceProperties();
      expect(xScaleTypeSpy).toHaveBeenCalledOnceWith(
        component.config.x.domain,
        component.ranges.x
      );
    });

    it('calls updateYScale on chart once', () => {
      component.setScaledSpaceProperties();
      expect(component.chart.updateYScale).toHaveBeenCalledTimes(1);
    });

    it('calls y.scaleType once with the correct values', () => {
      component.setScaledSpaceProperties();
      expect(yScaleTypeSpy).toHaveBeenCalledOnceWith(
        component.config.y.domain,
        component.ranges.y
      );
    });
  });

  describe('drawMarks()', () => {
    const duration = 50;
    beforeEach(() => {
      spyOn(component, 'drawLines');
      spyOn(component, 'drawPointMarkers');
      spyOn(component, 'drawLineLabels');
      component.config = new LinesConfig();
    });
    it('calls drawLines once and with the correct argument', () => {
      component.drawMarks(duration);
      expect(component.drawLines).toHaveBeenCalledOnceWith(duration);
    });

    it('calls drawPointMarkers once with the correct argument if config.pointMarker.display is truthy', () => {
      component.config.pointMarker.display = true;
      component.drawMarks(duration);
      expect(component.drawPointMarkers).toHaveBeenCalledOnceWith(duration);
    });

    it('does not call drawPointMarkers once if config.pointMarker.displau is falsy', () => {
      component.config.pointMarker.display = false;
      component.drawMarks(duration);
      expect(component.drawPointMarkers).toHaveBeenCalledTimes(0);
    });

    it('calls drawLineLabels once if config.labelLines is true', () => {
      component.config.labelLines = true;
      component.drawMarks(duration);
      expect(component.drawLineLabels).toHaveBeenCalledTimes(1);
    });

    it('does not call drawLineLabels once if config.labelLines is false', () => {
      component.drawMarks(duration);
      expect(component.drawLineLabels).toHaveBeenCalledTimes(0);
    });
  });
});

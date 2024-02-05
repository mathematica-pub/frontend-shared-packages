/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateUtilities } from '../core/utilities/is-date';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesComponent } from './lines.component';
import { VicLinesConfig } from './lines.config';

describe('LineChartComponent', () => {
  let component: LinesComponent;
  let fixture: ComponentFixture<LinesComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LinesComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesComponent);
    component = fixture.componentInstance;
    component.config = new VicLinesConfig();
  });

  describe('setPropertiesFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setLinesD3Data');
      spyOn(component, 'setLinesKeyFunction');
      spyOn(component, 'setMarkersD3Data');
      spyOn(component, 'setMarkersKeyFunction');
      component.setPropertiesFromConfig();
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

    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
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
  });

  describe('canBeDrawnByPath()', () => {
    let dateSpy: jasmine.Spy;
    beforeEach(() => {
      dateSpy = spyOn(DateUtilities, 'isDate').and.returnValue(false);
    });
    it('integration: returns true if value is a number', () => {
      expect(component.canBeDrawnByPath(1)).toEqual(true);
    });

    it('integration: returns true if value is a Date', () => {
      dateSpy.and.returnValue(true);
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

  describe('setChartScales', () => {
    let xScaleTypeSpy: jasmine.Spy;
    let yScaleTypeSpy: jasmine.Spy;
    let paddedDomainSpy: jasmine.Spy;
    beforeEach(() => {
      xScaleTypeSpy = jasmine.createSpy('scaleType').and.returnValue('xScale');
      yScaleTypeSpy = jasmine.createSpy('scaleType').and.returnValue('yScale');
      component.config = {
        x: {
          scaleType: xScaleTypeSpy,
        },
        y: {
          scaleType: yScaleTypeSpy,
        },
        category: {
          colorScale: 'blue',
        },
      } as any;
      component.ranges = {
        x: [0, 5],
        y: [0, 10],
      } as any;
      component.chart = {
        updateScales: jasmine.createSpy('updateScales'),
      } as any;
      paddedDomainSpy = spyOn(component, 'getPaddedDomain').and.returnValues(
        [0, 1],
        [0, 2]
      );
    });
    it('calls x.scaleType once with the correct values', () => {
      component.setChartScalesFromRanges(true);
      expect(xScaleTypeSpy).toHaveBeenCalledOnceWith(
        [0, 1],
        component.ranges.x
      );
    });
    it('calls y.scaleType once with the correct values', () => {
      component.setChartScalesFromRanges(true);
      expect(yScaleTypeSpy).toHaveBeenCalledOnceWith(
        [0, 2],
        component.ranges.y
      );
    });
    it('calls updateScales on chart once', () => {
      component.setChartScalesFromRanges(true);
      expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
        x: 'xScale',
        y: 'yScale',
        category: 'blue',
        useTransition: true,
      } as any);
    });
  });

  describe('drawMarks()', () => {
    const duration = 50;
    beforeEach(() => {
      spyOn(component, 'setLine');
      spyOn(component, 'getTransitionDuration').and.returnValue(duration);
      spyOn(component, 'drawLines');
      spyOn(component, 'drawPointMarkers');
      spyOn(component, 'drawHoverDot');
      spyOn(component, 'drawLineLabels');
      component.config = new VicLinesConfig();
    });
    it('calls setLine once', () => {
      component.drawMarks();
      expect(component.setLine).toHaveBeenCalledTimes(1);
    });
    it('calls getTransitionDuration once', () => {
      component.drawMarks();
      expect(component.getTransitionDuration).toHaveBeenCalledTimes(1);
    });
    it('calls drawLines once and with the correct argument', () => {
      component.drawMarks();
      expect(component.drawLines).toHaveBeenCalledOnceWith(duration);
    });
    it('calls drawPointMarkers once with the correct argument if config.pointMarkers.display is truthy', () => {
      component.config.pointMarkers.display = true;
      component.drawMarks();
      expect(component.drawPointMarkers).toHaveBeenCalledOnceWith(duration);
    });
    it('does not call drawPointMarkers once if config.pointMarkers.display is falsy', () => {
      component.config.pointMarkers.display = false;
      component.drawMarks();
      expect(component.drawPointMarkers).toHaveBeenCalledTimes(0);
    });
    it('calls drawHoverDot once with the correct argument if config.pointMarkers.display is false and display hover dot is true', () => {
      component.config.pointMarkers.display = false;
      component.config.hoverDot.display = true;
      component.drawMarks();
      expect(component.drawHoverDot).toHaveBeenCalledTimes(1);
    });
    it('does not call drawHoverDot once if config.pointMarkers.display is true', () => {
      component.config.pointMarkers.display = true;
      component.drawMarks();
      expect(component.drawHoverDot).toHaveBeenCalledTimes(0);
    });
    it('calls drawLineLabels once if config.labelLines is true', () => {
      component.config.labelLines = true;
      component.drawMarks();
      expect(component.drawLineLabels).toHaveBeenCalledTimes(1);
    });
    it('does not call drawLineLabels once if config.labelLines is false', () => {
      component.drawMarks();
      expect(component.drawLineLabels).toHaveBeenCalledTimes(0);
    });
  });
});

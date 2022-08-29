import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../core/services/utilities.service';
import { HtmlTooltipConfig } from '../html-tooltip/html-tooltip.model';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesComponent } from './lines.component';
import { LinesConfig, PointMarkerConfig } from './lines.config';

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

    it('should call objectChangedNotFirstTime once and with the correct parameters', () => {
      component.ngOnChanges(configChange);
      expect(
        mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        true
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
    it('should call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns false', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
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
      spyOn(component, 'setChartTooltipProperty');
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
    it('calls setChartTooltipProperty once', () => {
      expect(component.setChartTooltipProperty).toHaveBeenCalledTimes(1);
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

  describe('setChartTooltipProperty()', () => {
    it('sets chart.htmlTooltip.exists to the correct value if tooltip.show is false', () => {
      component.config.tooltip.show = false;
      component.setChartTooltipProperty();
      expect(component.chart.htmlTooltip.exists).toEqual(false);
    });

    it('sets chart.htmlTooltip.exists to the correct value if tooltip.show is true and type is not svg', () => {
      component.config.tooltip.show = true;
      component.config.tooltip.type = 'svg';
      component.setChartTooltipProperty();
      expect(component.chart.htmlTooltip.exists).toEqual(false);
    });

    it('sets chart.htmlTooltip.exists to the correct value if tooltip.show is true and type is svg', () => {
      component.config.tooltip.show = true;
      component.config.tooltip.type = 'html';
      component.setChartTooltipProperty();
      expect(component.chart.htmlTooltip.exists).toEqual(true);
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

  describe('onPointerEnter()', () => {
    let setTooltipPositionSpy: jasmine.Spy;
    beforeEach(() => {
      setTooltipPositionSpy = jasmine.createSpy('setTooltipPosition');
      component.chart = {
        setTooltipPosition: setTooltipPositionSpy,
      } as any;
      component.config.tooltip.show = true;
    });
    it('calls setTooltipPosition on chart if config.showTooltip is true', () => {
      component.onPointerEnter();
      expect(component.chart.setTooltipPosition).toHaveBeenCalledTimes(1);
    });

    it('does not call setTooltipPosition on chart if config.showTooltip is false', () => {
      component.config.tooltip.show = false;
      component.onPointerEnter();
      expect(component.chart.setTooltipPosition).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPointerLeave()', () => {
    beforeEach(() => {
      spyOn(component, 'resetChartStylesAfterHover');
      component.config.tooltip.show = true;
    });
    it('calls resetChartStylesAfterHover if config.showTooltip is true', () => {
      component.onPointerLeave();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(1);
    });

    it('does not call resetChartStylesAfterHover if config.showTooltip is false', () => {
      component.config.tooltip.show = false;
      component.onPointerLeave();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPointerMove()', () => {
    let chartAreaSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getPointerValuesArray').and.returnValue([1, 2]);
      chartAreaSpy = spyOn(component, 'pointerIsInChartArea').and.returnValue(
        true
      );
      spyOn(component, 'determineHoverStyles');
    });
    it('calls getPointerValuesArray once with the correct argument', () => {
      component.onPointerMove('event' as any);
      expect(component.getPointerValuesArray).toHaveBeenCalledOnceWith(
        'event' as any
      );
    });

    describe('if config.showTooltip is true', () => {
      beforeEach(() => {
        component.config.tooltip.show = true;
      });
      it('calls pointerIsInChartArea once with the correct argument', () => {
        component.onPointerMove('event' as any);
        expect(component.pointerIsInChartArea).toHaveBeenCalledOnceWith(1, 2);
      });

      it('calls determineHoverStyles once with the correct arguments if pointerIsInChartArea returns true', () => {
        component.onPointerMove('event' as any);
        expect(component.determineHoverStyles).toHaveBeenCalledOnceWith(1, 2);
      });

      it('does not call determineHoverStyles once if pointerIsInChartArea returns false', () => {
        chartAreaSpy.and.returnValue(false);
        component.onPointerMove('event' as any);
        expect(component.determineHoverStyles).toHaveBeenCalledTimes(0);
      });
    });

    describe('if config.showTooltip is false', () => {
      it('does not call determineHoverStyles', () => {
        component.config.tooltip.show = false;
        component.onPointerMove('event' as any);
        expect(component.determineHoverStyles).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('pointerIsInChartArea()', () => {
    beforeEach(() => {
      component.ranges = {
        x: [0, 100],
        y: [400, 200],
      };
    });
    it('returns true if x is within x range and y is within y range', () => {
      expect(component.pointerIsInChartArea(50, 300)).toEqual(true);
    });

    it('returns false if x is not within x range', () => {
      expect(component.pointerIsInChartArea(150, 300)).toEqual(false);
    });

    it('returns false if y is not within y range', () => {
      expect(component.pointerIsInChartArea(50, 500)).toEqual(false);
    });
  });

  describe('determineHoverStyles()', () => {
    let radiusSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getClosestPointIndex').and.returnValue(10);
      radiusSpy = spyOn(component, 'pointerIsInsideShowTooltipRadius');
      spyOn(component, 'applyHoverStyles');
      spyOn(component, 'removeHoverStyles');
      component.config = { tooltipDetectionRadius: 10 } as any;
    });
    it('calls getClosestPointIndex once with the correct argument', () => {
      component.determineHoverStyles(1, 2);
      expect(component.getClosestPointIndex).toHaveBeenCalledOnceWith(1, 2);
    });

    describe('if pointerIsInsideShowTooltipRadius is truthy', () => {
      beforeEach(() => {
        radiusSpy.and.returnValue(true);
      });

      it('calls pointerIsInsideShowTooltipRadius once and with the correct values', () => {
        component.determineHoverStyles(1, 2);
        expect(radiusSpy).toHaveBeenCalledOnceWith(10, 1, 2);
      });

      it('calls applyHoverStyles once with the correct value if pointerIsInsideShowTooltipRadius returns true', () => {
        component.determineHoverStyles(1, 2);
        expect(component.applyHoverStyles).toHaveBeenCalledOnceWith(10);
      });
    });

    describe('if pointerIsInsideShowTooltipRadius is falsy', () => {
      beforeEach(() => {
        radiusSpy.and.returnValue(false);
      });
      it('calls removeHoverStyles', () => {
        component.determineHoverStyles(1, 2);
        expect(component.removeHoverStyles).toHaveBeenCalledTimes(1);
      });

      it('does not call applyHoverStyles', () => {
        component.determineHoverStyles(1, 2);
        expect(component.applyHoverStyles).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('applyHoverStyles', () => {
    beforeEach(() => {
      spyOn(component, 'styleLinesForHover');
      spyOn(component, 'styleMarkersForHover');
      spyOn(component, 'styleHoverDotForHover');
      spyOn(component, 'setTooltipData');
      spyOn(component, 'setTooltipOffsetValues');
      component.chart = { htmlTooltip: new HtmlTooltipConfig() } as any;
      component.chart.htmlTooltip.display = 'none';
      component.tooltipCurrentlyShown = false;
      component.config = { pointMarker: new PointMarkerConfig() } as any;
    });
    it('calls styleLinesForHover once with the correct argument', () => {
      component.applyHoverStyles(10);
      expect(component.styleLinesForHover).toHaveBeenCalledOnceWith(10);
    });

    it('calls styleMarkersForHover once with the correct argument if config.pointMarker.display is true', () => {
      component.config.pointMarker.display = true;
      component.applyHoverStyles(10);
      expect(component.styleMarkersForHover).toHaveBeenCalledOnceWith(10);
    });

    it('does not call styleMarkersForHover if config.pointMarker.display is false', () => {
      component.config.pointMarker.display = false;
      component.applyHoverStyles(10);
      expect(component.styleMarkersForHover).toHaveBeenCalledTimes(0);
    });

    it('calls styleHoverDotForHover once with the correct argument if config.pointMarker.display is false', () => {
      component.config.pointMarker.display = false;
      component.applyHoverStyles(10);
      expect(component.styleHoverDotForHover).toHaveBeenCalledOnceWith(10);
    });

    it('does not call styleHoverDotForHover is config.pointMarker is true', () => {
      component.config.pointMarker.display = true;
      component.applyHoverStyles(10);
      expect(component.styleHoverDotForHover).toHaveBeenCalledTimes(0);
    });

    it('calls setTooltipData once with the correct argument', () => {
      component.applyHoverStyles(10);
      expect(component.setTooltipData).toHaveBeenCalledOnceWith(10);
    });

    it('calls setTooltipOffsetValues once with the correct argument', () => {
      component.applyHoverStyles(10);
      expect(component.setTooltipOffsetValues).toHaveBeenCalledOnceWith(10);
    });

    it('sets chart.htmlTooltip.display to block', () => {
      component.applyHoverStyles(10);
      expect(component.chart.htmlTooltip.display).toBe('block');
    });

    it('sets tooltipCurrentlyShown to true', () => {
      component.applyHoverStyles(10);
      expect(component.tooltipCurrentlyShown).toBe(true);
    });
  });

  describe('removeHoverStyles()', () => {
    beforeEach(() => {
      component.tooltipCurrentlyShown = true;
      spyOn(component, 'resetChartStylesAfterHover');
    });
    it('calls resetChartStylesAfterHover once if tooltipIsCurrentlyShown is true', () => {
      component.removeHoverStyles();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(1);
    });

    it('sets tooltipIsCurrentlyShown to false if tooltipIsCurrentlyShown is true', () => {
      component.removeHoverStyles();
      expect(component.tooltipCurrentlyShown).toEqual(false);
    });

    it('does not call resetChartStylesAfterHover if tooltipIsCurrentlyShown is false', () => {
      component.tooltipCurrentlyShown = false;
      component.removeHoverStyles();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(0);
    });

    it('does not modify tooltipIsCurrentlyShown if tooltipIsCurrentlyShown is false', () => {
      component.tooltipCurrentlyShown = false;
      component.removeHoverStyles();
      expect(component.tooltipCurrentlyShown).toEqual(false);
    });
  });

  describe('pointerIsInsideShowTooltipRadius', () => {
    let distanceSpy: jasmine.Spy;
    beforeEach(() => {
      distanceSpy = spyOn(component, 'getPointerDistanceFromPoint');
      component.values = {
        x: [0, 1, 2, 3],
        y: [4, 5, 6, 7],
      } as any;
      component.config = {
        tooltip: { show: true, type: 'html', detectionRadius: 10 },
      } as any;
    });
    it('calls getPointerDistanceFromPoint once and with the correct values', () => {
      component.pointerIsInsideShowTooltipRadius(1, 10, 20);
      expect(component.getPointerDistanceFromPoint).toHaveBeenCalledOnceWith(
        1,
        5,
        10,
        20
      );
    });

    it('returns true is the return value from getPointerDistanceFromPoint is less tan tooltipDetectionRadius', () => {
      distanceSpy.and.returnValue(9);
      expect(component.pointerIsInsideShowTooltipRadius(1, 10, 20)).toEqual(
        true
      );
    });

    it('returns false is the return value from getPointerDistanceFromPoint is greater than tooltipDetectionRadius', () => {
      distanceSpy.and.returnValue(11);
      expect(component.pointerIsInsideShowTooltipRadius(1, 10, 20)).toEqual(
        false
      );
    });
  });
});

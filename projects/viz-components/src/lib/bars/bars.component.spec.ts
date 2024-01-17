/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternSet } from 'd3';
import { UtilitiesService } from '../core/services/utilities.service';
import { ColorUtilities } from '../shared/color-utilities.class';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { BarsComponent } from './bars.component';
import { VicBarsConfig, VicBarsLabelsConfig } from './bars.config';

describe('BarsComponent', () => {
  let component: BarsComponent;
  let fixture: ComponentFixture<BarsComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BarsComponent],
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
    fixture = TestBed.createComponent(BarsComponent);
    component = fixture.componentInstance;
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
      spyOn(component, 'initNonQuantitativeDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setHasBarsWithNegativeValues');
      spyOn(component, 'initUnpaddedQuantitativeDomain');
      spyOn(component, 'setQuantitativeDomainPadding');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initNonQuantitativeDomains once', () => {
      expect(component.initNonQuantitativeDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueArrayIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls setHasBarsWithNegativeValues once', () => {
      expect(component.setHasBarsWithNegativeValues).toHaveBeenCalledTimes(1);
    });

    it('calls initUnpaddedQuantitativeDomain once', () => {
      expect(component.initUnpaddedQuantitativeDomain).toHaveBeenCalledTimes(1);
    });

    it('calls setQuantitativeDomainPadding once', () => {
      expect(component.setQuantitativeDomainPadding).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'drawMarks');
      component.resizeMarks();
    });
    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with zero as the argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(0);
    });
  });

  describe('setValueArrays()', () => {
    beforeEach(() => {
      component.config = {
        data: [
          { color: 'red', value: 1, size: 10 },
          { color: 'orange', value: 2, size: 20 },
          { color: 'yellow', value: 3, size: 30 },
          { color: 'green', value: 4, size: 40 },
          { color: 'blue', value: 5, size: 50 },
        ],
        ordinal: {
          valueAccessor: (x) => x.size,
        },
        quantitative: {
          valueAccessor: (x) => x.value,
        },
        category: {
          valueAccessor: (x) => x.color,
        },
        dimensions: {
          x: 'ordinal',
          y: 'quantitative',
        },
      } as any;
    });
    describe('if x dimension is ordinal', () => {
      it('correctly sets x values', () => {
        component.setValueArrays();
        expect(component.values.x).toEqual([10, 20, 30, 40, 50]);
      });

      it('correctly sets y values', () => {
        component.setValueArrays();
        expect(component.values.y).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('if x dimension is quantitative', () => {
      beforeEach(() => {
        component.config.dimensions = {
          x: 'quantitative',
          y: 'ordinal',
        } as any;
      });
      it('correctly sets x values', () => {
        component.setValueArrays();
        expect(component.values.x).toEqual([1, 2, 3, 4, 5]);
      });

      it('correctly sets y values', () => {
        component.setValueArrays();
        expect(component.values.y).toEqual([10, 20, 30, 40, 50]);
      });
    });

    it('correctly sets category values', () => {
      component.setValueArrays();
      expect(component.values.category).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });
  });

  describe('initNonQuantitativeDomains', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, 5],
        y: [10, 20, 30, 40, 50],
        category: ['red', 'orange', 'yellow', 'green', 'blue'],
      } as any;
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        ordinal: {},
        category: {},
      } as any;
    });
    describe('ordinal is x dimension', () => {
      it('correctly defines ordinal.domain if ordinal.domain is undefined', () => {
        component.config.ordinal.domain = undefined;
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          1, 2, 3, 4, 5,
        ]);
      });

      it('correctly defines ordinal.domain if ordinal.domain is defined', () => {
        component.config.ordinal.domain = [0, 1, 2, 3, 3, 11, 11, 12];
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          0, 1, 2, 3, 11, 12,
        ]);
      });
    });

    describe('ordinal is y dimension', () => {
      beforeEach(() => {
        component.config.dimensions = {
          ordinal: 'y',
        } as any;
      });
      it('correctly defines ordinal.domain if ordinal.domain is undefined', () => {
        component.config.ordinal.domain = undefined;
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          50, 40, 30, 20, 10,
        ]);
      });

      it('correctly defines ordinal.domain if ordinal.domain is defined', () => {
        component.config.ordinal.domain = [0, 10, 20, 30, 30, 110, 110, 120];
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          120, 110, 30, 20, 10, 0,
        ]);
      });
    });

    it('correctly defines category.domain if category.domain is undefined', () => {
      component.config.category.domain = undefined;
      component.initNonQuantitativeDomains();
      expect(Array.from(component.config.category.domain)).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });

    it('correctly defines category.domain if category.domain is defined', () => {
      component.config.category.domain = [
        'red',
        'red',
        'orange',
        'yellow',
        'yellow',
        'green',
        'blue',
      ];
      component.initNonQuantitativeDomains();
      expect(Array.from(component.config.category.domain)).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });
  });

  describe('setValueIndicies', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, 5],
        y: [10, 20, 30, 40, 50],
        category: ['red', 'orange', 'yellow', 'green', 'blue'],
      } as any;
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        ordinal: {
          domain: new InternSet([1, 2, 3, 4, 5]),
        },
      } as any;
    });
    describe('ordinal is x dimension', () => {
      it('correctly sets ordinal.valueIndicies if all values are in ordinal domain', () => {
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([0, 1, 2, 3, 4]);
      });

      it('correctly sets ordinal.valueIndicies if not all values are in ordinal domain', () => {
        component.values.x = [6, 1, 2, 3, 4, 5];
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('ordinal is y dimension', () => {
      beforeEach(() => {
        component.config.ordinal.domain = new InternSet([10, 20, 30, 40, 50]);
        component.config.dimensions.ordinal = 'y';
      });
      it('correctly sets ordinal.valueIndicies if all values are in ordinal domain', () => {
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([0, 1, 2, 3, 4]);
      });

      it('correctly sets ordinal.valueIndicies if not all values are in ordinal domain', () => {
        component.values.y = [60, 10, 20, 30, 40, 50];
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([1, 2, 3, 4, 5]);
      });
    });
  });

  describe('setHasBarsWithNegativeValues', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, -5],
      } as any;
      component.config = new VicBarsConfig();
      component.config.dimensions.quantitative = 'x';
    });
    it('integration: sets hasBarsWithNegativeValues to true if dataMin is less than zero', () => {
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(true);
    });
    it('integration: sets hasBarsWithNegativeValues to false if dataMin is greater than zero', () => {
      component.values.x = [1, 2, 3, 4, 5];
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(false);
    });
  });

  describe('int: initUnpaddedQuantitativeDomain()', () => {
    describe('when min and max are positive', () => {
      beforeEach(() => {
        component.config = {
          quantitative: {
            domain: [2, 97],
          },
        } as any;
      });

      it('sets min to zero, max stays the same', () => {
        component.initUnpaddedQuantitativeDomain();
        expect(component.unpaddedQuantitativeDomain).toEqual([0, 97]);
      });
    });

    describe('when min and max are negative', () => {
      beforeEach(() => {
        component.config = {
          quantitative: {
            domain: [-277, -6],
          },
        } as any;
      });

      it('sets max to zero, min stays the same', () => {
        component.initUnpaddedQuantitativeDomain();
        expect(component.unpaddedQuantitativeDomain).toEqual([-277, 0]);
      });
    });

    describe('when min is negative and max is positive', () => {
      beforeEach(() => {
        component.config = {
          quantitative: {
            domain: [-3, 44],
          },
        } as any;
      });

      it('max and min stay the same', () => {
        component.initUnpaddedQuantitativeDomain();
        expect(component.unpaddedQuantitativeDomain).toEqual([-3, 44]);
      });
    });
  });

  describe('setScaledSpaceProperties', () => {
    beforeEach(() => {
      component.config = {
        dimensions: { ordinal: 'x' },
      } as any;
      component.chart = {
        updateXScale: jasmine.createSpy('updateXScale'),
        updateYScale: jasmine.createSpy('updateYScale'),
      } as any;
      spyOn(component, 'getOrdinalScale').and.returnValue('ord scale');
      spyOn(component, 'getQuantitativeScale').and.returnValue('quant scale');
      spyOn(component, 'setQuantitativeDomainPadding');
    });
    it('calls getOrdinalScale once', () => {
      component.setScaledSpaceProperties();
      expect(component.getOrdinalScale).toHaveBeenCalledTimes(1);
    });

    it('calls getQuantitativeScale once', () => {
      component.setScaledSpaceProperties();
      expect(component.getQuantitativeScale).toHaveBeenCalledTimes(1);
    });

    it('calls setQuantitativeDomainPadding once', () => {
      component.setScaledSpaceProperties();
      expect(component.setQuantitativeDomainPadding).toHaveBeenCalledTimes(1);
    });

    describe('if ordinal is x', () => {
      it('calls updateXScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.chart.updateXScale).toHaveBeenCalledOnceWith(
          'ord scale' as any
        );
      });

      it('calls updateYScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.chart.updateYScale).toHaveBeenCalledOnceWith(
          'quant scale' as any
        );
      });
    });

    describe('if ordinal is not x', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls updateXScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.chart.updateXScale).toHaveBeenCalledOnceWith(
          'quant scale' as any
        );
      });

      it('calls updateYScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.chart.updateYScale).toHaveBeenCalledOnceWith(
          'ord scale' as any
        );
      });
    });
  });

  describe('drawMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'drawBars');
      spyOn(component, 'drawBarLabels');
      component.config = new VicBarsConfig();
      component.config.labels = new VicBarsLabelsConfig();
    });
    it('calls drawBars once with the correct parameter', () => {
      component.drawMarks(100);
      expect(component.drawBars).toHaveBeenCalledOnceWith(100);
    });

    it('calls drawBarLabels if config.labels is truthy', () => {
      component.drawMarks(100);
      expect(component.drawBarLabels).toHaveBeenCalledTimes(1);
    });

    it('does not call drawBarLabels if config.labels is falsey', () => {
      component.config.labels = undefined;
      component.drawMarks(100);
      expect(component.drawBarLabels).not.toHaveBeenCalled();
    });
  });

  describe('getBarX()', () => {
    beforeEach(() => {
      spyOn(component, 'getBarXOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarXQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarXOrdinal once with the correct value', () => {
        component.getBarX(100);
        expect(component.getBarXOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarXQuantitative', () => {
        component.getBarX(100);
        expect(component.getBarXQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarX(100)).toEqual('ordinal' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarXQuantitative once with the correct value', () => {
        component.getBarX(100);
        expect(component.getBarXQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarXOrdinal', () => {
        component.getBarX(100);
        expect(component.getBarXOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarX(100)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarXOrdinal()', () => {
    beforeEach(() => {
      component.xScale = jasmine.createSpy('xScale').and.returnValue(10);
      component.values.x = [1, 2, 3];
    });
    it('calls xScale once and with the correct value', () => {
      component.getBarXOrdinal(2);
      expect(component.xScale).toHaveBeenCalledOnceWith(3);
    });
    it('returns the correct value', () => {
      expect(component.getBarXOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarXQuantitative()', () => {
    beforeEach(() => {
      component.xScale = jasmine.createSpy('xScale').and.returnValue(50);
      component.hasBarsWithNegativeValues = true;
      component.values.x = [1, 2, 3];
      component.config = {
        quantitative: {
          domain: [2, 10],
        },
      } as any;
    });

    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale once and with the correct value if x value is less than zero', () => {
        component.values.x = [-1, 2, 3];
        component.getBarXQuantitative(0);
        expect(component.xScale).toHaveBeenCalledOnceWith(-1);
      });

      it('calls xScale once with 0 if x value is greater than zero', () => {
        component.getBarXQuantitative(2);
        expect(component.xScale).toHaveBeenCalledOnceWith(0);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls xScale once and with the correct value', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarXQuantitative(0);
        expect(component.xScale).toHaveBeenCalledOnceWith(2);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarXQuantitative(0)).toEqual(50);
    });
  });

  describe('getBarY', () => {
    beforeEach(() => {
      spyOn(component, 'getBarYOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarYQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'y' } } as any;
    });
    describe('y dimension is ordinal', () => {
      it('calls getBarYOrdinal once with the correct value', () => {
        component.getBarY(100);
        expect(component.getBarYOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarYQuantitative', () => {
        component.getBarY(100);
        expect(component.getBarYQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarY(100)).toEqual('ordinal' as any);
      });
    });

    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'x';
      });

      it('calls getBarYQuantitative once with the correct value', () => {
        component.getBarY(100);
        expect(component.getBarYQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarYOrdinal', () => {
        component.getBarY(100);
        expect(component.getBarYOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarY(100)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarYOrdinal', () => {
    beforeEach(() => {
      component.yScale = jasmine.createSpy('yScale').and.returnValue(50);
      component.values.y = [1, 2, 3];
    });
    it('calls yScale once and with the correct value', () => {
      component.getBarYOrdinal(2);
      expect(component.yScale).toHaveBeenCalledOnceWith(3);
    });

    it('returns the correct value', () => {
      expect(component.getBarYOrdinal(2)).toEqual(50);
    });
  });

  describe('getBarYQuantitative', () => {
    beforeEach(() => {
      component.yScale = jasmine.createSpy('yScale').and.returnValue(50);
      component.values.y = [1, 2, 3];
    });

    it('calls yScale once with 0 if y value is less than zero', () => {
      component.values.y = [-1, 2, 3];
      component.getBarYQuantitative(0);
      expect(component.yScale).toHaveBeenCalledOnceWith(0);
    });

    it('calls yScale once with the y value if y value is greater than zero', () => {
      component.getBarYQuantitative(2);
      expect(component.yScale).toHaveBeenCalledOnceWith(3);
    });

    it('returns the correct value', () => {
      expect(component.getBarYQuantitative(0)).toEqual(50);
    });
  });

  describe('getBarWidth', () => {
    let ordinalSpy: jasmine.Spy;
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      ordinalSpy = spyOn(component, 'getBarWidthOrdinal').and.returnValue(300);
      quantSpy = spyOn(component, 'getBarWidthQuantitative').and.returnValue(
        200
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarWidthOrdinal once with the correct value', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledTimes(1);
      });

      it('does not call getBarWidthQuantitative', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual(300);
      });

      it('returns 0 if getOrdinal returns undefined', () => {
        ordinalSpy.and.returnValue(undefined);
        expect(component.getBarWidth(100)).toEqual(0);
      });

      it('returns 0 if getOrdinal returns null', () => {
        ordinalSpy.and.returnValue(null);
        expect(component.getBarWidth(100)).toEqual(0);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarWidthQuantitative once with the correct value', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarWidthOrdinal', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual(200);
      });

      it('returns 0 if getQuantitative returns undefined', () => {
        quantSpy.and.returnValue(undefined);
        expect(component.getBarWidth(100)).toEqual(0);
      });

      it('returns 0 if getQuantitative returns null', () => {
        quantSpy.and.returnValue(null);
        expect(component.getBarWidth(100)).toEqual(0);
      });
    });
  });

  describe('getBarWidthOrdinal', () => {
    beforeEach(() => {
      component.xScale = {
        bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
      } as any;
    });
    it('calls xScale.bandwidth once', () => {
      component.getBarWidthOrdinal();
      expect((component.xScale as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarWidthOrdinal()).toEqual(10);
    });
  });

  describe('getBarWidthQuantitative', () => {
    let xScaleSpy: jasmine.Spy;
    beforeEach(() => {
      xScaleSpy = jasmine.createSpy('xScale').and.returnValues(20, 50);
      component.xScale = xScaleSpy;
      component.hasBarsWithNegativeValues = true;
      component.values.x = [1, 2, 3];
      component.config = {
        quantitative: {
          domain: [2, 10],
        },
      } as any;
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale twice and with the correct values', () => {
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [0]]);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls xScale twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [2]]);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarWidthQuantitative(2)).toEqual(30);
    });
  });

  describe('getBarHeight', () => {
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarHeightQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarHeightQuantitative once with the correct value', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightQuantitative).toHaveBeenCalledOnceWith(
          100
        );
      });

      it('does not call getBarHeightOrdinal', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual('quantitative' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarHeightOrdinal once with the correct value', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledTimes(1);
      });

      it('does not call getBarHeightQuantitative', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual('ordinal' as any);
      });
    });
  });

  describe('getBarHeightOrdinal', () => {
    beforeEach(() => {
      component.yScale = {
        bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
      } as any;
    });
    it('calls yScale.bandwidth once', () => {
      component.getBarHeightOrdinal();
      expect((component.yScale as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightOrdinal()).toEqual(10);
    });
  });

  describe('getBarHeightQuantitative()', () => {
    let yScaleSpy: jasmine.Spy;
    beforeEach(() => {
      yScaleSpy = jasmine.createSpy('yScale').and.returnValue(-50);
      component.yScale = yScaleSpy;
      component.hasBarsWithNegativeValues = true;
      component.values.y = [1, 2, 3];
      component.config = {
        quantitative: {
          domain: [2, 10],
        },
      } as any;
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls yScale once and with the correct values', () => {
        component.getBarHeightQuantitative(2);
        expect(yScaleSpy).toHaveBeenCalledTimes(2);
        expect(yScaleSpy.calls.all()[0].args[0]).toEqual(0);
        expect(yScaleSpy.calls.all()[1].args[0]).toEqual(3);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls yScale once and with the correct value', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarHeightQuantitative(2);
        expect(yScaleSpy).toHaveBeenCalledTimes(2);
        expect(yScaleSpy.calls.all()[0].args[0]).toEqual(2);
        expect(yScaleSpy.calls.all()[1].args[0]).toEqual(3);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightQuantitative(2)).toEqual(0);
    });
  });

  describe('getBarPattern', () => {
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('blue');
      const colorScaleSpy = jasmine
        .createSpy('colorScale')
        .and.returnValue('blue');
      component.config = {
        dimensions: { ordinal: 'x' },
        category: {
          colorScale: colorScaleSpy,
        },
        data: [1, 2, 3],
      } as any;
      component.values.x = [1, 2, 3];
    });
    it('returns correct value when pattern is used', () => {
      component.config.patternPredicates = [
        { patternName: 'pattern', predicate: (d: any) => true },
      ];
      const result = component.getBarPattern(0);
      expect(result).toEqual(`url(#pattern)`);
    });
  });

  describe('getBarColor()', () => {
    beforeEach(() => {
      const colorScaleSpy = jasmine
        .createSpy('colorScale')
        .and.returnValue('blue');
      component.config = {
        dimensions: { ordinal: 'x' },
        category: {
          colorScale: colorScaleSpy,
        },
        data: [1, 2, 3],
      } as any;
      component.values.x = [1, 2, 3];
    });
    it('calls colorScale once with the correct value', () => {
      component.getBarColor(0);
      expect(component.config.category.colorScale).toHaveBeenCalledOnceWith(1);
    });
    it('returns the correct value', () => {
      const result = component.getBarColor(0);
      expect(result).toEqual('blue');
    });
  });

  describe('getBarLabelText', () => {
    beforeEach(() => {
      component.config = new VicBarsConfig();
      component.config = {
        dimensions: { quantitative: 'x' },
        quantitative: {
          valueFormat: ',.1f',
        },
        labels: {
          noValueFunction: (d) => 'no value',
        },
      } as any;
      component.values.x = [10000.1, 20000.2, 30000.3];
      component.config.data = [1, 2, 3];
    });
    describe('if user has provided a custom formatting function', () => {
      beforeEach(() => {
        component.config.quantitative.valueFormat = (value) => value + '!';
      });
      it('integration: returns the correct value correctly formatted as a string', () => {
        expect(component.getBarLabelText(1)).toEqual('2!');
      });
      it('integration: returns the correct value correctly formatted as a string if value is null or undefined', () => {
        component.values.x = [null, undefined, null];
        expect(component.getBarLabelText(1)).toEqual('no value');
      });
    });
    describe('integration: if user has not provided a custom formatting function', () => {
      it('integration: returns the result of the noValueFunction if value null or undefined', () => {
        component.values.x = [null, undefined, null];
        expect(component.getBarLabelText(1)).toEqual('no value');
      });
      it('integration: returns the correct value correctly formatted as a string if value is not null or undefined', () => {
        expect(component.getBarLabelText(1)).toEqual('20,000.2');
      });
    });
  });

  describe('getBarLabelTextAnchor', () => {
    let barLabelFitsOutsideBarSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = new VicBarsConfig();
      barLabelFitsOutsideBarSpy = spyOn(component, 'barLabelFitsOutsideBar');
    });

    it('returns middle if the x axis is ordinal', () => {
      component.config = {
        dimensions: { ordinal: 'x' },
      } as any;
      expect(component.getBarLabelTextAnchor(0)).toBe('middle');
    });

    describe('if the x axis is quantitative', () => {
      beforeEach(() => {
        component.config = {
          dimensions: { quantitative: 'x' },
        } as any;
      });
      it('returns start if the value is null', () => {
        component.values.x = [1, null, 3];
        expect(component.getBarLabelTextAnchor(1)).toBe('start');
      });
      it('returns start if the value is undefined', () => {
        component.values.x = [1, undefined, 3];
        expect(component.getBarLabelTextAnchor(1)).toBe('start');
      });
      it('calls barLabelFitsOutsideBar once when value is defined', () => {
        component.values.x = [1, 2, 3];
        component.getBarLabelTextAnchor(1);
        expect(barLabelFitsOutsideBarSpy).toHaveBeenCalledOnceWith(1, true);
      });

      describe('if the label fits outside the bar', () => {
        beforeEach(() => {
          barLabelFitsOutsideBarSpy.and.returnValue(true);
        });

        it('returns start when value is positive', () => {
          component.values.x = [1, 2, 3];
          expect(component.getBarLabelTextAnchor(1)).toBe('start');
        });
        it('returns end when value is negative', () => {
          component.values.x = [1, -2, 3];
          expect(component.getBarLabelTextAnchor(1)).toBe('end');
        });
      });

      describe('if the label does not fit outside the bar', () => {
        beforeEach(() => {
          barLabelFitsOutsideBarSpy.and.returnValue(false);
        });

        it('returns end when value is positive', () => {
          component.values.x = [1, 2, 3];
          expect(component.getBarLabelTextAnchor(1)).toBe('end');
        });
        it('returns start when value is negative', () => {
          component.values.x = [1, -2, 3];
          expect(component.getBarLabelTextAnchor(1)).toBe('start');
        });
      });
    });
  });

  describe('getBarLabelDominantBaseline', () => {
    let barFitsOutsideSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = {
        dimensions: { ordinal: 'x', quantitative: 'y' },
      } as any;
      component.values.y = [1, 2, 3];
      barFitsOutsideSpy = spyOn(component, 'barLabelFitsOutsideBar');
    });
    describe('x dimension is ordinal', () => {
      it('returns hanging if value is positive and bar label does not fit outside bar', () => {
        barFitsOutsideSpy.and.returnValue(false);
        expect(component.getBarLabelDominantBaseline(1)).toBe('hanging');
      });
      it('returns hanging if value is negative and bar label fits outside bar', () => {
        component.values.y = [1, -2, 3];
        barFitsOutsideSpy.and.returnValue(true);
        expect(component.getBarLabelDominantBaseline(1)).toBe('hanging');
      });
      it('returns alphabetical if value is positive and bar label fits outside bar', () => {
        barFitsOutsideSpy.and.returnValue(true);
        expect(component.getBarLabelDominantBaseline(1)).toBe('alphabetical');
      });
      it('returns alphabetical if value is negative and bar label does not fit outside bar', () => {
        component.values.y = [1, -2, 3];
        barFitsOutsideSpy.and.returnValue(false);
        expect(component.getBarLabelDominantBaseline(1)).toBe('alphabetical');
      });
      it('returns alphabetical if value is undefined', () => {
        component.values.y = [1, null, 3];
        expect(component.getBarLabelDominantBaseline(1)).toBe('alphabetical');
      });
    });

    it('returns central if x dimension is not ordinal', () => {
      component.config.dimensions.ordinal = 'y';
      expect(component.getBarLabelDominantBaseline(1)).toEqual('central');
    });
  });

  describe('getBarLabelColor', () => {
    let barLabelFitsOutsideBarSpy: jasmine.Spy;

    beforeEach(() => {
      barLabelFitsOutsideBarSpy = spyOn(component, 'barLabelFitsOutsideBar');
      spyOn(ColorUtilities, 'selectColorBasedOnContrastRatio').and.returnValue(
        'selected label color'
      );
      spyOn(component, 'getBarColor').and.returnValue('bar color');
      component.config = new VicBarsConfig();
      component.config = {
        dimensions: { quantitative: 'x' },
      } as any;
      component.config.labels = new VicBarsLabelsConfig();
      component.values.x = [1, 2, 3];
    });

    it('calls getBarLabelColor once', () => {
      component.getBarLabelColor(1);
      expect(barLabelFitsOutsideBarSpy).toHaveBeenCalledOnceWith(1, true);
    });
    it('returns the dark label color if the label fits outside of the bar', () => {
      barLabelFitsOutsideBarSpy.and.returnValue(true);
      expect(component.getBarLabelColor(1)).toBe('#000000');
    });

    describe('if the label does not fit outside the bar', () => {
      let labelColor: string;
      beforeEach(() => {
        barLabelFitsOutsideBarSpy.and.returnValue(false);
        labelColor = component.getBarLabelColor(1);
      });

      it('calls getBarColor once', () => {
        expect(component.getBarColor).toHaveBeenCalledOnceWith(1);
      });
      it('calls ColorUtilities.selectColorBasedOnContrastRatio once', () => {
        expect(
          ColorUtilities.selectColorBasedOnContrastRatio
        ).toHaveBeenCalledOnceWith('#000000', '#ffffff', 'bar color');
      });
      it('returns the selected label color', () => {
        expect(labelColor).toBe('selected label color');
      });
    });
  });

  describe('barLabelFitsOutsideBar', () => {
    let distanceSpy: jasmine.Spy;
    let maxHeightSpy: jasmine.Spy;
    let maxWidthSpy: jasmine.Spy;

    beforeEach(() => {
      component.values = {
        x: [1, 2, 3],
        y: [4, 5, 6],
      } as any;
      component.ranges = {
        x: [0, 100],
        y: [0, 200],
      };
      component.yScale = jasmine.createSpy('yScale').and.returnValue(50);
      component.xScale = jasmine.createSpy('xScale').and.returnValue(100);
      distanceSpy = spyOn(component, 'getBarToChartEdgeDistance');
      maxHeightSpy = spyOn(component, 'getMaxBarLabelHeight');
      maxWidthSpy = spyOn(component, 'getMaxBarLabelWidth');
      component.config = {
        dimensions: { ordinal: 'x' },
      } as any;
    });
    describe('if the x dimension is ordinal', () => {
      it('calls getBarToChartEdgeDistance once', () => {
        component.barLabelFitsOutsideBar(1, true);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [0, 200],
          50
        );
      });
      it('calls getMaxBarLabelHeight once', () => {
        component.barLabelFitsOutsideBar(1, true);
        expect(maxHeightSpy).toHaveBeenCalledTimes(1);
      });
      it('returns true if the bar to chart edge space is greater than the max bar label height', () => {
        distanceSpy.and.returnValue(10);
        maxHeightSpy.and.returnValue(2);
        expect(component.barLabelFitsOutsideBar(1, true)).toBeTrue();
      });
      it('returns false if the bar to chart edge space is less than the max bar label height', () => {
        distanceSpy.and.returnValue(2);
        maxHeightSpy.and.returnValue(10);
        expect(component.barLabelFitsOutsideBar(1, true)).toBeFalse();
      });
    });
    describe('if the x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: { ordinal: 'y' },
        } as any;
      });
      it('calls getBarToChartEdgeDistance once', () => {
        component.barLabelFitsOutsideBar(1, true);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [0, 100],
          100
        );
      });
      it('calls getMaxBarLabelWidth once', () => {
        component.barLabelFitsOutsideBar(1, true);
        expect(maxWidthSpy).toHaveBeenCalledOnceWith(1);
      });
      it('returns true if the bar to chart edge space is greater than the max bar label width', () => {
        distanceSpy.and.returnValue(10);
        maxWidthSpy.and.returnValue(2);
        expect(component.barLabelFitsOutsideBar(1, true)).toBeTrue();
      });
      it('returns false if the bar to chart edge space is less than the max bar label height', () => {
        distanceSpy.and.returnValue(2);
        maxWidthSpy.and.returnValue(10);
        expect(component.barLabelFitsOutsideBar(1, true)).toBeFalse();
      });
    });
  });

  describe('getBarToChartEdgeDistance', () => {
    it('returns the upper range less the bar value if the value is positive', () => {
      expect(component.getBarToChartEdgeDistance(true, [0, 100], 20)).toBe(80);
    });
    it('returns the bar value less the lower range if the value is negative', () => {
      expect(component.getBarToChartEdgeDistance(false, [-100, 0], -60)).toBe(
        40
      );
    });
  });

  describe('getMaxBarLabelWidth', () => {
    beforeEach(() => {
      spyOn(component, 'getBarLabelText').and.returnValue('$2,000');
      component.config = {
        labels: {
          offset: 10,
        },
      } as any;
    });

    it('calls getBarLabelText once', () => {
      component.getMaxBarLabelWidth(1);
      expect(component.getBarLabelText).toHaveBeenCalledOnceWith(1);
    });
    it('returns the max bar label width', () => {
      expect(component.getMaxBarLabelWidth(1)).toBe(58);
    });
  });

  describe('getMaxBarLabelHeight', () => {
    beforeEach(() => {
      component.config = {
        labels: {
          offset: 4,
        },
      } as any;
    });
    it('returns the max bar label height', () => {
      expect(component.getMaxBarLabelHeight()).toBe(23.2);
    });
  });

  describe('getBarLabelX', () => {
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(10);
      spyOn(component, 'getBarLabelCoordinate').and.returnValue(50);
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'x',
          },
        } as any;
      });
      it('calls getBarWidthOrdinal once', () => {
        component.getBarLabelX(1);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(1)).toEqual(5);
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'y',
          },
        } as any;
      });
      it('calls getBarLabelCoordinate once', () => {
        component.getBarLabelX(1);
        expect(component.getBarLabelCoordinate).toHaveBeenCalledOnceWith(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(1)).toEqual(50);
      });
    });
  });

  describe('getBarLabelX', () => {
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(10);
      spyOn(component, 'getBarLabelCoordinate').and.returnValue(50);
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'x',
          },
        } as any;
      });
      it('calls getBarLabelCoordinate once', () => {
        component.getBarLabelY(1);
        expect(component.getBarLabelCoordinate).toHaveBeenCalledOnceWith(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(1)).toEqual(50);
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'y',
          },
        } as any;
      });
      it('calls getBarHeightOrdinal once', () => {
        component.getBarLabelY(1);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(1)).toEqual(5);
      });
    });
  });

  describe('getBarLabelCoordinate', () => {
    beforeEach(() => {
      spyOn(component, 'barLabelFitsOutsideBar').and.returnValue(true);
      spyOn(component, 'getBarLabelCoordinateWithOffset').and.returnValue(20);
      component.config = {
        dimensions: {
          quantitative: 'x',
        },
        labels: {
          offset: 8,
        },
      } as any;
      component.values.x = [null, 2, 3];
    });
    it('returns the label config offset if the value is null', () => {
      expect(component.getBarLabelCoordinate(0)).toBe(8);
    });
    it('calls barLabelFitsOutsideBar once', () => {
      component.getBarLabelCoordinate(1);
      expect(component.barLabelFitsOutsideBar).toHaveBeenCalledOnceWith(
        1,
        true
      );
    });
    it('calls getBarLabelCoordinateWithOffset once', () => {
      component.getBarLabelCoordinate(1);
      expect(
        component.getBarLabelCoordinateWithOffset
      ).toHaveBeenCalledOnceWith(1, true, true);
    });
    it('returns the bar coordinate with offset', () => {
      expect(component.getBarLabelCoordinate(1)).toBe(20);
    });
  });

  describe('getBarLabelCoordinateWithOffset', () => {
    beforeEach(() => {
      spyOn(component, 'getBarLabelOrigin').and.returnValue(10);
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        labels: {
          offset: 8,
        },
      } as any;
    });
    it('calls getBarLabelOrigin once', () => {
      component.getBarLabelCoordinateWithOffset(1, true, false);
      expect(component.getBarLabelOrigin).toHaveBeenCalledOnceWith(1, true);
    });
    describe('if x dimension is ordinal', () => {
      describe('bar label fits outside bar', () => {
        it('returns the origin less offset if the value is positive', () => {
          expect(component.getBarLabelCoordinateWithOffset(1, true, true)).toBe(
            2
          );
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(
            component.getBarLabelCoordinateWithOffset(1, false, true)
          ).toBe(18);
        });
      });
      describe('bar label does not fit outside bar', () => {
        it('returns the origin plus offset if the value is positive', () => {
          expect(
            component.getBarLabelCoordinateWithOffset(1, true, false)
          ).toBe(18);
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(
            component.getBarLabelCoordinateWithOffset(1, false, false)
          ).toBe(2);
        });
      });
    });
    describe('if y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      describe('bar label does not fit outside bar', () => {
        it('returns the origin less offset if the value is positive', () => {
          expect(
            component.getBarLabelCoordinateWithOffset(1, true, false)
          ).toBe(2);
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(
            component.getBarLabelCoordinateWithOffset(1, false, false)
          ).toBe(18);
        });
      });
      describe('bar label fits outside bar', () => {
        it('returns the origin plus offset if the value is positive', () => {
          expect(component.getBarLabelCoordinateWithOffset(1, true, true)).toBe(
            18
          );
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(
            component.getBarLabelCoordinateWithOffset(1, false, true)
          ).toBe(2);
        });
      });
    });
  });

  describe('getBarLabelOrigin', () => {
    let heightQuantSpy: jasmine.Spy;
    let widthQuantSpy: jasmine.Spy;
    beforeEach(() => {
      heightQuantSpy = spyOn(
        component,
        'getBarHeightQuantitative'
      ).and.returnValue(10);
      widthQuantSpy = spyOn(
        component,
        'getBarWidthQuantitative'
      ).and.returnValue(20);
      component.config = {
        labels: {
          offset: 4,
        },
        dimensions: {
          ordinal: 'x',
        },
      } as any;
    });

    describe('x dimension is ordinal', () => {
      it('returns 0 if value is positive', () => {
        expect(component.getBarLabelOrigin(1, true)).toBe(0);
      });

      describe('value is negative', () => {
        it('calls getBarHeightQuantitative once', () => {
          component.getBarLabelOrigin(1, false);
          expect(heightQuantSpy).toHaveBeenCalledOnceWith(1);
        });
        it('returns 0 if getBarHeightQuantitative does not return a number', () => {
          heightQuantSpy.and.returnValue(null as any);
          expect(component.getBarLabelOrigin(1, false)).toBe(0);
        });
        it('returns the correct value if getBarHeightQuantitative returns a number', () => {
          heightQuantSpy.and.returnValue(50);
          expect(component.getBarLabelOrigin(1, false)).toBe(50);
        });
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      describe('value is positive', () => {
        it('calls getBarWidthQuantitative once', () => {
          component.getBarLabelOrigin(1, true);
          expect(widthQuantSpy).toHaveBeenCalledOnceWith(1);
        });
        it('returns 0 if getBarWidthQuantitative does not return a number', () => {
          widthQuantSpy.and.returnValue(null as any);
          expect(component.getBarLabelOrigin(1, true)).toBe(0);
        });
        it('returns the correct value if getBarWidthQuantitative returns a number', () => {
          widthQuantSpy.and.returnValue(50);
          expect(component.getBarLabelOrigin(1, true)).toBe(50);
        });
      });
      it('returns 0 if value is negative', () => {
        expect(component.getBarLabelOrigin(1, false)).toBe(0);
      });
    });
  });
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../core/services/utilities.service';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { GeographiesComponent, MapDataValues } from './geographies.component';
import {
  CategoricalAttributeDataDimensionConfig,
  CustomBreaksQuantitativeAttributeDataDimensionConfig,
  DataGeographyConfig,
  EqualNumbersQuantitativeAttributeDataDimensionConfig,
  EqualValuesQuantitativeAttributeDataDimensionConfig,
  GeographiesConfig,
  NoBinsQuantitativeAttributeDataDimensionConfig,
} from './geographies.config';

describe('GeographiesComponent', () => {
  let component: GeographiesComponent;
  let fixture: ComponentFixture<GeographiesComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [GeographiesComponent],
      providers: [
        MapChartComponent,
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographiesComponent);
    component = fixture.componentInstance;
    component.config = new GeographiesConfig();
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

    it('calls setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        true
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });

    it('does not  call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns false', () => {
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
      spyOn(component, 'setMethodsFromConfigAndDraw');
    });

    it('calls subscribeToRanges once', () => {
      component.ngOnInit();
      expect(component.subscribeToRanges).toHaveBeenCalledTimes(1);
    });

    it('calls setMethodsFromConfigAndDraw once', () => {
      component.ngOnInit();
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setProjection');
      spyOn(component, 'setPath');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.resizeMarks();
    });
    it('calls setProjection once', () => {
      expect(component.setProjection).toHaveBeenCalledTimes(1);
    });

    it('calls setPath once', () => {
      expect(component.setPath).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once', () => {
      expect(component.drawMarks).toHaveBeenCalledTimes(1);
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setProjection');
      spyOn(component, 'setPath');
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initAttributeDataScaleDomain');
      spyOn(component, 'initAttributeDataScaleRange');
      spyOn(component, 'initAttributeDataScaleAndUpdateChart');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });
    it('calls setProjection once', () => {
      expect(component.setProjection).toHaveBeenCalledTimes(1);
    });

    it('calls setPath once', () => {
      expect(component.setPath).toHaveBeenCalledTimes(1);
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initDataScaleDomain once', () => {
      expect(component.initAttributeDataScaleDomain).toHaveBeenCalledTimes(1);
    });

    it('calls initDataScaleRange once', () => {
      expect(component.initAttributeDataScaleRange).toHaveBeenCalledTimes(1);
    });

    it('calls initDataScale once', () => {
      expect(
        component.initAttributeDataScaleAndUpdateChart
      ).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('integration: setting attribute data scale domain', () => {
    beforeEach(() => {
      component.config = new GeographiesConfig();
      component.config.dataGeographyConfig = new DataGeographyConfig();
      component.values = new MapDataValues();
    });
    describe('categorical attribute data', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new CategoricalAttributeDataDimensionConfig();
        component.values.attributeDataValues = ['a', 'a', 'b', 'b', 'c', 'c'];
      });
      it('sets the domain to the correct value, user did not specify domain', () => {
        component.initAttributeDataScaleDomain();
        const values = [];
        for (const item of component.config.dataGeographyConfig.attributeDataConfig.domain.values()) {
          values.push(item);
        }
        expect(values).toEqual(['a', 'b', 'c']);
      });
      it('sets the domain to the correct value, user specified domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.domain = [
          'c',
          'd',
          'b',
          'a',
        ];
        component.initAttributeDataScaleDomain();
        const values = [];
        for (const item of component.config.dataGeographyConfig.attributeDataConfig.domain.values()) {
          values.push(item);
        }
        expect(values).toEqual(['c', 'd', 'b', 'a']);
      });
    });
    describe('quantitative attribute data: no bins', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new NoBinsQuantitativeAttributeDataDimensionConfig();
        component.values.attributeDataValues = [1, 3, 5, 9, 10, 11];
      });
      it('sets the domain to the correct value, user did not specify domain', () => {
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([1, 11]);
      });
      it('sets the domain to the correct value, user specified domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.domain = [
          0, 15,
        ];
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 15]);
      });
    });
    describe('quantitative attribute data: equal num observations', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new EqualNumbersQuantitativeAttributeDataDimensionConfig();
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 3;
        component.values.attributeDataValues = [1, 3, 5, 9, 10, 11];
      });
      it('sets the domain to the correct value', () => {
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([1, 3, 5, 9, 10, 11]);
      });
    });
    describe('quantitative attribute data: equal values', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new EqualValuesQuantitativeAttributeDataDimensionConfig();
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 3;
        component.values.attributeDataValues = [1, 3, 5, 9, 10, 12];
      });
      it('sets the domain to the correct value, user did not specify domain', () => {
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([1, 12]);
      });
      it('sets the domain to the correct value, user specified domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.domain = [
          0, 15,
        ];
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 15]);
      });
      it('sets the number of bins to the correct number if value formatter indicates integer values and user numBins is greater than number of values in domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0f';
        component.values.attributeDataValues = [0, 0, 1.2, 3.2];
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.numBins
        ).toEqual(4);
      });
      it('sets the domains to the correct values if value formatter indicates integer values and user numBins is greater than number of values in domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0f';
        component.values.attributeDataValues = [0, 0, 1.2, 3.2];
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 4]);
      });
      it('does not change user numBins if value format is not integer type', () => {
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0%';
        component.values.attributeDataValues = [0, 1, 2, 3, 4];
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.numBins
        ).toEqual(10);
      });
    });
    describe('quantitative attribute data: custom breaks', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new CustomBreaksQuantitativeAttributeDataDimensionConfig();
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 3;
        component.config.dataGeographyConfig.attributeDataConfig.breakValues = [
          0, 2, 4, 6, 8,
        ];
        component.values.attributeDataValues = [1, 3, 5, 9, 10, 12];
      });
      it('sets the domain to the correct value', () => {
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 2, 4, 6, 8]);
      });
      it('sets the numBins to the correct value', () => {
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.numBins
        ).toEqual(4);
      });
    });
  });

  describe('initAttributeDataScaleAndUpdateChart', () => {
    beforeEach(() => {
      component.chart = {
        updateAttributeDataConfig: jasmine.createSpy(
          'updateAttributeDataConfig'
        ),
        updateAttributeDataScale: jasmine.createSpy('updateAttributeDataScale'),
      } as any;
      component.config = {
        dataGeographyConfig: {
          attributeDataConfig: {
            valueType: 'quantitative',
            binType: 'none',
          },
        },
      } as any;
      spyOn(component, 'setColorScaleWithColorInterpolator').and.returnValue(
        'interpolated scale' as any
      );
      spyOn(component, 'setColorScaleWithoutColorInterpolator').and.returnValue(
        'non-interpolated scale' as any
      );
    });

    describe('if valueType is quantitative and binType is none', () => {
      it('calls setColorScaleWithColorInterpolator once', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.setColorScaleWithColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if scale has color interpolation', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.chart.updateAttributeDataScale
        ).toHaveBeenCalledOnceWith('interpolated scale' as any);
      });
    });

    describe('if valueType is not quantitative', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig.valueType =
          'categorical';
      });
      it('calls setColorScaleWithoutColorInterpolator once', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.setColorScaleWithoutColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if valueType is not quantitative', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.chart.updateAttributeDataScale
        ).toHaveBeenCalledOnceWith('non-interpolated scale' as any);
      });
    });

    describe('if binType is not none', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig.binType =
          'auto' as any;
      });
      it('calls setColorScaleWithoutColorInterpolator once', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.setColorScaleWithoutColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if binType is not none', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.chart.updateAttributeDataScale
        ).toHaveBeenCalledOnceWith('non-interpolated scale' as any);
      });
    });

    it('calls updateAttributeDataConfig on chart once with the correct value', () => {
      component.initAttributeDataScaleAndUpdateChart();
      expect(
        component.chart.updateAttributeDataConfig
      ).toHaveBeenCalledOnceWith({
        valueType: 'quantitative',
        binType: 'none',
      } as any);
    });
  });

  describe('drawMarks', () => {
    beforeEach(() => {
      spyOn(component, 'drawMap');
    });
    it('calls drawMap with the correct value', () => {
      component.drawMarks(200);
      expect(component.drawMap).toHaveBeenCalledWith(200);
    });
  });
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternMap } from 'd3';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { GeographiesComponent, MapDataValues } from './geographies.component';
import {
  VicCategoricalAttributeDataDimensionConfig,
  VicCustomBreaksQuantitativeAttributeDataDimensionConfig,
  VicDataGeographyConfig,
  VicEqualNumbersQuantitativeAttributeDataDimensionConfig,
  VicEqualValuesQuantitativeAttributeDataDimensionConfig,
  VicGeographiesConfig,
  VicNoBinsQuantitativeAttributeDataDimensionConfig,
  VicValuesBin,
} from './geographies.config';

describe('GeographiesComponent', () => {
  let component: GeographiesComponent<any, any, any>;
  let fixture: ComponentFixture<GeographiesComponent<any, any, any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [GeographiesComponent],
      providers: [MapChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographiesComponent);
    component = fixture.componentInstance;
    component.config = new VicGeographiesConfig();
  });

  describe('initFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setConfig');
      spyOn(component, 'setPropertiesFromRanges');
      spyOn(component, 'setPropertiesFromConfig');
    });
    it('calls setConfig once', () => {
      component.initFromConfig();
      expect(component.setConfig).toHaveBeenCalledTimes(1);
    });
    it('calls setPropertiesFromConfig once', () => {
      component.initFromConfig();
      expect(component.setPropertiesFromConfig).toHaveBeenCalledTimes(1);
    });
    it('calls setPropertiesFromRanges once', () => {
      component.initFromConfig();
      expect(component.setPropertiesFromRanges).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPropertiesFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initAttributeDataScaleDomain');
      spyOn(component, 'initAttributeDataScaleRange');
      spyOn(component, 'updateChartAttributeProperties');
      component.setPropertiesFromConfig();
    });
    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initAttributeDataScaleDomain once', () => {
      expect(component.initAttributeDataScaleDomain).toHaveBeenCalledTimes(1);
    });

    it('calls initAttributeDataScaleRange once', () => {
      expect(component.initAttributeDataScaleRange).toHaveBeenCalledTimes(1);
    });

    it('calls setChartAttributeScaleAndConfig once', () => {
      expect(component.updateChartAttributeProperties).toHaveBeenCalledTimes(1);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setPropertiesFromRanges');
      spyOn(component, 'drawMarks');
      component.resizeMarks();
    });
    it('calls setPropertiesFromRanges once', () => {
      expect(component.setPropertiesFromRanges).toHaveBeenCalledTimes(1);
    });
    it('calls drawMarks once', () => {
      expect(component.drawMarks).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setting attribute data scale domain', () => {
    beforeEach(() => {
      component.config = new VicGeographiesConfig();
      component.config.dataGeographyConfig = new VicDataGeographyConfig();
      component.values = new MapDataValues();
    });
    describe('categorical attribute data', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new VicCategoricalAttributeDataDimensionConfig();
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 'a'],
          ['Alaska', 'b'],
          ['Arizona', 'c'],
        ]);
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
          new VicNoBinsQuantitativeAttributeDataDimensionConfig();
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 1],
          ['Alaska', 3],
          ['Arizona', 5],
          ['Arkansas', 9],
          ['California', 10],
          ['Colorado', 11],
        ]);
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
          new VicEqualNumbersQuantitativeAttributeDataDimensionConfig();
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 3;
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 1],
          ['Alaska', 3],
          ['Arizona', 5],
          ['Arkansas', 9],
          ['California', 10],
          ['Colorado', 11],
        ]);
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
          new VicEqualValuesQuantitativeAttributeDataDimensionConfig();
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 3;
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 1],
          ['Alaska', 3],
          ['Arizona', 5],
          ['Arkansas', 9],
          ['California', 10],
          ['Colorado', 12],
        ]);
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
        (
          component.config.dataGeographyConfig
            .attributeDataConfig as VicEqualValuesQuantitativeAttributeDataDimensionConfig<any>
        ).numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0f';
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 0],
          ['Alaska', 0],
          ['Arizona', 1.2],
          ['Arkansas', 3.2],
        ]);
        component.initAttributeDataScaleDomain();
        expect(
          (
            component.config.dataGeographyConfig
              .attributeDataConfig as VicEqualValuesQuantitativeAttributeDataDimensionConfig<any>
          ).numBins
        ).toEqual(4);
      });
      it('sets the domains to the correct values if value formatter indicates integer values and user numBins is greater than number of values in domain', () => {
        (
          component.config.dataGeographyConfig
            .attributeDataConfig as VicEqualValuesQuantitativeAttributeDataDimensionConfig<any>
        ).numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0f';
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 0],
          ['Alaska', 0],
          ['Arizona', 1.2],
          ['Arkansas', 3.2],
        ]);
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 4]);
      });
      it('does not change user numBins if value format is not integer type', () => {
        (
          component.config.dataGeographyConfig
            .attributeDataConfig as VicEqualValuesQuantitativeAttributeDataDimensionConfig<any>
        ).numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0%';
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 0],
          ['Alaska', 1],
          ['Arizona', 2],
          ['Arkansas', 3],
          ['California', 4],
        ]);
        component.initAttributeDataScaleDomain();
        expect(
          (
            component.config.dataGeographyConfig
              .attributeDataConfig as VicEqualValuesQuantitativeAttributeDataDimensionConfig<any>
          ).numBins
        ).toEqual(10);
      });
    });
    describe('quantitative attribute data: custom breaks', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new VicCustomBreaksQuantitativeAttributeDataDimensionConfig();
        component.config.dataGeographyConfig.attributeDataConfig.numBins = 3;
        component.config.dataGeographyConfig.attributeDataConfig.breakValues = [
          0, 2, 4, 6, 8,
        ];
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 1],
          ['Alaska', 3],
          ['Arizona', 5],
          ['Arkansas', 9],
          ['California', 10],
          ['Colorado', 12],
        ]);
      });
      it('sets the domain to the correct value', () => {
        component.initAttributeDataScaleDomain();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([2, 4, 6, 8]);
      });
      it('sets the numBins to the correct value', () => {
        component.initAttributeDataScaleDomain();
        expect(
          (
            component.config.dataGeographyConfig
              .attributeDataConfig as VicCustomBreaksQuantitativeAttributeDataDimensionConfig<any>
          ).numBins
        ).toEqual(4);
      });
    });
  });

  describe('setChartAttributeProperties', () => {
    beforeEach(() => {
      spyOn(component, 'getAttributeDataScale').and.returnValue(
        'attribute data scale' as any
      );
      component.chart = {
        updateAttributeProperties: jasmine.createSpy(
          'updateAttributeProperties'
        ),
      } as any;
      component.config = {
        dataGeographyConfig: {
          attributeDataConfig: {
            valueType: 'quantitative',
            binType: 'none',
          },
        },
      } as any;
    });
    it('calls getAttributeDataScale once', () => {
      component.updateChartAttributeProperties();
      expect(component.getAttributeDataScale).toHaveBeenCalledTimes(1);
    });
    it('calls updateAttributeProperties once with the correct value', () => {
      component.updateChartAttributeProperties();
      expect(
        component.chart.updateAttributeProperties
      ).toHaveBeenCalledOnceWith({
        scale: 'attribute data scale' as any,
        config: component.config.dataGeographyConfig.attributeDataConfig,
      });
    });
  });

  describe('getAttributeDataScale', () => {
    beforeEach(() => {
      component.config = {
        dataGeographyConfig: {
          attributeDataConfig: {
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

    describe('if binType is none', () => {
      it('calls setColorScaleWithColorInterpolator once', () => {
        component.getAttributeDataScale();
        expect(
          component.setColorScaleWithColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('returns the correct value if scale has color interpolation', () => {
        const scale = component.getAttributeDataScale();
        expect(scale).toEqual('interpolated scale' as any);
      });
    });

    describe('if binType is not none', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig.binType =
          VicValuesBin.categorical;
      });
      it('calls setColorScaleWithoutColorInterpolator once', () => {
        component.getAttributeDataScale();
        expect(
          component.setColorScaleWithoutColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if valueType is not quantitative', () => {
        const scale = component.getAttributeDataScale();
        expect(scale).toEqual('non-interpolated scale' as any);
      });
    });

    describe('if binType is not none', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig.binType =
          'auto' as any;
      });
      it('calls setColorScaleWithoutColorInterpolator once', () => {
        component.getAttributeDataScale();
        expect(
          component.setColorScaleWithoutColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if binType is not none', () => {
        const scale = component.getAttributeDataScale();
        expect(scale).toEqual('non-interpolated scale' as any);
      });
    });
  });

  describe('drawMarks', () => {
    beforeEach(() => {
      spyOn(component, 'drawMap');
      spyOn(component, 'updateGeographyElements');
      component.chart = {
        transitionDuration: 200,
      } as any;
    });
    it('calls drawMap with the correct value', () => {
      component.drawMarks();
      expect(component.drawMap).toHaveBeenCalledWith(200);
    });
    it('calls updateGeographyElements with the correct value', () => {
      component.drawMarks();
      expect(component.updateGeographyElements).toHaveBeenCalledTimes(1);
    });
  });
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternMap } from 'd3';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { VicCategoricalAttributeDataDimensionConfig } from './dimensions/categorical-bins';
import { VicCustomBreaksAttributeDataDimensionConfig } from './dimensions/custom-breaks-bins';
import { VicDataGeographyConfig } from './dimensions/data-geographies';
import { VicEqualNumObservationsAttributeDataDimensionConfig } from './dimensions/equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimensionConfig } from './dimensions/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimensionConfig } from './dimensions/no-bins';
import { GeographiesComponent, MapDataValues } from './geographies.component';
import { VicGeographiesConfig } from './geographies.config';

describe('GeographiesComponent', () => {
  let component: GeographiesComponent<any, any, any>;
  let fixture: ComponentFixture<GeographiesComponent<any, any, any>>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
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
      spyOn(component, 'setPropertiesFromRanges');
      spyOn(component, 'setPropertiesFromConfig');
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
      spyOn(component, 'setDimensionPropertiesFromData');
      spyOn(component, 'initAttributeDataProperties');
      spyOn(component, 'updateChartAttributeProperties');
      component.setPropertiesFromConfig();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(component.setDimensionPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls initAttributeDataScaleDomain once', () => {
      expect(component.initAttributeDataProperties).toHaveBeenCalledTimes(1);
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
        component.initAttributeDataProperties();
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
        component.initAttributeDataProperties();
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
          new VicNoBinsAttributeDataDimensionConfig();
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
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([1, 11]);
      });
      it('sets the domain to the correct value, user specified domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.domain = [
          0, 15,
        ];
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 15]);
      });
    });
    describe('quantitative attribute data: equal num observations', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new VicEqualNumObservationsAttributeDataDimensionConfig();
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
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([1, 3, 5, 9, 10, 11]);
      });
    });
    describe('quantitative attribute data: equal values', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new VicEqualValuesAttributeDataDimensionConfig();
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
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([1, 12]);
      });
      it('sets the domain to the correct value, user specified domain', () => {
        component.config.dataGeographyConfig.attributeDataConfig.domain = [
          0, 15,
        ];
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 15]);
      });
      it('sets the number of bins to the correct number if value formatter indicates integer values and user numBins is greater than number of values in domain', () => {
        (
          component.config.dataGeographyConfig
            .attributeDataConfig as VicEqualValuesAttributeDataDimensionConfig<any>
        ).numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0f';
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 0],
          ['Alaska', 0],
          ['Arizona', 1.2],
          ['Arkansas', 3.2],
        ]);
        component.initAttributeDataProperties();
        expect(
          (
            component.config.dataGeographyConfig
              .attributeDataConfig as VicEqualValuesAttributeDataDimensionConfig<any>
          ).numBins
        ).toEqual(4);
      });
      it('sets the domains to the correct values if value formatter indicates integer values and user numBins is greater than number of values in domain', () => {
        (
          component.config.dataGeographyConfig
            .attributeDataConfig as VicEqualValuesAttributeDataDimensionConfig<any>
        ).numBins = 10;
        component.config.dataGeographyConfig.attributeDataConfig.valueFormat =
          '.0f';
        component.values.attributeValuesByGeographyIndex = new InternMap([
          ['Alabama', 0],
          ['Alaska', 0],
          ['Arizona', 1.2],
          ['Arkansas', 3.2],
        ]);
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([0, 4]);
      });
      it('does not change user numBins if value format is not integer type', () => {
        (
          component.config.dataGeographyConfig
            .attributeDataConfig as VicEqualValuesAttributeDataDimensionConfig<any>
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
        component.initAttributeDataProperties();
        expect(
          (
            component.config.dataGeographyConfig
              .attributeDataConfig as VicEqualValuesAttributeDataDimensionConfig<any>
          ).numBins
        ).toEqual(10);
      });
    });
    describe('quantitative attribute data: custom breaks', () => {
      beforeEach(() => {
        component.config.dataGeographyConfig.attributeDataConfig =
          new VicCustomBreaksAttributeDataDimensionConfig();
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
        component.initAttributeDataProperties();
        expect(
          component.config.dataGeographyConfig.attributeDataConfig.domain
        ).toEqual([2, 4, 6, 8]);
      });
      it('sets the numBins to the correct value', () => {
        component.initAttributeDataProperties();
        expect(
          (
            component.config.dataGeographyConfig
              .attributeDataConfig as VicCustomBreaksAttributeDataDimensionConfig<any>
          ).numBins
        ).toEqual(4);
      });
    });
  });

  describe('updateChartAttributeProperties', () => {
    beforeEach(() => {
      component.config.dataGeographyConfig.attributeDataConfig =
        new VicEqualValuesAttributeDataDimensionConfig();
      spyOn(
        component.config.dataGeographyConfig.attributeDataConfig,
        'getScale'
      ).and.returnValue('attribute data scale' as any);
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
    it('calls getScale once', () => {
      component.updateChartAttributeProperties();
      expect(
        component.config.dataGeographyConfig.attributeDataConfig.getScale
      ).toHaveBeenCalledTimes(1);
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

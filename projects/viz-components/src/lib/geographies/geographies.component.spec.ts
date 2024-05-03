/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { VicEqualValuesAttributeDataDimension } from './dimensions/equal-value-ranges-bins';
import { GeographiesComponent } from './geographies.component';
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
      spyOn(component, 'setPropertiesFromData');
    });
    it('calls setPropertiesFromConfig once', () => {
      component.initFromConfig();
      expect(component.setPropertiesFromData).toHaveBeenCalledTimes(1);
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
      component.setPropertiesFromData();
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

  describe('updateChartAttributeProperties', () => {
    let scaleSpy: jasmine.Spy;
    beforeEach(() => {
      component.config.dataGeographyConfig.attributeDataConfig =
        new VicEqualValuesAttributeDataDimension();
      scaleSpy = jasmine
        .createSpy('getScale')
        .and.returnValue('attribute data scale');
      component.chart = {
        updateAttributeProperties: jasmine.createSpy(
          'updateAttributeProperties'
        ),
      } as any;
      component.config = {
        dataGeographyConfig: {
          nullColor: 'red',
          attributeDataConfig: {
            valueType: 'quantitative',
            binType: 'none',
            getScale: scaleSpy,
          },
        },
      } as any;
    });
    it('calls getScale once', () => {
      component.updateChartAttributeProperties();
      expect(
        component.config.dataGeographyConfig.attributeDataConfig.getScale
      ).toHaveBeenCalledOnceWith('red');
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

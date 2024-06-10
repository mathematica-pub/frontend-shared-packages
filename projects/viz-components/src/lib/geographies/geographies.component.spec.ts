/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { vicDataGeographies } from './config/dimensions/data-geographies';
import { vicEqualValuesAttributeDataDimension } from './config/dimensions/equal-value-ranges-bins';
import { vicGeographies } from './config/geographies.config';
import { GeographiesComponent } from './geographies.component';

type Datum = { value: number; state: string };

describe('GeographiesComponent', () => {
  let component: GeographiesComponent<any, any, any>;
  let fixture: ComponentFixture<GeographiesComponent<any, any, any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [GeographiesComponent],
      providers: [MapChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeographiesComponent);
    component = fixture.componentInstance;
  });

  describe('initFromConfig()', () => {
    beforeEach(() => {
      console.log('trying');
      spyOn(component, 'setPropertiesFromRanges');
      spyOn(component, 'updateChartAttributeProperties');
      component.config = vicGeographies({
        data: [
          { value: 1, state: 'AL' },
          { value: 2, state: 'AK' },
          { value: 3, state: 'AZ' },
          { value: 4, state: 'CA' },
          { value: 5, state: 'CO' },
          { value: 6, state: 'CO' },
        ],
        dataGeographies: vicDataGeographies<Datum, { name: string }, any>({
          attributeData: vicEqualValuesAttributeDataDimension<Datum>({
            valueAccessor: (d) => d.value,
            geoAccessor: (d) => d.state,
            numBins: 5,
          }),
        }),
      });
      console.log('bye');
    });
    it('calls setPropertiesFromRanges once', () => {
      component.initFromConfig();
      expect(component.setPropertiesFromRanges).toHaveBeenCalledTimes(1);
    });
    it('calls updateChartAttributeProperties once', () => {
      component.initFromConfig();
      expect(component.updateChartAttributeProperties).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPropertiesFromRanges()', () => {
    beforeEach(() => {
      spyOn(component, 'setProjection');
      spyOn(component, 'setPath');
    });
    it('calls setProjection once', () => {
      component.setPropertiesFromRanges();
      expect(component.setProjection).toHaveBeenCalledTimes(1);
    });
    it('calls setPath once', () => {
      component.setPropertiesFromRanges();
      expect(component.setPath).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateChartAttributeProperties', () => {
    beforeEach(() => {
      component.chart = {
        updateAttributeProperties: jasmine.createSpy(
          'updateAttributeProperties'
        ),
      } as any;
      component.config = vicGeographies({
        data: [
          { value: 1, state: 'AL' },
          { value: 2, state: 'AK' },
          { value: 3, state: 'AZ' },
          { value: 4, state: 'CA' },
          { value: 5, state: 'CO' },
          { value: 6, state: 'CO' },
        ],
        dataGeographies: vicDataGeographies<Datum, { name: string }, any>({
          nullColor: 'red',
          attributeData: vicEqualValuesAttributeDataDimension<Datum>({
            valueAccessor: (d) => d.value,
            geoAccessor: (d) => d.state,
            numBins: 5,
          }),
        }),
      });
      console.log('hi', component.config);
      spyOn(
        component.config.dataGeographies.attributeData,
        'getScale'
      ).and.returnValue('attribute data scale');
    });
    it('calls getScale once', () => {
      component.updateChartAttributeProperties();
      expect(
        component.config.dataGeographies.attributeData.getScale
      ).toHaveBeenCalledOnceWith('red');
    });
    it('calls updateAttributeProperties once with the correct value', () => {
      component.updateChartAttributeProperties();
      expect(
        component.chart.updateAttributeProperties
      ).toHaveBeenCalledOnceWith({
        scale: 'attribute data scale' as any,
        config: component.config.dataGeographies.attributeData,
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

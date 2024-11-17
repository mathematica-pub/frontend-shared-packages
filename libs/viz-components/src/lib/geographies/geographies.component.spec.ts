/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapChartComponent } from '../charts/map-chart/map-chart.component';
import { VicGeographiesConfigBuilder } from './config/geographies-builder';
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
      spyOn(component, 'setChartScalesFromRanges');
      spyOn(component, 'updateChartAttributeProperties');
      component.config = new VicGeographiesConfigBuilder<
        Datum,
        { name: string }
      >()
        .boundary('boundary' as any)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((layer) =>
          layer
            .equalValueRangesBins((dimension) =>
              dimension.valueAccessor((d) => d.value).numBins(5)
            )
            .geographyIndexAccessor((d) => d.state)
            .data([
              { value: 1, state: 'AL' },
              { value: 2, state: 'AK' },
              { value: 3, state: 'AZ' },
              { value: 4, state: 'CA' },
              { value: 5, state: 'CO' },
              { value: 6, state: 'CO' },
            ])
        )
        .getConfig();
    });
    it('calls setPropertiesFromRanges once', () => {
      component.initFromConfig();
      expect(component.setChartScalesFromRanges).toHaveBeenCalledTimes(1);
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
      component.setChartScalesFromRanges();
      expect(component.setProjection).toHaveBeenCalledTimes(1);
    });
    it('calls setPath once', () => {
      component.setChartScalesFromRanges();
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
      component.config = new VicGeographiesConfigBuilder<
        Datum,
        { name: string }
      >()
        .boundary('boundary' as any)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((layer) =>
          layer
            .equalValueRangesBins((dimension) =>
              dimension
                .valueAccessor((d) => d.value)
                .numBins(5)
                .nullColor('red')
            )
            .geographyIndexAccessor((d) => d.state)
            .data([
              { value: 1, state: 'AL' },
              { value: 2, state: 'AK' },
              { value: 3, state: 'AZ' },
              { value: 4, state: 'CA' },
              { value: 5, state: 'CO' },
              { value: 6, state: 'CO' },
            ])
        )
        .getConfig();
      spyOn(
        component.config.attributeDataLayer.attributeDimension,
        'getScale'
      ).and.returnValue('attribute data scale');
    });
    it('calls getScale once', () => {
      component.updateChartAttributeProperties();
      expect(
        component.config.attributeDataLayer.attributeDimension.getScale
      ).toHaveBeenCalledOnceWith();
    });
    it('calls updateAttributeProperties once with the correct value', () => {
      component.updateChartAttributeProperties();
      expect(
        component.chart.updateAttributeProperties
      ).toHaveBeenCalledOnceWith({
        scale: 'attribute data scale' as any,
        config: component.config.attributeDataLayer.attributeDimension,
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

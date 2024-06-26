/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { scaleQuantize } from 'd3';
import { Vic } from '../../config/vic';
import { VicValuesBin } from '../../geographies/config/dimensions/attribute-data-bin-types';
import { DiscontinuousLegendComponent } from './discontinuous-legend.component';

describe('DiscontinuousLegendComponent', () => {
  let component: DiscontinuousLegendComponent<any>;
  let fixture: ComponentFixture<DiscontinuousLegendComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscontinuousLegendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscontinuousLegendComponent);
    component = fixture.componentInstance;
  });

  describe('getValuesFromScale', () => {
    beforeEach(() => {
      component.config = Vic.geographiesDataDimensionCategorical({
        domain: ['one', 'two', 'three'],
      });
      spyOn(component.config, 'getDomain').and.returnValue('domain' as any);
    });
    it('integration: should return this.config.domain if binType == categorical', () => {
      expect(component.getValuesFromScale()).toEqual('domain' as any);
    });
    it('integration: should return breakValues if binType == customBreaks', () => {
      component.config = {
        binType: VicValuesBin.customBreaks,
        breakValues: [1, 2, 3],
      } as any;
      expect(component.getValuesFromScale()).toEqual([1, 2, 3] as any);
    });
    it('integration: should return custom values based on scale if binType not specified', () => {
      component.config = {} as any;
      component.config.range = ['white', 'gray', 'black'];
      component.scale = scaleQuantize([0, 99], ['white', 'gray', 'black']);
      expect(component.getValuesFromScale()).toEqual([0, 33, 66, 99]);
    });
  });

  describe('getLeftOffset', () => {
    beforeEach(() => {
      component.width = 200;
      component.largerValueSpace = 40;
      component.startValueSpace = 20;
      component.orientation = 'horizontal';
    });

    describe('if orientation is horizontal', () => {
      it('integration: returns the correct value if colorHalfWidth is larger than largerValueSpace', () => {
        const result = component.getLeftOffset([1, 2]);
        expect(result).toEqual(-30);
      });

      it('integration: returns the correct value if colorHalfWidth is smaller than largerValueSpace', () => {
        const result = component.getLeftOffset([1, 2, 3, 4]);
        expect(result).toEqual(-20);
      });
    });

    it('returns 0 if orientation is vertical', () => {
      component.orientation = 'vertical';
      const result = component.getLeftOffset([1, 2]);
      expect(result).toEqual(0);
    });
  });
});

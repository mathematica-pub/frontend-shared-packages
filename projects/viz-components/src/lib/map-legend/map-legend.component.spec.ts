import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapChartComponent } from '../map-chart/map-chart.component';

import { BehaviorSubject } from 'rxjs';
import { MapLegendComponent } from './map-legend.component';

describe('MapLegendComponent', () => {
  let component: MapLegendComponent;
  let fixture: ComponentFixture<MapLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapLegendComponent],
      providers: [MapChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLegendComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'subscribeToAttributeScaleAndConfig');
      spyOn(component, 'setOrientation');
      spyOn(component, 'setValuesSide');
    });
    it('calls subscribeToAttributeScaleAndConfig once', () => {
      component.ngOnInit();
      expect(
        component.subscribeToAttributeScaleAndConfig
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setOrientation once', () => {
      component.ngOnInit();
      expect(component.setOrientation).toHaveBeenCalledTimes(1);
    });
    it('calls setValuesSide once', () => {
      component.ngOnInit();
      expect(component.setValuesSide).toHaveBeenCalledTimes(1);
    });
  });

  describe('setOrientation', () => {
    it('sets orientation to horizontal if width is greater than height', () => {
      component.width = 100;
      component.height = 50;
      component.setOrientation();
      expect(component.orientation).toEqual('horizontal');
    });

    it('sets orientation to vertical if width is not greater than height', () => {
      component.width = 100;
      component.height = 200;
      component.setOrientation();
      expect(component.orientation).toEqual('vertical');
    });
  });

  describe('setValuesSide', () => {
    beforeEach(() => {
      spyOn(console, 'warn');
    });

    describe('if orientation is horizontal', () => {
      beforeEach(() => {
        component.orientation = 'horizontal';
      });
      describe('valuesSide is left', () => {
        it('sets valuesSide to bottom', () => {
          component.valuesSide = 'left';
          component.setValuesSide();
          expect(component.valuesSide).toEqual('bottom');
        });

        it('calls console.warn', () => {
          component.valuesSide = 'left';
          component.setValuesSide();
          expect(console.warn).toHaveBeenCalledTimes(1);
        });
      });

      describe('valuesSide is right', () => {
        it('sets valuesSide to bottom', () => {
          component.valuesSide = 'left';
          component.setValuesSide();
          expect(component.valuesSide).toEqual('bottom');
        });

        it('calls console.warn', () => {
          component.valuesSide = 'left';
          component.setValuesSide();
          expect(console.warn).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('if orientation is vertical', () => {
      beforeEach(() => {
        component.orientation = 'vertical';
      });
      describe('valuesSide is top', () => {
        it('sets valuesSide to left', () => {
          component.valuesSide = 'top';
          component.setValuesSide();
          expect(component.valuesSide).toEqual('left');
        });

        it('calls console.warn', () => {
          component.valuesSide = 'top';
          component.setValuesSide();
          expect(console.warn).toHaveBeenCalledTimes(1);
        });
      });

      describe('valuesSide is bottom', () => {
        it('sets valuesSide to left', () => {
          component.valuesSide = 'bottom';
          component.setValuesSide();
          expect(component.valuesSide).toEqual('left');
        });

        it('calls console.warn', () => {
          component.valuesSide = 'bottom';
          component.setValuesSide();
          expect(console.warn).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('subscribeToAttributeScaleAndConfig', () => {
    let attributeDataConfig;
    let attributeDataScale;
    beforeEach(() => {
      spyOn(component, 'setLegendType');
      attributeDataConfig = new BehaviorSubject(null);
      attributeDataScale = new BehaviorSubject(null);
      (component as any).chart = {
        attributeDataScale$: attributeDataScale.asObservable(),
        attributeDataConfig$: attributeDataConfig.asObservable(),
      } as any;
    });

    it('calls setLegendType once if scale and config are truthy', () => {
      attributeDataConfig.next('hello' as any);
      attributeDataScale.next('it me' as any);
      component.subscribeToAttributeScaleAndConfig();
      expect(component.setLegendType).toHaveBeenCalledTimes(1);
    });

    it('does not call setLegendType if scale is not truthy', () => {
      attributeDataConfig.next('hello' as any);
      component.subscribeToAttributeScaleAndConfig();
      expect(component.setLegendType).not.toHaveBeenCalled();
    });

    it('does not call setLegendType if config is not truthy', () => {
      attributeDataScale.next('it me' as any);
      component.subscribeToAttributeScaleAndConfig();
      expect(component.setLegendType).not.toHaveBeenCalled();
    });
  });

  describe('setLegendType', () => {
    it('sets legendType to categorical if config.valueType is categorical', () => {
      component.attributeDataConfig = { valueType: 'categorical' } as any;
      component.setLegendType();
      expect(component.legendType).toEqual('categorical');
    });

    it('sets legendType to continuous if config.valueType is not categorical and binType is none', () => {
      component.attributeDataConfig = {
        valueType: 'quantitative',
        binType: 'none',
      } as any;
      component.setLegendType();
      expect(component.legendType).toEqual('continuous');
    });

    it('sets legendType to continuous if config.valueType is not categorical and binType is not none', () => {
      component.attributeDataConfig = {
        valueType: 'quantitative',
        binType: 'custom',
      } as any;
      component.setLegendType();
      expect(component.legendType).toEqual('ordinal');
    });
  });
});

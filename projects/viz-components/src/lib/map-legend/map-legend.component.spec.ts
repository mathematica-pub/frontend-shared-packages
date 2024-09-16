/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapChartComponent } from '../charts/map-chart/map-chart.component';

import { MapLegendComponent } from './map-legend.component';

describe('MapLegendComponent', () => {
  let component: MapLegendComponent<any>;
  let fixture: ComponentFixture<MapLegendComponent<any>>;

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
      spyOn(component, 'setOrientation');
      spyOn(component, 'setValuesSide');
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
});

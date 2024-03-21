import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChartComponent } from './map-chart.component';

describe('MapChartComponent', () => {
  let component: MapChartComponent<any>;
  let fixture: ComponentFixture<MapChartComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChartComponent);
    component = fixture.componentInstance;
  });

  describe('updateAttributeDataScale', () => {
    it('calls next on updateAttributeDataScale', () => {
      spyOn((component as any).attributeDataScale, 'next');
      component.updateAttributeDataScale({} as any);
      expect(
        (component as any).attributeDataScale.next
      ).toHaveBeenCalledOnceWith({});
    });
  });

  describe('updateAttributeDataConfig', () => {
    it('calls next on updateAttributeDataConfig', () => {
      spyOn((component as any).attributeDataConfig, 'next');
      component.updateAttributeDataConfig({} as any);
      expect(
        (component as any).attributeDataConfig.next
      ).toHaveBeenCalledOnceWith({});
    });
  });
});

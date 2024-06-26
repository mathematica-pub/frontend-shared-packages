/* eslint-disable @typescript-eslint/no-explicit-any */
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

  describe('updateAttributeProperties', () => {
    it('calls next on updateAttributeProperties', () => {
      spyOn((component as any).attributeProperties, 'next');
      component.updateAttributeProperties({
        scale: 'test scale',
        config: 'test config',
      } as any);
      expect(
        (component as any).attributeProperties.next
      ).toHaveBeenCalledOnceWith({
        scale: 'test scale',
        config: 'test config',
      });
    });
  });
});

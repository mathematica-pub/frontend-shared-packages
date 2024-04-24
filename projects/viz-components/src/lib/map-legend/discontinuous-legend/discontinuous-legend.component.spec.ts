/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContinuousLegendComponent } from './continuous-legend.component';

describe('ContinuousLegendComponent', () => {
  let component: ContinuousLegendComponent<any>;
  let fixture: ComponentFixture<ContinuousLegendComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinuousLegendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinuousLegendComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(component, 'setValues');
      spyOn(component, 'setColors');
      spyOn(component, 'drawLinearGradient');
    });

    it('calls setValues once', () => {
      component.ngOnChanges();
      expect(component.setValues).toHaveBeenCalledTimes(1);
    });

    it('calls setColors once', () => {
      component.ngOnChanges();
      expect(component.setColors).toHaveBeenCalledTimes(1);
    });

    it('calls drawLinearGradient once', () => {
      component.ngOnChanges();
      expect(component.drawLinearGradient).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLeftOffset', () => {
    beforeEach(() => {
      component.orientation = 'horizontal';
      component.largerValueSpace = 100;
      component.startValueSpace = 50;
    });

    it('returns the correct value if orientation is horizontal', () => {
      const result = component.getLeftOffset();
      expect(result).toEqual(-50);
    });

    it('returns 0 if orientation is vertical', () => {
      component.orientation = 'vertical';
      const result = component.getLeftOffset();
      expect(result).toEqual(0);
    });
  });
});

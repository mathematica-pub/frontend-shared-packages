import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuousLegendComponent } from './continuous-legend.component';

describe('ContinuousLegendComponent', () => {
  let component: ContinuousLegendComponent;
  let fixture: ComponentFixture<ContinuousLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContinuousLegendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinuousLegendComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setValues');
      spyOn(component, 'setColors');
      spyOn(component, 'drawLinearGradient');
    });

    it('calls setValues once', () => {
      component.ngOnInit();
      expect(component.setValues).toHaveBeenCalledTimes(1);
    });

    it('calls setColors once', () => {
      component.ngOnInit();
      expect(component.setColors).toHaveBeenCalledTimes(1);
    });

    it('calls drawLinearGradient once', () => {
      component.ngOnInit();
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

  describe('setColors', () => {
    beforeEach(() => {
      component.scale = {
        domain: jasmine.createSpy('range').and.returnValue(['red', 'orange']),
      };
    });

    it('should set colors to scale.domain if orientation is not vertical', () => {
      component.orientation = 'horizontal';
      component.setColors();
      expect(component.colors).toEqual(['red', 'orange']);
    });

    it('should reverse colors if orientation is vertical', () => {
      component.orientation = 'vertical';
      component.setColors();
      expect(component.colors).toEqual(['orange', 'red']);
    });
  });
});

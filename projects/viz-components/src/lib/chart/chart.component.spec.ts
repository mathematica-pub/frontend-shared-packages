import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges()', () => {
    beforeEach(() => {
      spyOn(component, 'setAspectRatio');
      spyOn(component._height, 'next');
      component.height = 80;
    });
    it('calls setAspectRatio if changes has width property', () => {
      component.ngOnChanges({ width: 100 } as any);
      expect(component.setAspectRatio).toHaveBeenCalledTimes(1);
    });

    it('calls setAspectRatio if changes has height property', () => {
      component.ngOnChanges({ height: 100 } as any);
      expect(component.setAspectRatio).toHaveBeenCalledTimes(1);
    });

    it('does not call setAspectRatio if changes has neither width nor height property', () => {
      component.ngOnChanges({} as any);
      expect(component.setAspectRatio).not.toHaveBeenCalled();
    });

    it('calls next on heightSubject if changes has height property', () => {
      component.ngOnChanges({ height: 100 } as any);
      expect(component._height.next).toHaveBeenCalledOnceWith(80);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component as any, 'setAspectRatio');
      spyOn(component as any, 'createDimensionObservables');
    });

    it('calls setAspectRatio', () => {
      component.ngOnInit();
      expect((component as any).setAspectRatio).toHaveBeenCalledTimes(1);
    });

    it('calls createDimensionObservables', () => {
      component.ngOnInit();
      expect(
        (component as any).createDimensionObservables
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAspectRatio()', () => {
    it('sets aspectRatio to the correct value', () => {
      component.width = 100;
      component.height = 50;
      component.setAspectRatio();
      expect(component.aspectRatio).toBe(2);
    });
  });
});

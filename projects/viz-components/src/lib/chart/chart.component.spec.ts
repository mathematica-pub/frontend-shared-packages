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

  describe('ngAfterContentInit()', () => {
    it('should throw an error if no dataMarks component exists', () => {
      component.dataMarksComponent = undefined;
      expect(() => {
        component.ngAfterContentInit();
      }).toThrowError('DataMarksComponent not found.');
    });

    describe('dataMarksComponent is defined', () => {
      it('should not throw an error', () => {
        component.dataMarksComponent = {} as any;
        expect(() => {
          component.ngAfterContentInit();
        }).not.toThrow();
      });
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

  describe('chartShouldScale()', () => {
    beforeEach(() => {
      component.width = 100;
      component.scaleChartWithContainer = true;
      component.divRef = { nativeElement: { offsetWidth: 50 } } as any;
    });
    describe('if scaleChartContainer is true', () => {
      it('returns true if divRef.nativeElement.offsetWidth is less than width', () => {
        expect(component.chartShouldScale()).toBe(true);
      });

      it('returns false if divRef.nativeElement.offsetWidth is greater than or equal to width', () => {
        component.divRef = { nativeElement: { offsetWidth: 200 } } as any;
        expect(component.chartShouldScale()).toBe(false);
      });
    });

    it('returns false if chartShouldScale is false', () => {
      component.scaleChartWithContainer = false;
      expect(component.chartShouldScale()).toBe(false);
    });
  });
});

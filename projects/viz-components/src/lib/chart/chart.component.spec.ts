import { Renderer2, Type } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ResizeChartHeightPipe } from '../shared/resize-chart-height.pipe';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let renderer: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent, ResizeChartHeightPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    renderer = fixture.componentRef.injector.get<Renderer2>(
      Renderer2 as Type<Renderer2>
    );
    component = fixture.componentInstance;
    component.unlistenMouseWheel = () => {};
    component.unlistenPointerEnter = () => {};
    component.unlistenPointerLeave = () => {};
    component.unlistenPointerMove = () => {};
    component.unlistenTouchStart = () => {};
    component.dataMarksComponent = {
      config: { showTooltip: false },
    } as any;
  });

  describe('onResize()', () => {
    let shouldScaleSpy: jasmine.Spy;
    beforeEach(() => {
      shouldScaleSpy = spyOn(component, 'chartShouldScale');
      spyOn(component.sizeChange, 'next');
    });

    it('calls next on sizeChange if chartShouldScale returns true', () => {
      shouldScaleSpy.and.returnValue(true);
      component.onResize();
      expect(component.sizeChange.next).toHaveBeenCalledTimes(1);
    });

    it('does not call next on sizeChange if chartShouldScale returns false', () => {
      shouldScaleSpy.and.returnValue(false);
      component.onResize();
      expect(component.sizeChange.next).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component as any, 'setAspectRatio');
      spyOn(component as any, 'subscribeToSizeChange');
    });

    it('calls setAspectRatio', () => {
      component.ngOnInit();
      expect((component as any).setAspectRatio).toHaveBeenCalledTimes(1);
    });

    it('calls subscribeToSizeChange', () => {
      component.ngOnInit();
      expect((component as any).subscribeToSizeChange).toHaveBeenCalledTimes(1);
    });
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

  describe('ngAfterContentInit()', () => {
    beforeEach(() => {
      spyOn(component as any, 'setPointerEventListeners');
    });
    it('should throw an error if no dataMarks component exists', () => {
      component.dataMarksComponent = undefined;
      expect(() => {
        component.ngAfterContentInit();
      }).toThrowError('DataMarksComponent not found.');
    });

    describe('dataMarksComponent is defined', () => {
      beforeEach(() => {
        component.dataMarksComponent = { config: {} } as any;
      });
      it('should not throw an error', () => {
        expect(() => {
          component.ngAfterContentInit();
        }).not.toThrow();
      });

      it('calls setPointerEventListeners if dataMarks.config.showTooltip is true', () => {
        component.dataMarksComponent.config = { showTooltip: true } as any;
        component.ngAfterContentInit();
        expect(
          (component as any).setPointerEventListeners
        ).toHaveBeenCalledTimes(1);
      });

      it('does not call setPointerEventListeners if dataMarks.config.showTooltip is false', () => {
        component.dataMarksComponent.config = { showTooltip: false } as any;
        component.ngAfterContentInit();
        expect(
          (component as any).setPointerEventListeners
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      spyOn(component, 'setTooltipPosition');
    });

    it('calls setTooltipPosition once if htmlTooltip exists', () => {
      component.htmlTooltip.exists = true;
      component.ngAfterViewInit();
      expect(component.setTooltipPosition).toHaveBeenCalledTimes(1);
    });

    it('calls setTooltipPosition once if htmlTooltip does not exist', () => {
      component.htmlTooltip.exists = false;
      component.ngAfterViewInit();
      expect(component.setTooltipPosition).toHaveBeenCalledTimes(0);
    });
  });

  describe('subscribeToSizeChange()', () => {
    beforeEach(() => {
      spyOn(component, 'resizeDataMarks');
    });
    it('calls resizeDataMarkers once if sizeChange emits', fakeAsync(() => {
      expect(component.resizeDataMarks).toHaveBeenCalledTimes(0);
      component.subscribeToSizeChange();
      component.sizeChange.next();
      tick(110);
      expect(component.resizeDataMarks).toHaveBeenCalledTimes(1);
    }));
  });

  describe('resizeDataMarks()', () => {
    let resizeSpy: jasmine.Spy;
    beforeEach(() => {
      resizeSpy = jasmine.createSpy('resizeMarks');
      component.dataMarksComponent.resizeMarks = resizeSpy;
    });

    it('calls resizeMarks on each dataMark component if dataMark components exits', () => {
      component.resizeDataMarks();
      expect(resizeSpy).toHaveBeenCalledTimes(1);
    });

    it('does not call resizeMarks on each dataMark component if dataMark components do not exist', () => {
      component.dataMarksComponent = undefined;
      component.resizeDataMarks();
      expect(resizeSpy).not.toHaveBeenCalled();
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

  describe('getSvgWidth()', () => {
    it('returns width if scaleChartContainer is false', () => {
      component.scaleChartWithContainer = false;
      component.width = 100;
      expect(component.getSvgWidth()).toBe(100);
    });

    it('returns divRef.nativeElement.offsetWidth if scaleChartContainer is true', () => {
      component.scaleChartWithContainer = true;
      component.divRef = { nativeElement: { offsetWidth: 200 } } as any;
      expect(component.getSvgWidth()).toBe(200);
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

  describe('getScaledWidth()', () => {
    let shouldScaleSpy: jasmine.Spy;
    beforeEach(() => {
      shouldScaleSpy = spyOn(component, 'chartShouldScale');
      component.divRef = { nativeElement: { offsetWidth: 100 } } as any;
      component.width = 500;
    });
    it('returns the correct value if chartShouldScale returns true', () => {
      shouldScaleSpy.and.returnValue(true);
      expect(component.getScaledWidth()).toBe(100);
    });

    it('returns the correct value if chartShouldScale returns false', () => {
      shouldScaleSpy.and.returnValue(false);
      expect(component.getScaledWidth()).toBe(500);
    });
  });

  describe('getScaledHeight()', () => {
    let shouldScaleSpy: jasmine.Spy;
    beforeEach(() => {
      shouldScaleSpy = spyOn(component, 'chartShouldScale');
      component.divRef = { nativeElement: { offsetWidth: 100 } } as any;
      component.aspectRatio = 2;
      component.height = 500;
    });
    it('returns the correct value if chartShouldScale returns true', () => {
      shouldScaleSpy.and.returnValue(true);
      expect(component.getScaledHeight()).toBe(50);
    });

    it('returns the correct value if chartShouldScale returns false', () => {
      shouldScaleSpy.and.returnValue(false);
      expect(component.getScaledHeight()).toBe(500);
    });
  });

  describe('getXRange()', () => {
    beforeEach(() => {
      component.margin = { left: 10, right: 10, top: 10, bottom: 10 };
      spyOn(component, 'getScaledWidth').and.returnValue(100);
    });
    it('should return the correct value', () => {
      expect(component.getXRange()).toEqual([10, 90]);
    });
  });

  describe('getYRange()', () => {
    beforeEach(() => {
      component.margin = { left: 10, right: 10, top: 10, bottom: 10 };
      spyOn(component, 'getScaledHeight').and.returnValue(100);
    });
    it('should return the correct value', () => {
      expect(component.getYRange()).toEqual([90, 10]);
    });
  });

  describe('setPointerEventListeners()', () => {
    let setTouchStartSpy: jasmine.Spy;
    let setPointerEnterSpy: jasmine.Spy;
    let setMouseWheelSpy: jasmine.Spy;
    beforeEach(() => {
      setTouchStartSpy = spyOn(component as any, 'setTouchStartListener');
      setPointerEnterSpy = spyOn(component as any, 'setPointerEnterListener');
      setMouseWheelSpy = spyOn(component as any, 'setMouseWheelListener');
      component.svgRef = {
        nativeElement: 'svg',
      } as any;
    });
    it('should call setTouchStartListener once with the correct value', () => {
      (component as any).setPointerEventListeners();
      expect(setTouchStartSpy).toHaveBeenCalledOnceWith('svg');
    });
    it('should call setPointerEnterListener once with the correct value', () => {
      (component as any).setPointerEventListeners();
      expect(setPointerEnterSpy).toHaveBeenCalledOnceWith('svg');
    });
    it('should call setMouseWheelListener once with the correct value', () => {
      (component as any).setPointerEventListeners();
      expect(setMouseWheelSpy).toHaveBeenCalledOnceWith('svg');
    });
  });

  describe('setTooltipPosition()', () => {
    beforeEach(() => {
      component.divRef = {
        nativeElement: {
          getBoundingClientRect: jasmine
            .createSpy('getBoundingClientRect')
            .and.returnValue({ x: 100, y: 200 }) as any,
        } as any,
      } as any;
      component.setTooltipPosition();
    });
    it('correctly sets position.top on htmlTooltip', () => {
      expect(component.htmlTooltip.position.top).toEqual(200);
    });

    it('correctly sets position.left on htmlTooltip', () => {
      expect(component.htmlTooltip.position.left).toEqual(100);
    });
  });

  describe('emitTooltipData()', () => {
    beforeEach(() => {
      spyOn(component.tooltipData, 'emit');
    });
    it('should call emit on tooltipData once with the correct value', () => {
      component.emitTooltipData('test' as any);
      expect(component.tooltipData.emit).toHaveBeenCalledOnceWith(
        'test' as any
      );
    });
  });
});

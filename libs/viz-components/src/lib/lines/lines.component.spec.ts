/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { VicLinesConfigBuilder } from './config/lines-builder';
import { LinesComponent } from './lines.component';

describe('LinesComponent', () => {
  let component: LinesComponent<any>;
  let fixture: ComponentFixture<LinesComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LinesComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesComponent);
    component = fixture.componentInstance;
  });

  describe('drawMarks()', () => {
    const duration = 50;
    beforeEach(() => {
      spyOn(component, 'setLine');
      spyOn(component, 'getTransitionDuration').and.returnValue(duration);
      spyOn(component, 'drawLines');
      spyOn(component, 'drawPointMarkers');
      spyOn(component, 'drawLineLabels');
      component.config = new VicLinesConfigBuilder()
        .data([])
        .xDate((dimension) => dimension.valueAccessor(() => null as any))
        .y((dimension) => dimension.valueAccessor(() => null as any))
        .stroke((stroke) =>
          stroke.color((dimension) =>
            dimension.valueAccessor(() => null as any)
          )
        )
        .getConfig();
    });
    it('calls setLine once', () => {
      component.drawMarks();
      expect(component.setLine).toHaveBeenCalledTimes(1);
    });
    it('calls getTransitionDuration once', () => {
      component.drawMarks();
      expect(component.getTransitionDuration).toHaveBeenCalledTimes(1);
    });
    it('calls drawLines once and with the correct argument', () => {
      component.drawMarks();
      expect(component.drawLines).toHaveBeenCalledOnceWith(duration);
    });
    it('calls drawPointMarkers once with the correct argument if config.pointMarkers is truthy', () => {
      component.config = new VicLinesConfigBuilder()
        .data([])
        .xDate((dimension) => dimension.valueAccessor(() => null as any))
        .y((dimension) => dimension.valueAccessor(() => null as any))
        .stroke((stroke) =>
          stroke.color((dimension) =>
            dimension.valueAccessor(() => null as any)
          )
        )
        .pointMarkers()
        .getConfig();
      component.drawMarks();
      expect(component.drawPointMarkers).toHaveBeenCalledOnceWith(duration);
    });
    it('does not call drawPointMarkers once if config.pointMarkers is undefined', () => {
      component.drawMarks();
      expect(component.drawPointMarkers).toHaveBeenCalledTimes(0);
    });
    it('calls drawLineLabels once if config.labelLines is true', () => {
      component.config = new VicLinesConfigBuilder()
        .data([])
        .xDate((dimension) => dimension.valueAccessor(() => null as any))
        .y((dimension) => dimension.valueAccessor(() => null as any))
        .stroke((stroke) =>
          stroke.color((dimension) =>
            dimension.valueAccessor(() => null as any)
          )
        )
        .labelLines(true)
        .getConfig();
      component.drawMarks();
      expect(component.drawLineLabels).toHaveBeenCalledTimes(1);
    });
    it('does not call drawLineLabels once if config.labelLines is false', () => {
      component.drawMarks();
      expect(component.drawLineLabels).toHaveBeenCalledTimes(0);
    });
  });
});

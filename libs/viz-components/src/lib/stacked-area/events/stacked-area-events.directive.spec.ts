/* eslint-disable @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { selectAll } from 'd3';
import { of } from 'rxjs';
import { EventType } from '../../events';
import { STACKED_AREA } from '../stacked-area.component';
import { StackedAreaEventsDirective } from './stacked-area-events.directive';

describe('StackedAreaEventsDirective', () => {
  let directive: StackedAreaEventsDirective<any, any, any>;
  let stackedAreaStub: any;

  beforeEach(() => {
    stackedAreaStub = {
      stackedAreas$: of(selectAll([document.createElement('path')])),
      config: {
        x: { values: [1, 2, 3] },
        valueIndices: [0, 1, 2],
        series: [
          [
            { i: 0, 0: 0, 1: 10 },
            { i: 1, 0: 10, 1: 20 },
            { i: 2, 0: 20, 1: 30 },
          ],
        ],
      },
      scales: {
        x: (v: any) => v,
        y: (v: any) => v,
      },
      ranges: { x: [0, 100], y: [100, 0] },
      getTooltipData: () => ({ foo: 'bar' }),
      chart: {
        svgRef: { nativeElement: { getBBox: () => ({ height: 100 }) } },
      },
    };
    TestBed.configureTestingModule({
      providers: [
        StackedAreaEventsDirective,
        Renderer2,
        { provide: STACKED_AREA, useValue: stackedAreaStub },
      ],
    });
    directive = TestBed.inject(StackedAreaEventsDirective);
    directive.stackedArea = stackedAreaStub;
  });

  it('should get elements from stackedAreas$', (done) => {
    directive.getElements().subscribe((els: any) => {
      expect(Array.isArray(els)).toBeTrue();
      expect(els[0] instanceof Element).toBeTrue();
      done();
    });
  });

  it('should call runActions with hoverMoveActions on onEnter', () => {
    const action = { initialize: jasmine.createSpy('initialize') } as any;
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = (type: any) =>
      type === EventType.HoverMove;
    directive.onEnter({} as PointerEvent, {} as Element);
    expect(action.initialize).toHaveBeenCalled();
  });

  it('should call setPositionsFromPointer, setClosestXIndicies, setClosestDatumPosition, and run onStart for each hoverMoveAction on onMove', () => {
    const action = { onStart: jasmine.createSpy('onStart') } as any;
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = (type: any) =>
      type === EventType.HoverMove;
    spyOn(directive, 'setPositionsFromPointer');
    spyOn(directive, 'pointerIsInChartArea').and.returnValue(true);
    spyOn(directive, 'setClosestXIndicies').and.callThrough();
    spyOn(directive, 'setClosestDatumPosition').and.callThrough();
    directive.closestXIndicies = [0];
    directive.positionX = 1;
    directive.positionY = 5;
    directive.onMove({} as PointerEvent, {} as Element);
    expect(directive.setPositionsFromPointer).toHaveBeenCalled();
    expect(directive.setClosestXIndicies).toHaveBeenCalled();
    expect(directive.setClosestDatumPosition).toHaveBeenCalled();
    expect(action.onStart).toHaveBeenCalled();
  });

  it('should call onEnd for each hoverMoveAction on onLeave', () => {
    const action = { onEnd: jasmine.createSpy('onEnd') } as any;
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = (type: any) =>
      type === EventType.HoverMove;
    spyOn(directive, 'resetDirective');
    directive.onLeave({} as PointerEvent, {} as Element);
    expect(action.onEnd).toHaveBeenCalled();
    expect(directive.resetDirective).toHaveBeenCalled();
  });

  it('should call setPositionsFromPointer and run clickActions on onClick', () => {
    const action = { onStart: jasmine.createSpy('onStart') } as any;
    directive.clickActions = [action];
    (directive as any).isEventAllowed = (type: any) => type === EventType.Click;
    spyOn(directive, 'setPositionsFromPointer');
    directive.onClick({} as PointerEvent, {} as Element);
    expect(directive.setPositionsFromPointer).toHaveBeenCalled();
    expect(action.onStart).toHaveBeenCalled();
  });

  it('should call onStart/onEnd for inputEventActions on onInputEvent', () => {
    const onStart = jasmine.createSpy('onStart');
    const onEnd = jasmine.createSpy('onEnd');
    directive.inputEventActions = [{ onStart, onEnd } as any];
    (directive as any).isEventAllowed = (type: any) => type === EventType.Input;
    directive.onInputEvent('foo');
    expect(onStart).toHaveBeenCalledWith(directive, 'foo');
    directive.onInputEvent(null);
    expect(onEnd).toHaveBeenCalledWith(directive, null);
  });

  it('should run onEnd for each clickAction and resetDirective on onClickRemove if not prevented', () => {
    const action = { onEnd: jasmine.createSpy('onEnd') } as any;
    directive.clickActions = [action];
    directive.preventAction = {
      click: false,
      hover: false,
      hoverMove: false,
      input: false,
    };
    spyOn(directive, 'resetDirective');
    directive.onClickRemove();
    expect(action.onEnd).toHaveBeenCalled();
    expect(directive.resetDirective).toHaveBeenCalled();
  });

  it('should return true if pointer is in chart area', () => {
    directive.positionX = 50;
    directive.positionY = 50;
    expect(directive.pointerIsInChartArea()).toBeTrue();
  });

  it('should return false if pointer is outside chart area', () => {
    directive.positionX = -10;
    directive.positionY = 50;
    expect(directive.pointerIsInChartArea()).toBeFalse();
  });

  it('should set closestXIndicies for number x values', () => {
    directive.stackedArea.config.x.values = [1, 2, 3];
    directive.stackedArea.config.valueIndices = [0, 1, 2];
    directive.stackedArea.scales.x = (v: any) => v;
    directive.positionX = 2;
    directive.setClosestXIndicies();
    expect(directive.closestXIndicies).toContain(1);
  });

  it('should emit interaction output', () => {
    spyOn(directive.interactionOutput, 'emit');
    const output = {
      data: [],
      positionX: 1,
      hoveredAreaTop: 10,
      hoveredAreaBottom: 0,
      hoveredDatum: {} as any,
      svgHeight: 100,
      type: EventType.HoverMove,
    };
    directive.emitInteractionOutput(output as any);
    expect(directive.interactionOutput.emit).toHaveBeenCalledWith(output);
  });
});

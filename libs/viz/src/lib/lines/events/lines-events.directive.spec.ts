/* eslint-disable @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventType } from '../../events';
import { LINES, LinesComponent } from '../lines.component';
import { LinesEventsDirective } from './lines-events.directive';

describe('LinesEventsDirective', () => {
  let directive: LinesEventsDirective<any, LinesComponent<any>>;
  let linesStub: any;

  const genericScale: any = (v: any) => v;
  genericScale.domain = () => [0, 1];
  genericScale.range = () => [0, 1];

  beforeEach(() => {
    linesStub = {
      config: {
        valueIndices: [0, 1],
        x: { values: [1, 2] },
        y: { values: [3, 4] },
        pointerDetectionRadius: 10,
      },
      scales: {
        x: genericScale,
        y: genericScale,
        color: genericScale,
        useTransition: false,
      },
      ranges: { x: [0, 100], y: [100, 0] },
      chart: { svgRef: { nativeElement: {} } },
      getTooltipData: () => ({
        positionX: 1,
        positionY: 2,
        datum: {},
        color: 'red',
        values: { x: '1', y: '2', strokeColor: 'red' },
        type: EventType.HoverMove,
      }),
    };
    TestBed.configureTestingModule({
      providers: [
        LinesEventsDirective,
        Renderer2,
        { provide: LINES, useValue: linesStub },
      ],
    });
    directive = TestBed.inject(LinesEventsDirective);
    directive.lines = linesStub;
  });

  it('should return true if pointer is inside show tooltip radius', () => {
    spyOn(directive, 'getPointerDistanceFromPoint').and.returnValue(5);
    expect(directive.pointerIsInsideShowTooltipRadius(0, 0, 0)).toBeTrue();
  });

  it('should return false if pointer is outside show tooltip radius', () => {
    spyOn(directive, 'getPointerDistanceFromPoint').and.returnValue(15);
    expect(directive.pointerIsInsideShowTooltipRadius(0, 0, 0)).toBeFalse();
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

  it('should emit interaction output', () => {
    spyOn(directive.interactionOutput, 'emit');
    const output: any = {
      positionX: 1,
      positionY: 2,
      datum: {},
      color: 'red',
      values: { x: '1', y: '2', strokeColor: 'red' },
      type: EventType.HoverMove,
    };
    directive.emitInteractionOutput(output);
    expect(directive.interactionOutput.emit).toHaveBeenCalledWith(output);
  });

  it('should call onEnter and run actions if allowed', () => {
    const action: any = { initialize: jasmine.createSpy('init') };
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = () => true;
    directive.onEnter({} as PointerEvent, {} as Element);
    expect(action.initialize).toHaveBeenCalledWith(directive);
  });

  it('should call onMove and callPointerEventActions if allowed and pointer is in chart area', () => {
    directive.hoverMoveActions = [];
    (directive as any).isEventAllowed = () => true;
    spyOn(directive, 'setPositionsFromPointer');
    directive.pointerIsInChartArea = () => true;
    const callPointerEventActionsSpy = spyOn(
      directive as any,
      'callPointerEventActions'
    );
    directive.onMove({} as PointerEvent, {} as Element);
    expect(directive.setPositionsFromPointer).toHaveBeenCalled();
    expect(callPointerEventActionsSpy).toHaveBeenCalled();
  });

  it('should call onLeave and run onEnd if actionActive', () => {
    const action: any = { onEnd: jasmine.createSpy('onEnd') };
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = () => true;
    directive.actionActive = true;
    directive.onLeave({} as PointerEvent, {} as Element);
    expect(action.onEnd).toHaveBeenCalledWith(directive);
    expect(directive.actionActive).toBeFalse();
  });

  it('should call onClick and callPointerEventActions if allowed and pointer is in chart area', () => {
    directive.clickActions = [];
    (directive as any).isEventAllowed = () => true;
    spyOn(directive, 'setPositionsFromPointer');
    directive.pointerIsInChartArea = () => true;
    const callPointerEventActionsSpy = spyOn(
      directive as any,
      'callPointerEventActions'
    );
    directive.onClick({} as PointerEvent, {} as Element);
    expect(directive.setPositionsFromPointer).toHaveBeenCalled();
    expect(callPointerEventActionsSpy).toHaveBeenCalled();
  });

  it('should call onClickRemove and run onEnd for each clickAction', () => {
    const action: any = { onEnd: jasmine.createSpy('onEnd') };
    directive.clickActions = [action];
    (directive as any).isEventAllowed = () => true;
    directive.onClickRemove();
    expect(action.onEnd).toHaveBeenCalledWith(directive);
  });

  it('should call onInputEvent and run onStart/onEnd for each inputEventAction', () => {
    const onStart = jasmine.createSpy('onStart');
    const onEnd = jasmine.createSpy('onEnd');
    directive.inputEventActions = [{ onStart, onEnd }];
    (directive as any).isEventAllowed = () => true;
    directive.onInputEvent('value');
    expect(onStart).toHaveBeenCalledWith(directive, 'value');
    directive.onInputEvent(null);
    expect(onEnd).toHaveBeenCalledWith(directive, null);
  });
});

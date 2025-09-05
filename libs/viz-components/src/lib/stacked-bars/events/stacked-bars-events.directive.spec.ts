/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { selectAll } from 'd3';
import { of } from 'rxjs';
import { EventType } from '../../events/events.types';
import { STACKED_BARS } from '../stacked-bars.component';
import { StackedBarsEventsDirective } from './stacked-bars-events.directive';

describe('StackedBarsEventsDirective', () => {
  let directive: StackedBarsEventsDirective<any, any, any>;
  let stackedBarsStub: any;
  let barElement: any;
  let stackDatum: any;

  beforeEach(() => {
    stackDatum = { foo: 'bar' };
    barElement = {
      getBoundingClientRect: () => ({ width: 100, height: 50 }),
      getAttribute: (attr: string) =>
        attr === 'x' ? '10' : attr === 'y' ? '20' : '0',
      __data__: stackDatum,
    };
    stackedBarsStub = {
      bars$: of(selectAll([barElement])),
      getSourceDatumFromStackedBarDatum: jasmine
        .createSpy('getSourceDatumFromStackedBarDatum')
        .and.returnValue({ d: 1 }),
      getTooltipData: jasmine
        .createSpy('getTooltipData')
        .and.returnValue({ tooltip: 'data' }),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: STACKED_BARS, useValue: stackedBarsStub },
        Renderer2,
        StackedBarsEventsDirective,
      ],
    });
    directive = TestBed.inject(StackedBarsEventsDirective);
    directive.interactionOutput = new EventEmitter();
    directive.hoverActions = [
      {
        onStart: jasmine.createSpy('hoverOnStart'),
        onEnd: jasmine.createSpy('hoverOnEnd'),
      },
    ];
    directive.hoverMoveActions = [
      {
        onStart: jasmine.createSpy('hoverMoveOnStart'),
        onEnd: jasmine.createSpy('hoverMoveOnEnd'),
        initialize: jasmine.createSpy('hoverMoveInit'),
      },
    ];
    directive.clickActions = [
      {
        onStart: jasmine.createSpy('clickOnStart'),
        onEnd: jasmine.createSpy('clickOnEnd'),
      },
    ];
    directive.inputEventActions = [
      {
        onStart: jasmine.createSpy('inputOnStart'),
        onEnd: jasmine.createSpy('inputOnEnd'),
      },
    ];
    directive.preventAction = {
      hover: false,
      hoverMove: false,
      click: false,
      input: false,
    };
    (directive as any).events = [];
    (directive as any).inputEvent$ = of(true);
  });

  it('should get elements as observable', (done) => {
    directive.getElements().subscribe((els: any[]) => {
      expect(els[0]).toBe(barElement);
      done();
    });
  });

  it('should initialize from element', () => {
    directive.initFromElement(barElement);
    expect(directive.origin).toBe(barElement);
    expect(directive.stackDatum).toBe(stackDatum);
  });

  it('should set positions from element', () => {
    directive.origin = barElement;
    directive.setPositionsFromElement();
    expect(directive.positionX).toBe(50);
    expect(directive.positionY).toBe(25);
  });

  it('should set positions from pointer', () => {
    directive.origin = barElement;
    (directive as any).setPositionsFromPointer({
      clientX: 15,
      clientY: 25,
      target: barElement,
      pageX: 15,
      pageY: 25,
    });
    expect(directive.positionX).toBe(5);
    expect(directive.positionY).toBe(5);
  });

  it('should emit interaction output', (done) => {
    const output = {
      origin: barElement,
      positionX: 1,
      positionY: 2,
      type: EventType.Hover,
      stackDatum,
      sourceDatum: { d: 1 },
      tooltip: 'data',
      datum: { foo: 'datum' },
      color: 'red',
      values: { x: 1, y: 2, category: 'foo' },
    };
    directive.interactionOutput.subscribe((val: any) => {
      expect(val).toEqual(output);
      done();
    });
    directive.emitInteractionOutput(output as any);
  });

  it('should handle onEnter for hover', () => {
    spyOn(directive as any, 'isEventAllowed').and.callFake(
      (type) => type === EventType.Hover
    );
    spyOn(directive as any, 'setPositionsFromElement');
    spyOn(directive as any, 'runActions');
    directive.onEnter({} as any, barElement);
    expect((directive as any).setPositionsFromElement).toHaveBeenCalled();
    expect((directive as any).runActions).toHaveBeenCalledWith(
      directive.hoverActions,
      jasmine.any(Function)
    );
  });

  it('should handle onEnter for hoverMove', () => {
    spyOn(directive as any, 'isEventAllowed').and.callFake(
      (type) => type === EventType.HoverMove
    );
    spyOn(directive as any, 'runActions');
    directive.onEnter({} as any, barElement);
    expect((directive as any).runActions).toHaveBeenCalledWith(
      directive.hoverMoveActions,
      jasmine.any(Function)
    );
  });

  it('should handle onMove', () => {
    spyOn(directive as any, 'isEventAllowed').and.returnValue(true);
    spyOn(directive as any, 'setPositionsFromPointer');
    directive.onMove({} as any, barElement);
    expect((directive as any).setPositionsFromPointer).toHaveBeenCalled();
    expect(directive.hoverMoveActions[0].onStart).toHaveBeenCalled();
  });

  it('should handle onLeave for hover', () => {
    spyOn(directive as any, 'isEventAllowed').and.callFake(
      (type) => type === EventType.Hover
    );
    spyOn(directive as any, 'resetDirective');
    directive.onLeave({} as any, barElement);
    expect(directive.hoverActions[0].onEnd).toHaveBeenCalled();
    expect((directive as any).resetDirective).toHaveBeenCalled();
  });

  it('should handle onLeave for hoverMove', () => {
    spyOn(directive as any, 'isEventAllowed').and.callFake(
      (type) => type === EventType.HoverMove
    );
    spyOn(directive as any, 'resetDirective');
    directive.onLeave({} as any, barElement);
    expect(directive.hoverMoveActions[0].onEnd).toHaveBeenCalled();
    expect((directive as any).resetDirective).toHaveBeenCalled();
  });

  it('should handle onClick when click is allowed and hover event exists', () => {
    spyOn(directive as any, 'hasEvent').and.returnValue(true);
    spyOn(directive as any, 'setPositionsFromElement');
    spyOn(directive as any, 'runActions');
    directive.onClick({} as any, barElement);
    expect((directive as any).setPositionsFromElement).toHaveBeenCalled();
    expect((directive as any).runActions).toHaveBeenCalledWith(
      directive.clickActions,
      jasmine.any(Function)
    );
  });

  it('should handle onClick when click is allowed and hover event does not exist', () => {
    spyOn(directive as any, 'hasEvent').and.returnValue(false);
    spyOn(directive as any, 'setPositionsFromPointer');
    spyOn(directive as any, 'runActions');
    directive.onClick({} as any, barElement);
    expect((directive as any).setPositionsFromPointer).toHaveBeenCalled();
    expect((directive as any).runActions).toHaveBeenCalledWith(
      directive.clickActions,
      jasmine.any(Function)
    );
  });

  it('should handle onClickRemove', () => {
    spyOn(directive as any, 'runActions');
    spyOn(directive as any, 'resetDirective');
    directive.onClickRemove();
    expect((directive as any).runActions).toHaveBeenCalledWith(
      directive.clickActions,
      jasmine.any(Function)
    );
    expect((directive as any).resetDirective).toHaveBeenCalled();
  });

  it('should handle onInputEvent with value', () => {
    spyOn(directive as any, 'isEventAllowed').and.returnValue(true);
    directive.onInputEvent('foo');
    expect(directive.inputEventActions[0].onStart).toHaveBeenCalledWith(
      directive,
      'foo'
    );
  });

  it('should handle onInputEvent with null', () => {
    spyOn(directive as any, 'isEventAllowed').and.returnValue(true);
    directive.onInputEvent(null);
    expect(directive.inputEventActions[0].onEnd).toHaveBeenCalledWith(
      directive,
      null
    );
  });

  it('should getStackDatum', () => {
    directive.stackDatum = stackDatum;
    expect(directive.getStackDatum()).toBe(stackDatum);
    directive.stackDatum = null;
    expect(directive.getStackDatum()).toBeNull();
  });

  it('should getInteractionOutput', () => {
    directive.origin = barElement;
    directive.positionX = 1;
    directive.positionY = 2;
    directive.stackDatum = stackDatum;
    const output = directive.getInteractionOutput(EventType.Hover);
    expect(output).toEqual(
      jasmine.objectContaining({
        tooltip: 'data',
        origin: barElement,
        anchor: {
          x: 1,
          y: 2,
        },
        type: EventType.Hover,
      })
    );
    expect(
      stackedBarsStub.getSourceDatumFromStackedBarDatum
    ).toHaveBeenCalledWith(stackDatum);
    expect(stackedBarsStub.getTooltipData).toHaveBeenCalled();
  });
});

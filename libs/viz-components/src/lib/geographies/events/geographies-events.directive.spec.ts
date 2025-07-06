/* eslint-disable @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { selectAll } from 'd3';
import { of } from 'rxjs';
import { EventType } from '../../events';
import { GEOGRAPHIES } from '../geographies.component';
import { GeographiesEventsDirective } from './geographies-events.directive';

describe('GeographiesEventsDirective', () => {
  let directive: GeographiesEventsDirective<any, any, any, any>;
  let geographiesStub: any;

  beforeEach(() => {
    geographiesStub = {
      pathsByLayer$: {
        pipe: () => ({
          subscribe: (cb: any) =>
            cb([[{ nodes: () => [document.createElement('path')] }]]),
        }),
      },
      config: {
        attributeDataLayer: { getTooltipData: () => ({ foo: 'bar' }) },
        geojsonPropertiesLayers: [{ getTooltipData: () => ({ foo: 'baz' }) }],
      },
      path: {
        bounds: () => [
          [0, 0],
          [10, 20],
        ],
      },
    };
    TestBed.configureTestingModule({
      providers: [
        GeographiesEventsDirective,
        Renderer2,
        { provide: GEOGRAPHIES, useValue: geographiesStub },
      ],
    });
    directive = TestBed.inject(GeographiesEventsDirective);
    directive.geographies = geographiesStub;
  });

  it('should get elements from pathsByLayer$', (done) => {
    // Simulate observable
    directive.geographies.pathsByLayer$ = of(
      [selectAll([document.createElement('path')]), selectAll([])] // empty selection to test flatMap
    );
    directive.getElements().subscribe((els: any) => {
      expect(Array.isArray(els)).toBeTrue();
      expect(els[0] instanceof Element).toBeTrue();
      done();
    });
  });

  it('should call initFromElement and run hoverActions on onEnter (Hover)', () => {
    const el = document.createElement('path');
    const action = { onStart: jasmine.createSpy('onStart') } as any;
    directive.hoverActions = [action];
    (directive as any).isEventAllowed = (type: any) => type === EventType.Hover;
    spyOn(directive, 'initFromElement').and.callThrough();
    spyOn(directive, 'setPositionsFromElement');
    directive.onEnter({} as PointerEvent, el);
    expect(directive.initFromElement).toHaveBeenCalledWith(el);
    expect(directive.setPositionsFromElement).toHaveBeenCalled();
    expect(action.onStart).toHaveBeenCalled();
  });

  it('should call runActions with hoverMoveActions on onEnter (HoverMove)', () => {
    const el = document.createElement('path');
    const action = { initialize: jasmine.createSpy('initialize') } as any;
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = (type: any) =>
      type === EventType.HoverMove;
    spyOn(directive, 'initFromElement').and.callThrough();
    directive.onEnter({} as PointerEvent, el);
    expect(directive.initFromElement).toHaveBeenCalledWith(el);
    expect(action.initialize).toHaveBeenCalled();
  });

  it('should call setPositionsFromPointer and run onStart for each hoverMoveAction on onMove', () => {
    const action = { onStart: jasmine.createSpy('onStart') } as any;
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = (type: any) =>
      type === EventType.HoverMove;
    spyOn(directive, 'setPositionsFromPointer');
    directive.onMove({} as PointerEvent, {} as Element);
    expect(directive.setPositionsFromPointer).toHaveBeenCalled();
    expect(action.onStart).toHaveBeenCalled();
  });

  it('should call onEnd for each hoverAction on onLeave (Hover)', () => {
    const action = { onEnd: jasmine.createSpy('onEnd') } as any;
    directive.hoverActions = [action];
    (directive as any).isEventAllowed = (type: any) => type === EventType.Hover;
    spyOn(directive as any, 'resetDirective');
    directive.onLeave({} as PointerEvent, {} as Element);
    expect(action.onEnd).toHaveBeenCalled();
    expect((directive as any).resetDirective).toHaveBeenCalled();
  });

  it('should call onEnd for each hoverMoveAction on onLeave (HoverMove)', () => {
    const action = { onEnd: jasmine.createSpy('onEnd') } as any;
    directive.hoverMoveActions = [action];
    (directive as any).isEventAllowed = (type: any) =>
      type === EventType.HoverMove;
    spyOn(directive as any, 'resetDirective');
    directive.onLeave({} as PointerEvent, {} as Element);
    expect(action.onEnd).toHaveBeenCalled();
    expect((directive as any).resetDirective).toHaveBeenCalled();
  });

  it('should call setPositionsFromElement and run clickActions on onClick if not prevented and has Hover', () => {
    const el = document.createElement('path');
    const action = { onStart: jasmine.createSpy('onStart') } as any;
    directive.clickActions = [action];
    directive.preventAction = {
      click: false,
      hover: false,
      hoverMove: false,
      input: false,
    };
    (directive as any).hasEvent = (type: any) => type === EventType.Hover;
    spyOn(directive, 'initFromElement').and.callThrough();
    spyOn(directive, 'setPositionsFromElement');
    directive.onClick({} as PointerEvent, el);
    expect(directive.initFromElement).toHaveBeenCalledWith(el);
    expect(directive.setPositionsFromElement).toHaveBeenCalled();
    expect(action.onStart).toHaveBeenCalled();
  });

  it('should call setPositionsFromPointer and run clickActions on onClick if not prevented and no Hover', () => {
    const el = document.createElement('path');
    const action = { onStart: jasmine.createSpy('onStart') } as any;
    directive.clickActions = [action];
    directive.preventAction = {
      click: false,
      hover: false,
      hoverMove: false,
      input: false,
    };
    (directive as any).hasEvent = () => false;
    spyOn(directive, 'initFromElement').and.callThrough();
    spyOn(directive, 'setPositionsFromPointer');
    directive.onClick({} as PointerEvent, el);
    expect(directive.initFromElement).toHaveBeenCalledWith(el);
    expect(directive.setPositionsFromPointer).toHaveBeenCalled();
    expect(action.onStart).toHaveBeenCalled();
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
    spyOn(directive as any, 'resetDirective');
    directive.onClickRemove();
    expect(action.onEnd).toHaveBeenCalled();
    expect((directive as any).resetDirective).toHaveBeenCalled();
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

  it('should call select and set path, layer, and bounds in initFromElement', () => {
    const el = document.createElement('path');
    el.dataset['layerIndex'] = '0';
    spyOn<any>(window, 'getComputedStyle').and.returnValue({}); // for d3 select
    directive.geographies.config.attributeDataLayer = {
      getTooltipData: () => ({ foo: 'bar' }),
    };
    directive.geographies.path = {
      bounds: () => [
        [0, 0],
        [10, 20],
      ],
    };
    directive.initFromElement(el);
    expect(directive.path).toBe(el as any);
    expect(directive.bounds).toEqual([
      [0, 0],
      [10, 20],
    ]);
  });

  it('should set positionX and positionY in setPositionsFromElement', () => {
    directive.bounds = [
      [0, 0],
      [10, 20],
    ];
    directive.setPositionsFromElement();
    expect(directive.positionX).toBe(5);
    expect(directive.positionY).toBe(10);
  });

  it('should emit interaction output', () => {
    spyOn(directive.interactionOutput, 'emit');
    const output = {
      geography: {} as any,
      origin: {} as any,
      positionX: 1,
      positionY: 2,
      type: EventType.Hover,
      datum: {},
      color: 'red',
      values: { id: 1 },
    };
    directive.emitInteractionOutput(output as any);
    expect(directive.interactionOutput.emit).toHaveBeenCalledWith(output);
  });
});

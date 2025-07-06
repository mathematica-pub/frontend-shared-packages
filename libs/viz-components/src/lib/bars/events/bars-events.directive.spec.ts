/* eslint-disable @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { select } from 'd3';
import { of } from 'rxjs';
import { EventType } from '../../events';
import { BARS } from '../bars.component';
import { BarsEventsDirective } from './bars-events.directive';

describe('BarsEventsDirective', () => {
  let directive: BarsEventsDirective<any, any, any>;
  let barsStub: any;

  beforeEach(() => {
    barsStub = {
      bars$: of(select(document.createElement('rect'))),
      getSourceDatumFromBarDatum: () => ({ id: 1 }),
      getTooltipData: (datum: any) => ({ foo: 'bar', datum }),
    };
    TestBed.configureTestingModule({
      providers: [
        BarsEventsDirective,
        Renderer2,
        { provide: BARS, useValue: barsStub },
      ],
    });
    directive = TestBed.inject(BarsEventsDirective);
    directive.bars = barsStub;
  });

  it('should get elements from bars$', (done) => {
    directive.getElements().subscribe((els) => {
      expect(Array.isArray(els)).toBeTrue();
      expect(els[0] instanceof Element).toBeTrue();
      done();
    });
  });

  it('should call initFromElement and run hoverActions on onEnter (Hover)', () => {
    const el = document.createElement('rect');
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
    const el = document.createElement('rect');
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
    const el = document.createElement('rect');
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
    const el = document.createElement('rect');
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

  it('should emit interaction output', () => {
    spyOn(directive.interactionOutput, 'emit');
    const output = {
      origin: {} as any,
      positionX: 1,
      positionY: 2,
      type: EventType.Hover,
      datum: {},
      color: 'red',
      values: { x: '1', y: '2', category: 'red' },
    };
    directive.emitInteractionOutput(output as any);
    expect(directive.interactionOutput.emit).toHaveBeenCalledWith(output);
  });
});

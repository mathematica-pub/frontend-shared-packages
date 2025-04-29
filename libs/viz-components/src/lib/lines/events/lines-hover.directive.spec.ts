/* eslint-disable @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HoverDirective } from '../../events/hover.directive';
import { HoverDirectiveStub } from '../../testing/stubs/hover.directive.stub';
import { LinesComponentStub } from '../../testing/stubs/lines.component.stub';
import { LINES, LinesComponent } from '../lines.component';
import { LinesHoverDirective } from './lines-hover.directive';

describe('LinesHoverDirective', () => {
  let directive: LinesHoverDirective<any, any, LinesComponent<any, any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinesHoverDirective,
        Renderer2,
        {
          provide: LINES,
          useValue: LinesComponentStub,
        },
        {
          provide: HoverDirective,
          useValue: HoverDirectiveStub,
        },
      ],
    });
    directive = TestBed.inject(LinesHoverDirective);
    directive.unlistenTouchStart = [
      () => {
        return;
      },
    ];
    directive.unlistenPointerEnter = [
      () => {
        return;
      },
    ];
    directive.unlistenPointerLeave = () => {
      return;
    };
  });

  describe('setElements()', () => {
    it('sets elements to the correct value', () => {
      spyOn(directive, 'setListeners');
      directive.lines = {
        chart: {
          svgRef: {
            nativeElement: 'el',
          },
        },
      } as any;
      directive.setListenedElements();
      expect(directive.elements).toEqual(['el' as any]);
    });
  });

  describe('elementPointerEnter()', () => {
    let actionA: any;
    let onStartASpy: jasmine.Spy;
    let actionB: any;
    let onStartBSpy: jasmine.Spy;
    beforeEach(() => {
      onStartASpy = jasmine.createSpy('onStart');
      onStartBSpy = jasmine.createSpy('onStart');
      actionA = {
        onStart: onStartASpy,
      };
      actionB = {
        onStart: onStartBSpy,
      };
      directive.actions = [actionA, actionB] as any;
    });
    it('calls onStart with the correct value', () => {
      directive.onElementPointerEnter();
      expect(onStartASpy).toHaveBeenCalledWith(directive);
      expect(onStartBSpy).toHaveBeenCalledWith(directive);
    });
  });

  describe('elementPointerLeave()', () => {
    let actionA: any;
    let onEndASpy: jasmine.Spy;
    let actionB: any;
    let onEndBSpy: jasmine.Spy;
    beforeEach(() => {
      onEndASpy = jasmine.createSpy('onEnd');
      onEndBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onEnd: onEndASpy,
      };
      actionB = {
        onEnd: onEndBSpy,
      };
      directive.actions = [actionA, actionB] as any;
    });
    it('calls onEnd with the correct value', () => {
      directive.onElementPointerLeave();
      expect(onEndASpy).toHaveBeenCalledWith(directive);
      expect(onEndBSpy).toHaveBeenCalledWith(directive);
    });
  });
});

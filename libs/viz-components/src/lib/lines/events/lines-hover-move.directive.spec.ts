/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LinesComponentStub } from '../../testing/stubs/lines.component.stub';
import { LINES, LinesComponent } from '../lines.component';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';

describe('LinesHoverMoveDirective', () => {
  let directive: LinesHoverMoveDirective<any, any, LinesComponent<any, any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinesHoverMoveDirective,
        Renderer2,
        {
          provide: LINES,
          useValue: LinesComponentStub,
        },
      ],
    });
    directive = TestBed.inject(LinesHoverMoveDirective);
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
    directive.unlistenPointerMove = () => {
      return;
    };
    directive.unlistenPointerLeave = () => {
      return;
    };
  });

  describe('elementPointerMove()', () => {
    let chartAreaSpy: jasmine.Spy;
    let event: any;
    beforeEach(() => {
      event = 'event';
      spyOn(directive, 'getPointerValuesArray').and.returnValue([1, 2]);
      chartAreaSpy = spyOn(directive, 'pointerIsInChartArea').and.returnValue(
        true
      );
      spyOn(directive, 'determineHoverStyles');
    });
    it('calls getPointerValuesArray once', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.getPointerValuesArray).toHaveBeenCalledOnceWith(
        event as any
      );
    });
    it('sets pointerX to the correct value', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.pointerX).toEqual(1);
    });
    it('sets pointerY to the correct value', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.pointerY).toEqual(2);
    });
    it('calls pointerIsInChartArea once', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.pointerIsInChartArea).toHaveBeenCalledTimes(1);
    });
    it('calls determineHoverStyles once if pointerIsInChartArea returns true', () => {
      directive.onElementPointerMove(event as any);
      expect(directive.determineHoverStyles).toHaveBeenCalledTimes(1);
    });
    it('does not call determineHoverStyles if pointerIsInChartArea returns false', () => {
      chartAreaSpy.and.returnValue(false);
      directive.onElementPointerMove(event as any);
      expect(directive.determineHoverStyles).not.toHaveBeenCalled();
    });
  });

  describe('elementPointerLeave', () => {
    let actionA: any;
    let onStartASpy: jasmine.Spy;
    let onEndASpy: jasmine.Spy;
    let actionB: any;
    let onStartBSpy: jasmine.Spy;
    let onEndBSpy: jasmine.Spy;
    beforeEach(() => {
      onStartASpy = jasmine.createSpy('onStart');
      onEndASpy = jasmine.createSpy('onEnd');
      onStartBSpy = jasmine.createSpy('onStart');
      onEndBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onStart: onStartASpy,
        onEnd: onEndASpy,
      };
      actionB = {
        onStart: onStartBSpy,
        onEnd: onEndBSpy,
      };
      directive.actions = [actionA, actionB];
    });
    it('calls onEnd on each action in actions array', () => {
      directive.onElementPointerLeave();
      expect(onEndASpy).toHaveBeenCalledOnceWith(directive);
      expect(onEndBSpy).toHaveBeenCalledOnceWith(directive);
    });
  });

  describe('pointerIsInChartArea()', () => {
    beforeEach(() => {
      directive.lines = {
        ranges: {
          x: [0, 100],
          y: [300, 200],
        },
      } as any;
    });
    it('returns true if pointerX is in the x range and pointer Y is in the y range', () => {
      directive.pointerX = 50;
      directive.pointerY = 250;
      expect(directive.pointerIsInChartArea()).toEqual(true);
    });
    it('returns false if pointerX is not in the x range', () => {
      directive.pointerX = 150;
      directive.pointerY = 250;
      expect(directive.pointerIsInChartArea()).toEqual(false);
    });
    it('returns false if pointerY is not in the y range', () => {
      directive.pointerX = 50;
      directive.pointerY = 350;
      expect(directive.pointerIsInChartArea()).toEqual(false);
    });
  });

  describe('determineHoverStyles()', () => {
    let ttRadiusSpy: jasmine.Spy;
    let actionA: any;
    let onStartASpy: jasmine.Spy;
    let onEndASpy: jasmine.Spy;
    let actionBB: any;
    let onStartBSpy: jasmine.Spy;
    let onEndBSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(directive, 'getClosestPointIndex').and.returnValue(8);
      ttRadiusSpy = spyOn(
        directive,
        'pointerIsInsideShowTooltipRadius'
      ).and.returnValue(true);
      directive.pointerX = 100;
      directive.pointerY = 200;
      onStartASpy = jasmine.createSpy('onStart');
      onEndASpy = jasmine.createSpy('onEnd');
      onStartBSpy = jasmine.createSpy('onStart');
      onEndBSpy = jasmine.createSpy('onEnd');
      actionA = {
        onStart: onStartASpy,
        onEnd: onEndASpy,
      };
      actionBB = {
        onStart: onStartBSpy,
        onEnd: onEndBSpy,
      };
      directive.actions = [actionA, actionBB];
    });
    it('calls getClosestPointIndex once', () => {
      directive.determineHoverStyles();
      expect(directive.getClosestPointIndex).toHaveBeenCalledTimes(1);
    });
    it('sets closestPointIndex to the correct value', () => {
      directive.determineHoverStyles();
      expect(directive.closestPointIndex).toEqual(8);
    });
    it('calls pointerIsInsideShowTooltipRadius once', () => {
      directive.determineHoverStyles();
      expect(
        directive.pointerIsInsideShowTooltipRadius
      ).toHaveBeenCalledOnceWith(8, 100, 200);
    });
    it('calls onStart on all actions if pointerIsInsideShowTooltipRadius returns true', () => {
      directive.determineHoverStyles();
      expect(onStartASpy).toHaveBeenCalledOnceWith(directive);
      expect(onStartBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('sets actionActive equal to true if pointerIsInsideShowTooltipRadius returns true', () => {
      directive.determineHoverStyles();
      expect(directive.actionActive).toEqual(true);
    });
    it('does not call onStart on all actions if pointerIsInsideShowTooltipRadius returns false', () => {
      ttRadiusSpy.and.returnValue(false);
      directive.determineHoverStyles();
      expect(onStartASpy).not.toHaveBeenCalled();
      expect(onStartBSpy).not.toHaveBeenCalled();
    });
    it('calls onEnd on all actions if pointerIsInsideShowTooltipRadius returns false and actionActive is true', () => {
      ttRadiusSpy.and.returnValue(false);
      directive.actionActive = true;
      directive.determineHoverStyles();
      expect(onEndASpy).toHaveBeenCalledOnceWith(directive);
      expect(onEndBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('does not call onEnd on all actions if pointerIsInsideShowTooltipRadius returns false and actionActive is false', () => {
      ttRadiusSpy.and.returnValue(false);
      directive.determineHoverStyles();
      expect(onEndASpy).toHaveBeenCalledTimes(0);
      expect(onEndBSpy).toHaveBeenCalledTimes(0);
    });
    it('does not call onEnd on all actions if pointerIsInsideShowTooltipRadius returns true', () => {
      directive.determineHoverStyles();
      expect(onEndASpy).not.toHaveBeenCalled();
      expect(onEndBSpy).not.toHaveBeenCalled();
    });
  });

  describe('pointerIsInsideShowTooltipRadius()', () => {
    let distanceSpy: jasmine.Spy;
    beforeEach(() => {
      distanceSpy = spyOn(
        directive,
        'getPointerDistanceFromPoint'
      ).and.returnValue(10);
      directive.lines = {
        config: {
          x: {
            values: [1, 10, 20],
          },
          y: {
            values: [1, 100, 1000],
          },
          pointerDetectionRadius: undefined,
        },
      } as any;
    });
    it('returns true if pointerDetectionRadius is undefined', () => {
      expect(directive.pointerIsInsideShowTooltipRadius(8, 100, 200)).toEqual(
        true
      );
    });
    describe('pointerDetectionRadius is not null', () => {
      beforeEach(() => {
        (directive.lines.config as any).pointerDetectionRadius = 80;
      });
      it('calls getPointerDistanceFromPoint once', () => {
        directive.pointerIsInsideShowTooltipRadius(2, 100, 200);
        expect(directive.getPointerDistanceFromPoint).toHaveBeenCalledOnceWith(
          20,
          1000,
          100,
          200
        );
      });
      it('returns true if pointerDetectionRadius is not null and cursorDistance is less than detectionDistance', () => {
        expect(directive.pointerIsInsideShowTooltipRadius(2, 100, 200)).toEqual(
          true
        );
      });
      it('returns false if pointerDetectionRadius is not null and cursorDistance is greater than detectionDistance', () => {
        distanceSpy.and.returnValue(100);
        expect(directive.pointerIsInsideShowTooltipRadius(2, 100, 200)).toEqual(
          false
        );
      });
    });
  });
});

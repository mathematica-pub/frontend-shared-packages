/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LinesComponentStub } from '../testing/stubs/lines.component.stub';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LINES, LinesComponent } from './lines.component';

describe('LinesHoverMoveDirective', () => {
  let directive: LinesHoverMoveDirective<any, LinesComponent<any>>;

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
    let valuesSpy: jasmine.Spy;
    let chartAreaSpy: jasmine.Spy;
    let event: any;
    beforeEach(() => {
      event = 'event';
      valuesSpy = spyOn(directive, 'getPointerValuesArray').and.returnValue([
        1, 2,
      ]);
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
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let removeASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
      applyASpy = jasmine.createSpy('applyEffect');
      removeASpy = jasmine.createSpy('removeEffect');
      applyBSpy = jasmine.createSpy('applyEffect');
      removeBSpy = jasmine.createSpy('removeEffect');
      effectA = {
        applyEffect: applyASpy,
        removeEffect: removeASpy,
      };
      effectB = {
        applyEffect: applyBSpy,
        removeEffect: removeBSpy,
      };
      directive.effects = [effectA, effectB];
    });
    it('calls remove effect on each effect in effects array', () => {
      directive.onElementPointerLeave();
      expect(removeASpy).toHaveBeenCalledOnceWith(directive);
      expect(removeBSpy).toHaveBeenCalledOnceWith(directive);
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
    let pointSpy: jasmine.Spy;
    let ttRadiusSpy: jasmine.Spy;
    let effectA: any;
    let applyASpy: jasmine.Spy;
    let removeASpy: jasmine.Spy;
    let effectB: any;
    let applyBSpy: jasmine.Spy;
    let removeBSpy: jasmine.Spy;
    beforeEach(() => {
      pointSpy = spyOn(directive, 'getClosestPointIndex').and.returnValue(8);
      ttRadiusSpy = spyOn(
        directive,
        'pointerIsInsideShowTooltipRadius'
      ).and.returnValue(true);
      directive.pointerX = 100;
      directive.pointerY = 200;
      applyASpy = jasmine.createSpy('applyEffect');
      removeASpy = jasmine.createSpy('removeEffect');
      applyBSpy = jasmine.createSpy('applyEffect');
      removeBSpy = jasmine.createSpy('removeEffect');
      effectA = {
        applyEffect: applyASpy,
        removeEffect: removeASpy,
      };
      effectB = {
        applyEffect: applyBSpy,
        removeEffect: removeBSpy,
      };
      directive.effects = [effectA, effectB];
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
    it('calls applyEffect on all effects if pointerIsInsideShowTooltipRadius returns true', () => {
      directive.determineHoverStyles();
      expect(applyASpy).toHaveBeenCalledOnceWith(directive);
      expect(applyBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('sets effectApplied equal to true if pointerIsInsideShowTooltipRadius returns true', () => {
      directive.determineHoverStyles();
      expect(directive.effectApplied).toEqual(true);
    });
    it('does not call applyEffect on all effects if pointerIsInsideShowTooltipRadius returns false', () => {
      ttRadiusSpy.and.returnValue(false);
      directive.determineHoverStyles();
      expect(applyASpy).not.toHaveBeenCalled();
      expect(applyBSpy).not.toHaveBeenCalled();
    });
    it('calls removeEffect on all effects if pointerIsInsideShowTooltipRadius returns false and effectApplied is true', () => {
      ttRadiusSpy.and.returnValue(false);
      directive.effectApplied = true;
      directive.determineHoverStyles();
      expect(removeASpy).toHaveBeenCalledOnceWith(directive);
      expect(removeBSpy).toHaveBeenCalledOnceWith(directive);
    });
    it('does not call removeEffect on all effects if pointerIsInsideShowTooltipRadius returns false and effectApplied is false', () => {
      ttRadiusSpy.and.returnValue(false);
      directive.determineHoverStyles();
      expect(removeASpy).toHaveBeenCalledTimes(0);
      expect(removeBSpy).toHaveBeenCalledTimes(0);
    });
    it('does not call removeEffect on all effects if pointerIsInsideShowTooltipRadius returns true', () => {
      directive.determineHoverStyles();
      expect(removeASpy).not.toHaveBeenCalled();
      expect(removeBSpy).not.toHaveBeenCalled();
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
        values: {
          x: [1, 10, 20],
          y: [1, 100, 1000],
        },
        config: {
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
        directive.lines.config.pointerDetectionRadius = 80;
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

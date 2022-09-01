import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { HtmlTooltipDirective } from './html-tooltip.directive';

describe('HtmlTooltipDirective', () => {
  let directive: HtmlTooltipDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ViewContainerRef,
        Overlay,
        OverlayPositionBuilder,
        HtmlTooltipDirective,
        {
          provide: DATA_MARKS,
          useClass: DataMarks,
        },
      ],
    });
    directive = TestBed.inject(HtmlTooltipDirective);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(directive, 'setPositionStrategy');
      spyOn(directive, 'setScrollStrategy');
      spyOn(directive, 'createOverlay');
    });
    it('calls setPositionStrategy()', () => {
      directive.ngOnInit();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    });

    it('calls setScrollStrategy()', () => {
      directive.ngOnInit();
      expect(directive.setScrollStrategy).toHaveBeenCalledTimes(1);
    });

    it('calls createOverlay()', () => {
      directive.ngOnInit();
      expect(directive.createOverlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges', () => {
    let changes: any;
    beforeEach(() => {
      spyOn(directive, 'show');
      spyOn(directive, 'hide');
      spyOn(directive, 'updatePosition');
    });
    describe('if there are showTooltip changes', () => {
      beforeEach(() => {
        changes = { showTooltip: { currentValue: 'new tooltip' } };
      });
      describe('if overlayRef is truthy', () => {
        beforeEach(() => {
          directive.overlayRef = 'overlay' as any;
        });
        it('calls show if showTooltip is true', () => {
          directive.showTooltip = true;
          directive.ngOnChanges(changes);
          expect(directive.show).toHaveBeenCalledTimes(1);
        });
        it('does not call show if showTooltip is false', () => {
          directive.showTooltip = false;
          directive.ngOnChanges(changes);
          expect(directive.show).not.toHaveBeenCalled();
        });
        it('calls hide if showTooltip is false', () => {
          directive.showTooltip = false;
          directive.ngOnChanges(changes);
          expect(directive.hide).toHaveBeenCalledTimes(1);
        });
        it('does not call hide if showTooltip is true', () => {
          directive.showTooltip = true;
          directive.ngOnChanges(changes);
          expect(directive.hide).not.toHaveBeenCalled();
        });
      });
      describe('if overlayRef is falsy', () => {
        beforeEach(() => {
          directive.overlayRef = null;
        });
        it('does not call show', () => {
          directive.showTooltip = true;
          directive.ngOnChanges(changes);
          expect(directive.show).not.toHaveBeenCalled();
        });
        it('does not call hide', () => {
          directive.showTooltip = false;
          directive.ngOnChanges(changes);
          expect(directive.hide).not.toHaveBeenCalled();
        });
      });
    });
    describe('if there are no showTooltip changes', () => {
      beforeEach(() => {
        changes = {};
      });
      it('does not call show', () => {
        directive.showTooltip = true;
        directive.ngOnChanges(changes);
        expect(directive.show).not.toHaveBeenCalled();
      });
      it('does not call hide', () => {
        directive.showTooltip = false;
        directive.ngOnChanges(changes);
        expect(directive.hide).not.toHaveBeenCalled();
      });
    });

    describe('if there are position changes', () => {
      beforeEach(() => {
        changes = { position: { currentValue: 'new position' } };
      });
      it('calls updatePosition if overlayRef is truthy', () => {
        directive.overlayRef = 'overlay' as any;
        directive.ngOnChanges(changes);
        expect(directive.updatePosition).toHaveBeenCalledTimes(1);
      });
      it('does not call updatePosition if overlayRef is falsy', () => {
        directive.overlayRef = null;
        directive.ngOnChanges(changes);
        expect(directive.updatePosition).not.toHaveBeenCalled();
      });
    });
  });

  describe('getOverlayClasses', () => {
    beforeEach(() => {
      directive.disableEventsOnTooltip = false;
      directive.position = {} as any;
    });
    it('integration: returns the correct classes: has multiple classes on position', () => {
      directive.position = {
        panelClass: ['one', 'two'],
      } as any;
      expect(directive.getOverlayClasses()).toEqual([
        'vic-html-tooltip-overlay',
        'one',
        'two',
      ]);
    });
    it('integration: returns the correct classes: has one class on position', () => {
      directive.position = {
        panelClass: 'one',
      } as any;
      expect(directive.getOverlayClasses()).toEqual([
        'vic-html-tooltip-overlay',
        'one',
      ]);
    });
    it('integration: returns the correct classes: has no classes on position', () => {
      directive.position = {} as any;
      expect(directive.getOverlayClasses()).toEqual([
        'vic-html-tooltip-overlay',
      ]);
    });
    it('integration: returns the correct classes: disableEvents is true', () => {
      directive.disableEventsOnTooltip = true;
      expect(directive.getOverlayClasses()).toEqual([
        'vic-html-tooltip-overlay',
        'events-disabled',
      ]);
    });
  });
});

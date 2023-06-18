import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../../core/services/utilities.service';
import { DataMarks } from '../../data-marks/data-marks';
import { DATA_MARKS } from '../../data-marks/data-marks.token';
import { MainServiceStub } from '../../testing/stubs/services/main.service.stub';
import { HtmlTooltipConfig } from './html-tooltip.config';
import { HtmlTooltipDirective } from './html-tooltip.directive';

describe('HtmlTooltipDirective', () => {
  let directive: HtmlTooltipDirective;
  let mainServiceStub: MainServiceStub;
  let destroySpy: jasmine.Spy;

  beforeEach(() => {
    mainServiceStub = new MainServiceStub();
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
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    });
    directive = TestBed.inject(HtmlTooltipDirective);
    destroySpy = spyOn(directive, 'ngOnDestroy');
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(directive, 'setOverlayParameters');
      spyOn(directive, 'createOverlay');
    });
    it('calls setOverlayParameters()', () => {
      directive.ngOnInit();
      expect(directive.setOverlayParameters).toHaveBeenCalledTimes(1);
    });
    it('calls createOverlay()', () => {
      directive.ngOnInit();
      expect(directive.createOverlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges', () => {
    let changes: any;
    let objChangedSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(directive, 'show');
      spyOn(directive, 'hide');
      spyOn(directive, 'updatePosition');
      spyOn(directive, 'updateSize');
      spyOn(directive, 'updateClasses');
      objChangedSpy =
        mainServiceStub.utilitiesServiceStub.objectOnNgChangesChanged;
      directive.config = new HtmlTooltipConfig();
    });
    describe('if there are config.show changes', () => {
      beforeEach(() => {
        changes = {};
        objChangedSpy.and.returnValue(true);
      });
      describe('if overlayRef is truthy', () => {
        beforeEach(() => {
          directive.overlayRef = 'overlay' as any;
        });
        it('calls show if showTooltip is true', () => {
          directive.config.show = true;
          directive.ngOnChanges(changes);
          expect(directive.show).toHaveBeenCalledTimes(1);
        });
        it('does not call show if showTooltip is false', () => {
          directive.config.show = false;
          directive.ngOnChanges(changes);
          expect(directive.show).not.toHaveBeenCalled();
        });
        it('calls hide if showTooltip is false', () => {
          directive.config.show = false;
          directive.ngOnChanges(changes);
          expect(directive.hide).toHaveBeenCalledTimes(1);
        });
        it('does not call hide if showTooltip is true', () => {
          directive.config.show = true;
          directive.ngOnChanges(changes);
          expect(directive.hide).not.toHaveBeenCalled();
        });
      });
      describe('if overlayRef is falsy', () => {
        beforeEach(() => {
          directive.overlayRef = null;
        });
        it('does not call show', () => {
          directive.config.show = true;
          directive.ngOnChanges(changes);
          expect(directive.show).not.toHaveBeenCalled();
        });
        it('does not call hide', () => {
          directive.config.show = false;
          directive.ngOnChanges(changes);
          expect(directive.hide).not.toHaveBeenCalled();
        });
      });
    });
    describe('if there are no showTooltip changes', () => {
      beforeEach(() => {
        changes = {};
        objChangedSpy.and.returnValue(false);
      });
      it('does not call show', () => {
        directive.config.show = true;
        directive.ngOnChanges(changes);
        expect(directive.show).not.toHaveBeenCalled();
      });
      it('does not call hide', () => {
        directive.config.show = false;
        directive.ngOnChanges(changes);
        expect(directive.hide).not.toHaveBeenCalled();
      });
    });

    describe('if there are position changes', () => {
      beforeEach(() => {
        changes = {};
        objChangedSpy.and.returnValue(true);
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

    describe('if there are size changes', () => {
      beforeEach(() => {
        changes = {};
        objChangedSpy.and.returnValue(true);
      });
      it('calls updateSize if overlayRef is truthy', () => {
        directive.overlayRef = 'overlay' as any;
        directive.ngOnChanges(changes);
        expect(directive.updateSize).toHaveBeenCalledTimes(1);
      });
      it('does not call updateSize if overlayRef is falsy', () => {
        directive.overlayRef = null;
        directive.ngOnChanges(changes);
        expect(directive.updateSize).not.toHaveBeenCalled();
      });
    });

    describe('if there are panelClass changes', () => {
      beforeEach(() => {
        changes = {};
        objChangedSpy.and.returnValue(true);
      });
      it('calls updateClasses if overlayRef is truthy', () => {
        directive.overlayRef = 'overlay' as any;
        directive.ngOnChanges(changes);
        expect(directive.updateClasses).toHaveBeenCalledTimes(1);
      });
      it('does not call updateClasses if overlayRef is falsy', () => {
        directive.overlayRef = null;
        directive.ngOnChanges(changes);
        expect(directive.updateClasses).not.toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(directive, 'destroyOverlay');
      destroySpy.and.callThrough();
    });
    it('calls destroyOverlay', () => {
      directive.ngOnDestroy();
      expect(directive.destroyOverlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('setOverlayParameters', () => {
    beforeEach(() => {
      spyOn(directive, 'setPositionStrategy');
      spyOn(directive, 'setScrollStrategy');
      spyOn(directive, 'setPanelClasses');
    });
    it('calls setPositionStrategy', () => {
      directive.setOverlayParameters();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    });
    it('calls setScrollStrategy', () => {
      directive.setOverlayParameters();
      expect(directive.setScrollStrategy).toHaveBeenCalledTimes(1);
    });
    it('calls setPanelClasses', () => {
      directive.setOverlayParameters();
      expect(directive.setPanelClasses).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPanelClasses', () => {
    beforeEach(() => {
      directive.config = new HtmlTooltipConfig();
      directive.config.disableEventsOnTooltip = false;
    });
    it('integration: returns the correct classes: user specified multiple classes as array', () => {
      directive.config.panelClass = ['one', 'two'];
      directive.setPanelClasses();
      expect(directive.panelClass).toEqual([
        'vic-html-tooltip-overlay',
        'one',
        'two',
      ]);
    });
    it('integration: returns the correct classes: user specified one class as string', () => {
      directive.config.panelClass = 'one';
      directive.setPanelClasses();
      expect(directive.panelClass).toEqual(['vic-html-tooltip-overlay', 'one']);
    });
    it('integration: returns the correct classes: has no classes on position', () => {
      directive.config.panelClass = undefined;
      directive.setPanelClasses();
      expect(directive.panelClass).toEqual(['vic-html-tooltip-overlay']);
    });
    it('integration: returns the correct classes: disableEvents is true', () => {
      directive.config.disableEventsOnTooltip = true;
      directive.config.panelClass = undefined;
      directive.setPanelClasses();
      expect(directive.panelClass).toEqual([
        'vic-html-tooltip-overlay',
        'events-disabled',
      ]);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { NgOnChangesUtilities } from '../../core/utilities/ng-on-changes';
import { VIC_DATA_MARKS } from '../../data-marks/data-marks.token';
import { DataMarksBaseStub } from '../../testing/stubs/data-marks-base.stub';
import { MainServiceStub } from '../../testing/stubs/services/main.service.stub';
import { VicHtmlTooltipConfig } from './html-tooltip.config';
import { HtmlTooltipDirective } from './html-tooltip.directive';

describe('HtmlTooltipDirective', () => {
  let directive: HtmlTooltipDirective<any, any>;
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
          provide: VIC_DATA_MARKS,
          useClass: DataMarksBaseStub,
        },
        {
          provide: Overlay,
          useValue: mainServiceStub.overlayStub,
        },
      ],
    });
    directive = TestBed.inject(HtmlTooltipDirective);
    destroySpy = spyOn(directive, 'ngOnDestroy');
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(directive, 'init');
    });
    it('calls init() if config is defined', () => {
      directive.config = 'hello' as any;
      directive.ngOnInit();
      expect(directive.init).toHaveBeenCalledTimes(1);
    });
    it('does not call init() if config is undefined', () => {
      directive.ngOnInit();
      expect(directive.init).not.toHaveBeenCalled();
    });
  });

  describe('init()', () => {
    beforeEach(() => {
      spyOn(directive, 'createOverlay');
    });
    it('calls createOverlay once if overlayRef is falsy', () => {
      directive.init();
      expect(directive.createOverlay).toHaveBeenCalledTimes(1);
    });
    it('does not call createOverlay if overlayRef is truthy', () => {
      directive.overlayRef = 'hello' as any;
      directive.init();
      expect(directive.createOverlay).not.toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    let changes: any;
    beforeEach(() => {
      spyOn(directive, 'checkPositionChanges');
      spyOn(directive, 'checkClassChanges');
      spyOn(directive, 'checkSizeChanges');
      spyOn(directive, 'checkBackdropChanges');
      spyOn(directive, 'updateVisibility');
      spyOn(directive, 'init');
      directive.config = new VicHtmlTooltipConfig();
      changes = {};
    });
    describe('if overlayRef and config are truthy', () => {
      beforeEach(() => {
        directive.overlayRef = 'overlay' as any;
        directive.config = 'hello' as any;
      });
      it('calls checkPositionChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkPositionChanges).toHaveBeenCalledOnceWith(
          changes
        );
      });
      it('calls checkClassChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkClassChanges).toHaveBeenCalledOnceWith(changes);
      });
      it('calls checkSizeChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkSizeChanges).toHaveBeenCalledOnceWith(changes);
      });
      it('calls checkBackdropChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkBackdropChanges).toHaveBeenCalledOnceWith(
          changes
        );
      });
      it('calls updateVisibility once', () => {
        directive.ngOnChanges(changes);
        expect(directive.updateVisibility).toHaveBeenCalledTimes(1);
      });
    });
    describe('if overlayRef is falsy and config is truthy', () => {
      beforeEach(() => {
        directive.config = 'hello' as any;
      });
      it('does not call checkClassChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkClassChanges).not.toHaveBeenCalled();
      });
      it('does not call checkPositionChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkPositionChanges).not.toHaveBeenCalled();
      });
      it('does not call checkSizeChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkSizeChanges).not.toHaveBeenCalled();
      });
      it('does not call checkBackdropChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkBackdropChanges).not.toHaveBeenCalled();
      });
      it('does not call updateVisibility', () => {
        directive.ngOnChanges(changes);
        expect(directive.updateVisibility).not.toHaveBeenCalled();
      });
      it('calls init', () => {
        directive.ngOnChanges(changes);
        expect(directive.init).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('configChanged', () => {
    let changesSpy: jasmine.Spy;
    beforeEach(() => {
      changesSpy = spyOn(NgOnChangesUtilities, 'inputObjectChanged');
    });
    it('calls objectOnNgChangesChanged once with the correct value', () => {
      directive.configChanged('changes' as any, 'show');
      expect(NgOnChangesUtilities.inputObjectChanged).toHaveBeenCalledOnceWith(
        'changes' as any,
        'config',
        'show'
      );
    });
    it('returns the correct value', () => {
      changesSpy.and.returnValue(true);
      expect(directive.configChanged('changes' as any, 'show')).toEqual(true);
    });
  });

  describe('checkPositionChanges', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      changedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'updatePosition');
    });
    it('calls updatePosition once if position changed', () => {
      changedSpy.and.returnValue(true);
      directive.checkPositionChanges('changes' as any);
      expect(directive.updatePosition).toHaveBeenCalledTimes(1);
    });
    it('does not call updatePosition if position did not change', () => {
      changedSpy.and.returnValue(false);
      directive.checkPositionChanges('changes' as any);
      expect(directive.updatePosition).not.toHaveBeenCalled();
    });
  });

  describe('checkClassChanges', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      changedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'updateClasses');
    });
    it('calls updatePanelClasses once if panelClass changed', () => {
      changedSpy.and.returnValue(true);
      directive.checkClassChanges('changes' as any);
      expect(directive.updateClasses).toHaveBeenCalledTimes(1);
    });
    it('calls updatePanelClasses once if disableEventsOnTooltip changed', () => {
      changedSpy.and.returnValues(false, true);
      directive.checkClassChanges('changes' as any);
      expect(directive.updateClasses).toHaveBeenCalledTimes(1);
    });
    it('does not call updatePanelClasses if neither panelClass nor disableEventsOnTooltip changed', () => {
      changedSpy.and.returnValues(false, false);
      directive.checkClassChanges('changes' as any);
      expect(directive.updateClasses).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkSizeChanges', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      changedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'updateSize');
    });
    it('calls updateSize once if size changed', () => {
      changedSpy.and.returnValue(true);
      directive.checkSizeChanges('changes' as any);
      expect(directive.updateSize).toHaveBeenCalledTimes(1);
    });
    it('does not call updateSize if size did not change', () => {
      changedSpy.and.returnValue(false);
      directive.checkSizeChanges('changes' as any);
      expect(directive.updateSize).not.toHaveBeenCalled();
    });
  });

  describe('checkBackdropChanges', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      changedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'updateForNewBackdropProperties');
    });
    it('calls updateForNewBackdropProperties once if hasBackdrop changed', () => {
      changedSpy.and.returnValue(true);
      directive.checkBackdropChanges('changes' as any);
      expect(directive.updateForNewBackdropProperties).toHaveBeenCalledTimes(1);
    });
    it('calls updateForNewBackdropProperties once if closeOnBackdropClick changed', () => {
      changedSpy.and.returnValues(false, true);
      directive.checkBackdropChanges('changes' as any);
      expect(directive.updateForNewBackdropProperties).toHaveBeenCalledTimes(1);
    });
    it('does not call updateForNewBackdropProperties if neither hasBackdrop nor closeOnBackdropClick changed', () => {
      changedSpy.and.returnValues(false, false);
      directive.checkBackdropChanges('changes' as any);
      expect(directive.updateForNewBackdropProperties).toHaveBeenCalledTimes(0);
    });
  });

  describe('updatePosition', () => {
    beforeEach(() => {
      spyOn(directive, 'setPositionStrategy');
      directive.overlayRef = {
        updatePositionStrategy: jasmine.createSpy('updatePositionStrategy'),
      } as any;
      directive.positionStrategy = 'test strategy' as any;
    });
    it('calls setPositionStrategy once', () => {
      directive.updatePosition();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    });
    it('calls updatePositionStrategy once with the correct value', () => {
      directive.updatePosition();
      expect(directive.overlayRef.updatePositionStrategy).toHaveBeenCalledWith(
        'test strategy' as any
      );
    });
  });

  describe('updateClasses', () => {
    beforeEach(() => {
      spyOn(directive, 'setPanelClasses');
      directive.overlayRef = {
        addPanelClass: jasmine.createSpy('addPanelClass'),
        removePanelClass: jasmine.createSpy('removePanelClass'),
      } as any;
      directive.panelClass = ['two'];
    });
    it('calls removePanelClass once with the correct value', () => {
      directive.updateClasses();
      expect(directive.overlayRef.removePanelClass).toHaveBeenCalledOnceWith([
        'two',
      ]);
    });
    it('calls setPanelClasses once', () => {
      directive.updateClasses();
      expect(directive.setPanelClasses).toHaveBeenCalledTimes(1);
    });
    it('calls addPanelClass once with the correct value', () => {
      directive.updateClasses();
      expect(directive.overlayRef.addPanelClass).toHaveBeenCalledOnceWith([
        'two',
      ]);
    });
  });

  describe('updateSize', () => {
    beforeEach(() => {
      directive.config = {
        size: 'size',
      } as any;
      directive.overlayRef = {
        updateSize: jasmine.createSpy('updateSize'),
      } as any;
    });
    it('calls updateSize on overlayRef with the correct value', () => {
      directive.updateSize();
      expect(directive.overlayRef.updateSize).toHaveBeenCalledOnceWith(
        'size' as any
      );
    });
  });

  describe('updateForNewBackdropProperties', () => {
    beforeEach(() => {
      spyOn(directive, 'destroyBackdropSubscription');
      spyOn(directive, 'destroyOverlay');
      spyOn(directive, 'createOverlay');
      spyOn(directive, 'hide');
    });
    it('calls destroyBackdropSubscription once', () => {
      directive.updateForNewBackdropProperties();
      expect(directive.destroyBackdropSubscription).toHaveBeenCalledTimes(1);
    });
    it('calls destroyOverlay once', () => {
      directive.updateForNewBackdropProperties();
      expect(directive.destroyOverlay).toHaveBeenCalledTimes(1);
    });
    it('calls createOverlay once', () => {
      directive.updateForNewBackdropProperties();
      expect(directive.createOverlay).toHaveBeenCalledTimes(1);
    });
    it('calls hide once', () => {
      directive.updateForNewBackdropProperties();
      expect(directive.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateVisibility', () => {
    beforeEach(() => {
      spyOn(directive, 'show');
      spyOn(directive, 'hide');
    });
    it('calls show once if overlayRef is defined and config.show is true', () => {
      directive.config = { show: true } as any;
      directive.overlayRef = 'something' as any;
      directive.updateVisibility();
      expect(directive.show).toHaveBeenCalledTimes(1);
    });
    it('calls hide once if overlayRed is defined and config.show is false', () => {
      directive.config = { show: false } as any;
      directive.overlayRef = 'something' as any;
      directive.updateVisibility();
      expect(directive.hide).toHaveBeenCalledTimes(1);
    });
    it('does not call show if overlayRef is undefined', () => {
      directive.updateVisibility();
      expect(directive.show).not.toHaveBeenCalled();
    });
    it('does not call hide if overlayRef is undefined', () => {
      directive.updateVisibility();
      expect(directive.hide).not.toHaveBeenCalled();
    });
  });

  describe('show', () => {
    let hasAttachedSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(directive, 'getTemplatePortal').and.returnValue('tp' as any);
      hasAttachedSpy = jasmine.createSpy('hasAttached');
      spyOn(directive, 'updatePosition');
      directive.overlayRef = {
        attach: jasmine.createSpy('attach'),
        hasAttached: hasAttachedSpy,
      } as any;
    });
    it('calls updatePosition once', () => {
      directive.show();
      expect(directive.updatePosition).toHaveBeenCalledTimes(1);
    });
    it('calls attach on overlayRef with the correct value if hasAttached returns false', () => {
      hasAttachedSpy.and.returnValue(false);
      directive.show();
      expect(directive.overlayRef.attach).toHaveBeenCalledOnceWith('tp');
    });
    it('does not call attach if hasAttached returns true', () => {
      hasAttachedSpy.and.returnValue(true);
      directive.show();
      expect(directive.overlayRef.attach).not.toHaveBeenCalled();
    });
  });

  describe('hide', () => {
    let hasAttachedSpy: jasmine.Spy;
    beforeEach(() => {
      hasAttachedSpy = jasmine.createSpy('hasAttached');
      directive.overlayRef = {
        detach: jasmine.createSpy('detach'),
        hasAttached: hasAttachedSpy,
      } as any;
    });
    it('calls detach on overlayRef with the correct value if hasAttached returns true', () => {
      hasAttachedSpy.and.returnValue(true);
      directive.hide();
      expect(directive.overlayRef.detach).toHaveBeenCalledOnceWith();
    });
    it('does not call detach if hasAttached returns false', () => {
      hasAttachedSpy.and.returnValue(false);
      directive.hide();
      expect(directive.overlayRef.detach).not.toHaveBeenCalled();
    });
  });

  describe('createOverlay', () => {
    beforeEach(() => {
      spyOn(directive, 'setPanelClasses');
      spyOn(directive, 'setPositionStrategy');
      spyOn(directive, 'listenForBackdropClicks');
      spyOn(directive, 'updateVisibility');
      directive.panelClass = ['one', 'two'];
      directive.positionStrategy = 'positionStrategy' as any;
      mainServiceStub.overlayStub.create.and.returnValue('test ref' as any);
      directive.config = {
        hasBackdrop: true,
        size: { width: 100 },
      } as any;
    });
    it('calls setPanelClasses once', fakeAsync(() => {
      directive.createOverlay();
      tick();
      expect(directive.setPanelClasses).toHaveBeenCalledTimes(1);
    }));
    it('calls setPositionStrategy once', fakeAsync(() => {
      directive.createOverlay();
      tick();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    }));
    it('calls overlay.create once with the correct values', fakeAsync(() => {
      directive.createOverlay();
      tick();
      expect(mainServiceStub.overlayStub.create).toHaveBeenCalledOnceWith({
        width: 100,
        panelClass: ['one', 'two'],
        scrollStrategy: 'close',
        positionStrategy: 'positionStrategy',
        hasBackdrop: true,
        backdropClass: 'vic-html-tooltip-backdrop',
      });
    }));
    it('sets overlayRef to the correct value', fakeAsync(() => {
      directive.createOverlay();
      tick();
      expect(directive.overlayRef).toEqual('test ref' as any);
    }));
    it('calls listenForBackdropClicks once if config hasBackdrop and closeOnBackdropClick are true', fakeAsync(() => {
      directive.config.closeOnBackdropClick = true;
      directive.createOverlay();
      tick();
      expect(directive.listenForBackdropClicks).toHaveBeenCalledTimes(1);
    }));
    it('does not call listenForBackdropClicks if config hasBackdrop is false', fakeAsync(() => {
      directive.config.hasBackdrop = false;
      directive.createOverlay();
      tick();
      expect(directive.listenForBackdropClicks).not.toHaveBeenCalled();
    }));
    it('does not call listenForBackdropClicks if config closeOnBackdropClick is false', fakeAsync(() => {
      directive.config.closeOnBackdropClick = false;
      directive.createOverlay();
      tick();
      expect(directive.listenForBackdropClicks).not.toHaveBeenCalled();
    }));
    it('calls updateVisibility', fakeAsync(() => {
      directive.createOverlay();
      tick();
      expect(directive.updateVisibility).toHaveBeenCalledTimes(1);
    }));
  });

  describe('listenForBackdropClicks', () => {
    beforeEach(() => {
      spyOn(directive.backdropClick, 'emit');
      directive.overlayRef = {
        backdropClick: () => of('click'),
      } as any;
    });
    it('calls backdropClick.emit once if subscription emits', () => {
      directive.listenForBackdropClicks();
      expect(directive.backdropClick.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPanelClasses', () => {
    describe('if addEventsDisabledClass is false', () => {
      beforeEach(() => {
        directive.config = new VicHtmlTooltipConfig();
        directive.config.addEventsDisabledClass = false;
      });
      it('sets panel class to the correct value - case user provides single string', () => {
        directive.config.panelClass = 'one';
        directive.setPanelClasses();
        expect(directive.panelClass).toEqual([
          'vic-html-tooltip-overlay',
          'one',
        ]);
      });
      it('sets panel class to the correct value - case user provides string array', () => {
        directive.config.panelClass = ['one', 'two'];
        directive.setPanelClasses();
        expect(directive.panelClass).toEqual([
          'vic-html-tooltip-overlay',
          'one',
          'two',
        ]);
      });
      it('sets panel class to the correct value - case user does not provide class', () => {
        directive.setPanelClasses();
        expect(directive.panelClass).toEqual(['vic-html-tooltip-overlay']);
      });
    });
    describe('if addEventsDisabledClass is true', () => {
      beforeEach(() => {
        directive.config = new VicHtmlTooltipConfig();
        directive.config.addEventsDisabledClass = true;
      });
      it('sets panel class to the correct value - case user provides single string', () => {
        directive.config.panelClass = 'one';
        directive.setPanelClasses();
        expect(directive.panelClass).toEqual([
          'vic-html-tooltip-overlay',
          'one',
          'events-disabled',
        ]);
      });
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(directive, 'destroyOverlay');
      spyOn(directive, 'destroyBackdropSubscription');
      destroySpy.and.callThrough();
    });
    it('calls destroyOverlay', () => {
      directive.ngOnDestroy();
      expect(directive.destroyOverlay).toHaveBeenCalledTimes(1);
    });
    it('calls destroyBackdropSubscription', () => {
      directive.ngOnDestroy();
      expect(directive.destroyBackdropSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroyBackdropSubscription', () => {
    beforeEach(() => {
      spyOn(directive.backdropUnsubscribe, 'next');
      spyOn(directive.backdropUnsubscribe, 'complete');
    });
    it('calls next once', () => {
      directive.destroyBackdropSubscription();
      expect(directive.backdropUnsubscribe.next).toHaveBeenCalledTimes(1);
    });
    it('calls complete once', () => {
      directive.destroyBackdropSubscription();
      expect(directive.backdropUnsubscribe.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroyOverlay', () => {
    beforeEach(() => {
      directive.overlayRef = {
        dispose: jasmine.createSpy('dispose'),
      } as any;
    });
    it('calls dispose on overlayRef', () => {
      directive.destroyOverlay();
      expect(directive.overlayRef.dispose).toHaveBeenCalledTimes(1);
    });
  });
});

import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
    let configChangedSpy: jasmine.Spy;
    beforeEach(() => {
      configChangedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'checkBackdropChanges');
      spyOn(directive, 'checkShowChanges');
      spyOn(directive, 'checkPositionChanges');
      spyOn(directive, 'checkSizeChanges');
      spyOn(directive, 'checkPanelClassChanges');
      directive.config = new HtmlTooltipConfig();
      changes = {};
    });
    describe('if overlayRef is truthy', () => {
      beforeEach(() => {
        directive.overlayRef = 'overlay' as any;
      });
      it('calls checkBackdropChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkBackdropChanges).toHaveBeenCalledOnceWith(
          changes
        );
      });
      it('calls checkShowChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkShowChanges).toHaveBeenCalledOnceWith(changes);
      });
      it('calls checkPositionChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkPositionChanges).toHaveBeenCalledOnceWith(
          changes
        );
      });
      it('calls checkSizeChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkSizeChanges).toHaveBeenCalledOnceWith(changes);
      });
      it('calls checkPanelClassChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkPanelClassChanges).toHaveBeenCalledOnceWith(
          changes
        );
      });
    });
    describe('if overlayRef is falsy', () => {
      it('does not call checkBackdropChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkBackdropChanges).not.toHaveBeenCalled();
      });
      it('does not call checkShowChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkShowChanges).not.toHaveBeenCalled();
      });
      it('does not call checkPositionChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkPositionChanges).not.toHaveBeenCalled();
      });
      it('does not call checkSizeChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkSizeChanges).not.toHaveBeenCalled();
      });
      it('does not call checkPanelClassChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.checkPanelClassChanges).not.toHaveBeenCalled();
      });
    });
  });

  describe('configChanged', () => {
    it('calls objectOnNgChangesChanged once with the correct value', () => {
      directive.configChanged('changes' as any, 'myProp');
      expect(
        mainServiceStub.utilitiesServiceStub.objectOnNgChangesChanged
      ).toHaveBeenCalledOnceWith('changes' as any, 'config', 'myProp');
    });
    it('returns the correct value', () => {
      mainServiceStub.utilitiesServiceStub.objectOnNgChangesChanged.and.returnValue(
        true
      );
      expect(directive.configChanged('changes' as any, 'myProp')).toEqual(true);
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

  describe('checkShowChanges', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      changedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'updateVisibility');
    });
    it('calls updateVisibility once if show changed', () => {
      changedSpy.and.returnValue(true);
      directive.checkShowChanges('changes' as any);
      expect(directive.updateVisibility).toHaveBeenCalledTimes(1);
    });
    it('does not call updateVisibility if show did not change', () => {
      changedSpy.and.returnValue(false);
      directive.checkShowChanges('changes' as any);
      expect(directive.updateVisibility).not.toHaveBeenCalled();
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

  describe('checkPanelClassChanges', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      changedSpy = spyOn(directive, 'configChanged');
      spyOn(directive, 'updateClasses');
    });
    it('calls updatePanelClasses once if panelClass changed', () => {
      changedSpy.and.returnValue(true);
      directive.checkPanelClassChanges('changes' as any);
      expect(directive.updateClasses).toHaveBeenCalledTimes(1);
    });
    it('does not call updatePanelClasses if panelClass did not change', () => {
      changedSpy.and.returnValue(false);
      directive.checkPanelClassChanges('changes' as any);
      expect(directive.updateClasses).not.toHaveBeenCalled();
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

  describe('setOverlayParameters', () => {
    beforeEach(() => {
      spyOn(directive, 'setPositionStrategy');
      spyOn(directive, 'setPanelClasses');
    });
    it('calls setPositionStrategy', () => {
      directive.setOverlayParameters();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    });
    it('calls setPanelClasses', () => {
      directive.setOverlayParameters();
      expect(directive.setPanelClasses).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPanelClasses', () => {
    describe('if events are not disabled', () => {
      beforeEach(() => {
        directive.config = new HtmlTooltipConfig();
        directive.config.disableEventsOnTooltip = false;
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
    describe('if events are disabled', () => {
      beforeEach(() => {
        directive.config = new HtmlTooltipConfig();
        directive.config.disableEventsOnTooltip = true;
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

  describe('createOverlay', () => {
    beforeEach(() => {
      spyOn(directive, 'listenForBackdropClicks');
      directive.panelClass = ['one', 'two'];
      directive.positionStrategy = 'positionStrategy' as any;
      mainServiceStub.overlayStub.create.and.returnValue('test ref' as any);
      directive.size = {
        width: 100,
      };
      directive.config = {
        hasBackdrop: true,
      } as any;
    });
    it('calls overlay.create once with the correct values', () => {
      directive.createOverlay();
      expect(mainServiceStub.overlayStub.create).toHaveBeenCalledOnceWith({
        width: 100,
        panelClass: ['one', 'two'],
        scrollStrategy: 'close',
        positionStrategy: 'positionStrategy',
        hasBackdrop: true,
        backdropClass: 'vic-html-tooltip-backdrop',
      });
    });
    it('sets overlayRef to the correct value', () => {
      directive.createOverlay();
      expect(directive.overlayRef).toEqual('test ref' as any);
    });
    it('calls listenForBackdropClicks once if config hasBackdrop and closeOnBackdropClick are true', () => {
      directive.config.closeOnBackdropClick = true;
      directive.createOverlay();
      expect(directive.listenForBackdropClicks).toHaveBeenCalledTimes(1);
    });
    it('does not call listenForBackdropClicks if config hasBackdrop is false', () => {
      directive.config.hasBackdrop = false;
      directive.createOverlay();
      expect(directive.listenForBackdropClicks).not.toHaveBeenCalled();
    });
    it('does not call listenForBackdropClicks if config closeOnBackdropClick is false', () => {
      directive.config.closeOnBackdropClick = false;
      directive.createOverlay();
      expect(directive.listenForBackdropClicks).not.toHaveBeenCalled();
    });
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

  describe('updateVisibility', () => {
    beforeEach(() => {
      spyOn(directive, 'show');
      spyOn(directive, 'hide');
    });
    it('calls show once if config.show is true and portalAttached is false', () => {
      directive.config = { show: true } as any;
      directive.portalAttached = false;
      directive.updateVisibility();
      expect(directive.show).toHaveBeenCalledTimes(1);
    });
    it('does not call show if config.show is true and portalAttached is true', () => {
      directive.config = { show: true } as any;
      directive.portalAttached = true;
      directive.updateVisibility();
      expect(directive.show).not.toHaveBeenCalled();
    });
    it('calls hide once if config.show is false', () => {
      directive.config = { show: false } as any;
      directive.updateVisibility();
      expect(directive.hide).toHaveBeenCalledTimes(1);
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

  describe('updateForNewBackdropProperties', () => {
    beforeEach(() => {
      spyOn(directive, 'destroyBackdropSubscription');
      spyOn(directive, 'destroyOverlay');
      spyOn(directive, 'createOverlay');
      spyOn(directive, 'updateVisibility');
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
    it('calls updateVisibility once', () => {
      directive.updateForNewBackdropProperties();
      expect(directive.updateVisibility).toHaveBeenCalledTimes(1);
    });
  });

  describe('show', () => {
    beforeEach(() => {
      spyOn(directive, 'getTemplatePortal').and.returnValue('tp' as any);
      directive.overlayRef = {
        attach: jasmine.createSpy('attach'),
      } as any;
    });
    it('calls attach on overlayRef with the correct value', () => {
      directive.show();
      expect(directive.overlayRef.attach).toHaveBeenCalledOnceWith('tp');
    });
    it('sets portalAttached to true', () => {
      directive.show();
      expect(directive.portalAttached).toBeTrue();
    });
  });

  describe('hide', () => {
    beforeEach(() => {
      directive.overlayRef = {
        detach: jasmine.createSpy('detach'),
      } as any;
      directive.portalAttached = true;
    });
    it('calls detach on overlayRef', () => {
      directive.hide();
      expect(directive.overlayRef.detach).toHaveBeenCalledTimes(1);
    });
    it('sets portalAttached to false', () => {
      directive.hide();
      expect(directive.portalAttached).toBeFalse();
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

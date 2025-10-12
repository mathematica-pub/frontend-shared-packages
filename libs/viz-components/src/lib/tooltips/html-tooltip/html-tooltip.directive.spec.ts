/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgOnChangesUtilities } from '@hsi/app-dev-kit';
import { Subject } from 'rxjs';
import { ChartComponent } from '../../charts';
import { EventType } from '../../events';
import { ChartComponentStub } from '../../testing/stubs/chart.component.stub';
import { MainServiceStub } from '../../testing/stubs/services/main.service.stub';
import { VicHtmlTooltipConfigBuilder } from './config/html-tooltip-builder';
import { HtmlTooltipCdkManagedPosition } from './config/position/tooltip-position';
import { TooltipPositionBuilder } from './config/position/tooltip-position-builder';
import { HtmlTooltipDirective } from './html-tooltip.directive';

const fakeOuput = {
  anchor: { x: 2, y: 4 },
  origin: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
  customPosition: () =>
    new HtmlTooltipCdkManagedPosition([
      new TooltipPositionBuilder()
        .fromTopLeft()
        .attachBottomCenter()
        .getPosition(),
    ]),
  defaultPosition: new HtmlTooltipCdkManagedPosition([
    new TooltipPositionBuilder()
      .fromTopLeft()
      .attachBottomCenter()
      .getPosition(),
  ]),
  fromAnchor: () =>
    new HtmlTooltipCdkManagedPosition([
      new TooltipPositionBuilder()
        .fromTopLeft()
        .attachBottomCenter()
        .getPosition(),
    ]),
  type: EventType.HoverMove,
};

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
          provide: ChartComponent,
          useClass: ChartComponentStub,
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

  describe('init()', () => {
    beforeEach(() => {
      spyOn(directive, 'createOverlayRef');
    });
    it('calls createOverlay once if overlayRef is falsy', () => {
      directive.init();
      expect(directive.createOverlayRef).toHaveBeenCalledTimes(1);
    });
    it('does not call createOverlay if overlayRef is truthy', () => {
      directive.overlayRef = 'hello' as any;
      directive.init();
      expect(directive.createOverlayRef).not.toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    let changes: any;
    beforeEach(() => {
      spyOn(directive, 'updateForConfigChanges');
      spyOn(directive, 'init');
      directive.config = 'config' as any;
      changes = {};
    });
    describe('if overlayRef and config are truthy', () => {
      beforeEach(() => {
        directive.overlayRef = 'overlay' as any;
        directive.config = 'hello' as any;
      });
      it('calls updateForConfigChanges once with the correct value', () => {
        directive.ngOnChanges(changes);
        expect(directive.updateForConfigChanges).toHaveBeenCalledOnceWith(
          changes
        );
      });
    });
    describe('if overlayRef is falsy and config is truthy', () => {
      beforeEach(() => {
        directive.config = 'hello' as any;
      });
      it('does not call updateForConfigChanges', () => {
        directive.ngOnChanges(changes);
        expect(directive.updateForConfigChanges).not.toHaveBeenCalled();
      });
      it('calls init', () => {
        directive.ngOnChanges(changes);
        expect(directive.init).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('createOverlayRef', () => {
    beforeEach(() => {
      spyOn(directive, 'setPositionStrategy');
      spyOn(directive, 'subscribeToBackdropClick');
      spyOn(directive, 'updateVisibility');
      mainServiceStub.overlayStub.create.and.returnValue('test ref' as any);
      directive.config = new VicHtmlTooltipConfigBuilder()
        .hasBackdrop(true)
        .positionFromOutput(fakeOuput)
        .applyEventsDisabledClass(true)
        .size((size) => size.width(100))
        .getConfig();
    });

    it('calls overlay.create once with the correct values', fakeAsync(() => {
      directive.createOverlayRef();
      tick();
      expect(mainServiceStub.overlayStub.create).toHaveBeenCalledTimes(1);
    }));
    it('calls getPositionStrategy once', fakeAsync(() => {
      directive.createOverlayRef();
      tick();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    }));
    it('sets overlayRef to the correct value', fakeAsync(() => {
      directive.createOverlayRef();
      tick();
      expect(directive.overlayRef).toEqual('test ref' as any);
    }));
    it('calls listenForBackdropClicks once if config hasBackdrop is true', fakeAsync(() => {
      directive.config.hasBackdrop = true;
      directive.createOverlayRef();
      tick();
      expect(directive.subscribeToBackdropClick).toHaveBeenCalledTimes(1);
    }));
    it('does not call listenForBackdropClicks if config hasBackdrop is false', fakeAsync(() => {
      directive.config.hasBackdrop = false;
      directive.createOverlayRef();
      tick();
      expect(directive.subscribeToBackdropClick).not.toHaveBeenCalled();
    }));
    it('calls updateVisibility', fakeAsync(() => {
      directive.createOverlayRef();
      tick();
      expect(directive.updateVisibility).toHaveBeenCalledTimes(1);
    }));
  });

  describe('getPositionStrategy', () => {
    beforeEach(() => {
      (directive as any).overlayPositionBuilder = 'builder' as any;
      directive.config = new VicHtmlTooltipConfigBuilder()
        .hasBackdrop(true)
        .positionFromOutput(fakeOuput)
        .applyEventsDisabledClass(true)
        .size((size) => size.width(100))
        .getConfig();
      spyOn(directive.config.position, 'getPositionStrategy').and.returnValue(
        'position' as any
      );
    });
    it('calls getPositionStrategy once with the correct value', () => {
      directive.setPositionStrategy();
      expect(
        directive.config.position.getPositionStrategy
      ).toHaveBeenCalledOnceWith(fakeOuput.origin, 'builder' as any);
    });
  });

  describe('subscribeToBackdropClick', () => {
    const click = new Subject<string>();
    const click$ = click.asObservable();
    beforeEach(() => {
      const overlayRef = {
        backdropClick: () => click$,
      } as any;
      directive.overlayRef = overlayRef;
      directive.backdropUnsubscribe = new Subject<void>();
      spyOn(directive.backdropClick, 'emit');
    });
    it('calls backdropClick.emit once if subscription emits', () => {
      directive.subscribeToBackdropClick();
      click.next('click');
      expect(directive.backdropClick.emit).toHaveBeenCalledTimes(1);
      directive.backdropUnsubscribe.next();
      directive.backdropUnsubscribe.complete();
    });
  });

  describe('subscribeToKeyboardEvents', () => {
    let addEventListenerSpy: jasmine.Spy;
    beforeEach(() => {
      addEventListenerSpy = spyOn(
        (directive as any).document,
        'addEventListener'
      );
    });
    it('should add keydown event listener to document', () => {
      directive.subscribeToKeyboardEvents();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        directive.onKeydown,
        true
      );
    });
  });

  describe('unsubscribeFromKeyboardEvents', () => {
    let removeEventListenerSpy: jasmine.Spy;
    beforeEach(() => {
      removeEventListenerSpy = spyOn(
        (directive as any).document,
        'removeEventListener'
      );
    });
    it('should remove keydown event listener from document', () => {
      directive.unsubscribeFromKeyboardEvents();
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        directive.onKeydown,
        true
      );
    });
  });

  describe('onKeydown', () => {
    beforeEach(() => {
      spyOn(directive, 'hide');
    });
    it('should call hide when Escape key is pressed', () => {
      const event = { key: 'Escape' } as KeyboardEvent;
      directive.onKeydown(event);
      expect(directive.hide).toHaveBeenCalled();
    });
    it('should not call hide for other keys', () => {
      const event = { key: 'Enter' } as KeyboardEvent;
      directive.onKeydown(event);
      expect(directive.hide).not.toHaveBeenCalled();
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
      spyOn(directive, 'updatePositionStrategy');
      directive.overlayRef = {
        attach: jasmine.createSpy('attach'),
        hasAttached: hasAttachedSpy,
      } as any;
    });
    it('calls updatePosition once', () => {
      directive.show();
      expect(directive.updatePositionStrategy).toHaveBeenCalledTimes(1);
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

  describe('updateForConfigChanges', () => {
    let changesSpy: jasmine.Spy;
    const changes = {
      config: {
        previousValue: {
          panelClass: ['old'],
        },
      },
    };
    beforeEach(() => {
      spyOn(directive, 'updatePositionStrategy');
      spyOn(directive, 'updateClasses');
      spyOn(directive, 'updateSize');
      spyOn(directive, 'updateBackdrop');
      spyOn(directive, 'updateVisibility');
      changesSpy = spyOn(directive, 'configChanged');
    });
    it('calls updatePosition once if position changed', () => {
      changesSpy.and.returnValues(true, true, true, true);
      directive.updateForConfigChanges(changes as any);
      expect(directive.updatePositionStrategy).toHaveBeenCalledTimes(1);
    });
    it('calls updateClasses once if panelClass changed', () => {
      changesSpy.and.returnValues(false, true, true, true);
      directive.updateForConfigChanges(changes as any);
      expect(directive.updateClasses).toHaveBeenCalledOnceWith(['old']);
    });
    it('calls updateSize once if size changed', () => {
      changesSpy.and.returnValues(false, false, true, true);
      directive.updateForConfigChanges(changes as any);
      expect(directive.updateSize).toHaveBeenCalledTimes(1);
    });
    it('calls updateBackdrop once if hasBackdrop changed', () => {
      changesSpy.and.returnValues(false, false, false, true);
      directive.updateForConfigChanges(changes as any);
      expect(directive.updateBackdrop).toHaveBeenCalledTimes(1);
    });
    it('calls updateVisibility once', () => {
      changesSpy.and.returnValues(false, false, false, false);
      directive.updateForConfigChanges('changes' as any);
      expect(directive.updateVisibility).toHaveBeenCalledTimes(1);
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

  describe('updatePosition', () => {
    beforeEach(() => {
      spyOn(directive, 'setPositionStrategy').and.returnValue(
        'test strategy' as any
      );
      directive.overlayRef = {
        updatePositionStrategy: jasmine.createSpy('updatePositionStrategy'),
      } as any;
    });
    it('calls getPositionStrategy once', () => {
      directive.updatePositionStrategy();
      expect(directive.setPositionStrategy).toHaveBeenCalledTimes(1);
    });
    it('calls updatePositionStrategy once with the correct value', () => {
      directive.updatePositionStrategy();
      expect(directive.overlayRef.updatePositionStrategy).toHaveBeenCalledWith(
        'test strategy' as any
      );
    });
  });

  describe('updateClasses', () => {
    beforeEach(() => {
      directive.overlayRef = {
        addPanelClass: jasmine.createSpy('addPanelClass'),
        removePanelClass: jasmine.createSpy('removePanelClass'),
      } as any;
      directive.config = {
        panelClass: ['two'],
      } as any;
    });
    it('calls removePanelClass once with the correct value', () => {
      directive.updateClasses(['old']);
      expect(directive.overlayRef.removePanelClass).toHaveBeenCalledOnceWith([
        'old',
      ]);
    });
    it('calls addPanelClass once with the correct value', () => {
      directive.updateClasses(['old']);
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

  describe('updateBackdrop', () => {
    beforeEach(() => {
      spyOn(directive, 'destroyBackdropSubscription');
      spyOn(directive, 'destroyOverlay');
      spyOn(directive, 'createOverlayRef');
      spyOn(directive, 'hide');
    });
    it('calls destroyBackdropSubscription once', () => {
      directive.updateBackdrop();
      expect(directive.destroyBackdropSubscription).toHaveBeenCalledTimes(1);
    });
    it('calls destroyOverlay once', () => {
      directive.updateBackdrop();
      expect(directive.destroyOverlay).toHaveBeenCalledTimes(1);
    });
    it('calls createOverlay once', () => {
      directive.updateBackdrop();
      expect(directive.createOverlayRef).toHaveBeenCalledTimes(1);
    });
    it('calls hide once', () => {
      directive.updateBackdrop();
      expect(directive.hide).toHaveBeenCalledTimes(1);
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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../core/services/utilities.service';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';

import { StackedAreaComponent } from './stacked-area.component';
import { StackedAreaConfig } from './stacked-area.model';

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent;
  let fixture: ComponentFixture<StackedAreaComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      declarations: [StackedAreaComponent],
      providers: [
        XyChartComponent,
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { tooltip: { show: false, type: 'html' } },
    } as any;
    component.config = new StackedAreaConfig();
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    beforeEach(() => {
      spyOn(component, 'setMethodsFromConfigAndDraw');
      configChange = {
        config: new SimpleChange('', '', false),
      };
    });

    it('should call objectChangedNotFirstTime once and with the correct parameters', () => {
      component.ngOnChanges(configChange);
      expect(
        mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        true
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
    it('should call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns false', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        false
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component, 'subscribeToRanges');
      spyOn(component, 'subscribeToScales');
      spyOn(component, 'setMethodsFromConfigAndDraw');
    });
    it('calls subscribeToRanges once', () => {
      component.ngOnInit();
      expect(component.subscribeToRanges).toHaveBeenCalledTimes(1);
    });

    it('calls subscribeToScales once', () => {
      component.ngOnInit();
      expect(component.subscribeToScales).toHaveBeenCalledTimes(1);
    });

    it('calls setMethodsFromConfigAndDraw once', () => {
      component.ngOnInit();
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setChartTooltipProperty');
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initXAndCategoryDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setSeries');
      spyOn(component, 'initYDomain');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setArea');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });
    it('calls setChartTooltipProperty once', () => {
      expect(component.setChartTooltipProperty).toHaveBeenCalledTimes(1);
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initDomains once', () => {
      expect(component.initXAndCategoryDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls setSeries once', () => {
      expect(component.setSeries).toHaveBeenCalledTimes(1);
    });

    it('calls initYDomain once', () => {
      expect(component.initYDomain).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
    });

    it('calls setArea once', () => {
      expect(component.setArea).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'setArea');
      spyOn(component, 'drawMarks');
      component.values = {
        x: 'x',
        y: 'y',
      } as any;
      component.resizeMarks();
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls setArea once', () => {
      expect(component.setArea).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with zero as the argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(0);
    });
  });

  describe('setChartTooltipProperty()', () => {
    it('sets chart.htmlTooltip.exists to the correct value if tooltip.show is false', () => {
      component.config.tooltip.show = false;
      component.setChartTooltipProperty();
      expect(component.chart.htmlTooltip.exists).toEqual(false);
    });

    it('sets chart.htmlTooltip.exists to the correct value if tooltip.show is true and type is not svg', () => {
      component.config.tooltip.show = true;
      component.config.tooltip.type = 'svg';
      component.setChartTooltipProperty();
      expect(component.chart.htmlTooltip.exists).toEqual(false);
    });

    it('sets chart.htmlTooltip.exists to the correct value if tooltip.show is true and type is svg', () => {
      component.config.tooltip.show = true;
      component.config.tooltip.type = 'html';
      component.setChartTooltipProperty();
      expect(component.chart.htmlTooltip.exists).toEqual(true);
    });
  });
});

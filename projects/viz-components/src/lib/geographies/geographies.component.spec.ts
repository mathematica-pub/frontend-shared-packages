import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../core/services/utilities.service';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { GeographiesComponent } from './geographies.component';
import { GeographiesConfig } from './geographies.model';

describe('GeographiesComponent', () => {
  let component: GeographiesComponent;
  let fixture: ComponentFixture<GeographiesComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [GeographiesComponent],
      providers: [
        MapChartComponent,
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographiesComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { tooltip: { show: false, type: 'html' } },
    } as any;
    component.config = new GeographiesConfig();
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

    it('calls setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        true
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });

    it('does not  call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns false', () => {
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
      spyOn(component, 'setMethodsFromConfigAndDraw');
    });

    it('calls subscribeToRanges once', () => {
      component.ngOnInit();
      expect(component.subscribeToRanges).toHaveBeenCalledTimes(1);
    });

    it('calls setMethodsFromConfigAndDraw once', () => {
      component.ngOnInit();
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('initAttributeDataScaleAndUpdateChart', () => {
    beforeEach(() => {
      component.chart = {
        updateAttributeDataConfig: jasmine.createSpy(
          'updateAttributeDataConfig'
        ),
        updateAttributeDataScale: jasmine.createSpy('updateAttributeDataScale'),
      } as any;
      component.config = {
        dataGeography: {
          attributeDataConfig: {
            valueType: 'quantitative',
            binType: 'none',
          },
        },
      } as any;
      spyOn(component, 'setColorScaleWithColorInterpolator').and.returnValue(
        'interpolated scale' as any
      );
      spyOn(component, 'setColorScaleWithoutColorInterpolator').and.returnValue(
        'non-interpolated scale' as any
      );
    });

    describe('if valueType is quantitative and binType is none', () => {
      it('calls setColorScaleWithColorInterpolator once', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.setColorScaleWithColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if scale has color interpolation', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.chart.updateAttributeDataScale
        ).toHaveBeenCalledOnceWith('interpolated scale' as any);
      });
    });

    describe('if valueType is not quantitative', () => {
      beforeEach(() => {
        component.config.dataGeography.attributeDataConfig.valueType =
          'categorical';
      });
      it('calls setColorScaleWithoutColorInterpolator once', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.setColorScaleWithoutColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if valueType is not quantitative', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.chart.updateAttributeDataScale
        ).toHaveBeenCalledOnceWith('non-interpolated scale' as any);
      });
    });

    describe('if binType is not none', () => {
      beforeEach(() => {
        component.config.dataGeography.attributeDataConfig.binType =
          'auto' as any;
      });
      it('calls setColorScaleWithoutColorInterpolator once', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.setColorScaleWithoutColorInterpolator
        ).toHaveBeenCalledTimes(1);
      });

      it('calls updateAttributeDataScale once with the correct value if binType is not none', () => {
        component.initAttributeDataScaleAndUpdateChart();
        expect(
          component.chart.updateAttributeDataScale
        ).toHaveBeenCalledOnceWith('non-interpolated scale' as any);
      });
    });

    it('calls updateAttributeDataConfig on chart once with the correct value', () => {
      component.initAttributeDataScaleAndUpdateChart();
      expect(
        component.chart.updateAttributeDataConfig
      ).toHaveBeenCalledOnceWith({
        valueType: 'quantitative',
        binType: 'none',
      } as any);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setProjection');
      spyOn(component, 'setPath');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.resizeMarks();
    });
    it('calls setProjection once', () => {
      expect(component.setProjection).toHaveBeenCalledTimes(1);
    });

    it('calls setPath once', () => {
      expect(component.setPath).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once', () => {
      expect(component.drawMarks).toHaveBeenCalledTimes(1);
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setProjection');
      spyOn(component, 'setPath');
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initAttributeDataScaleDomain');
      spyOn(component, 'initAttributeDataScaleRange');
      spyOn(component, 'initAttributeDataScaleAndUpdateChart');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });
    it('calls setProjection once', () => {
      expect(component.setProjection).toHaveBeenCalledTimes(1);
    });

    it('calls setPath once', () => {
      expect(component.setPath).toHaveBeenCalledTimes(1);
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initDataScaleDomain once', () => {
      expect(component.initAttributeDataScaleDomain).toHaveBeenCalledTimes(1);
    });

    it('calls initDataScaleRange once', () => {
      expect(component.initAttributeDataScaleRange).toHaveBeenCalledTimes(1);
    });

    it('calls initDataScale once', () => {
      expect(
        component.initAttributeDataScaleAndUpdateChart
      ).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('drawMarks', () => {
    beforeEach(() => {
      spyOn(component, 'drawMap');
    });
    it('calls drawMap with the correct value', () => {
      component.drawMarks(200);
      expect(component.drawMap).toHaveBeenCalledWith(200);
    });
  });
});

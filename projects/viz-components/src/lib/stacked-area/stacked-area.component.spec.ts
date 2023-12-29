import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../core/services/utilities.service';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { StackedAreaComponent } from './stacked-area.component';
import { VicStackedAreaConfig } from './stacked-area.config';

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
    component.config = new VicStackedAreaConfig();
  });

  describe('setPropertiesFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initXAndCategoryDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setSeries');
      spyOn(component, 'initYDomain');
      spyOn(component, 'initCategoryScale');
      component.setPropertiesFromConfig();
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

    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
    });
  });
});

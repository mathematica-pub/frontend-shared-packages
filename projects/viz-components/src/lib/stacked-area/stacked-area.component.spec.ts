/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { VicStackedAreaConfig } from './config/stacked-area.config';
import { StackedAreaComponent } from './stacked-area.component';

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent<any, string>;
  let fixture: ComponentFixture<StackedAreaComponent<any, string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedAreaComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaComponent<any, string>);
    component = fixture.componentInstance;
    component.config = new VicStackedAreaConfig();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

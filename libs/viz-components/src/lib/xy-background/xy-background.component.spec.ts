import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { XyBackgroundComponent } from './xy-background.component';

describe('XyBackgroundComponent', () => {
  let component: XyBackgroundComponent;
  let fixture: ComponentFixture<XyBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XyBackgroundComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XyBackgroundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

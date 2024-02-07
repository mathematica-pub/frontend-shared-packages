/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { GroupedBarsComponent } from './grouped-bars.component';

describe('GroupedBarsComponent', () => {
  let component: GroupedBarsComponent;
  let fixture: ComponentFixture<GroupedBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupedBarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

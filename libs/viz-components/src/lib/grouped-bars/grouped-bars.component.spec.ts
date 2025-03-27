/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { GroupedBarsComponent } from './grouped-bars.component';

describe('GroupedBarsComponent', () => {
  let component: GroupedBarsComponent<any, string>;
  let fixture: ComponentFixture<GroupedBarsComponent<any, string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupedBarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarsComponent<any, string>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

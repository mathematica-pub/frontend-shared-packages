import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaComponent } from './stacked-area.component';

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent;
  let fixture: ComponentFixture<StackedAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedAreaComponent],
      imports: [HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedAreaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

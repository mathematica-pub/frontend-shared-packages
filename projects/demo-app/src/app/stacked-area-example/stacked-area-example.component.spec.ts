import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaExampleComponent } from './stacked-area-example.component';

describe('StackedAreaComponent', () => {
  let component: StackedAreaExampleComponent;
  let fixture: ComponentFixture<StackedAreaExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedAreaExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedAreaExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

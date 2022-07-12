import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarsDemoComponent } from './bars-demo.component';

describe('BarsDemoComponent', () => {
  let component: BarsDemoComponent;
  let fixture: ComponentFixture<BarsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarsDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

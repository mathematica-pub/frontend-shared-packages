import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesDemoComponent } from './lines-demo.component';

describe('LinesDemoComponent', () => {
  let component: LinesDemoComponent;
  let fixture: ComponentFixture<LinesDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinesDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

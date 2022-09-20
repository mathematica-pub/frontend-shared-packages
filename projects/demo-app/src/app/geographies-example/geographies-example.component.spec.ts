import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographiesExampleComponent } from './geographies-example.component';

describe('MapExampleComponent', () => {
  let component: GeographiesExampleComponent;
  let fixture: ComponentFixture<GeographiesExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeographiesExampleComponent],
      imports: [HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GeographiesExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

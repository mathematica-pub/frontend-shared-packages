import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationDisplayComponent } from './documentation-display.component';

describe('RenderFileComponent', () => {
  let component: DocumentationDisplayComponent;
  let fixture: ComponentFixture<DocumentationDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentationDisplayComponent],
      imports: [HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

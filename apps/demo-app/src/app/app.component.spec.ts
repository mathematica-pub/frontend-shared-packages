import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  AdkDocumentationConfigParser,
  AdkDocumentationContentService,
  AdkMarkdownParser,
} from '@hsi/app-dev-kit';
import { AppComponent } from './app.component';
import { ContentParser } from './core/services/content-parser.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientModule],
      providers: [
        AdkDocumentationContentService,
        AdkDocumentationConfigParser,
        { provide: AdkMarkdownParser, useClass: ContentParser },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

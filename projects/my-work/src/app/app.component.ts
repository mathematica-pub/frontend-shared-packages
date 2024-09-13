import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { ShikiHighlighter, ShikiTheme } from './core/services/shiki-highligher';
import { SidebarComponent } from './platform/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'HSI Static Charts';

  constructor(
    public routerState: RouterStateService,
    private highlighter: ShikiHighlighter
  ) {}

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighter.initialize([ShikiTheme.CatppuccinLatte]);
  }
}

import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterStateService } from './core/services/router-state/router-state.service';
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

  constructor(public routerState: RouterStateService) {}

  ngOnInit(): void {
    this.routerState.initialize();
  }
}

import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from './core/services/state/state.service';
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

  constructor(public routerState: StateService) {}

  ngOnInit(): void {
    this.routerState.initialize();
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'HSI Static Charts';

  constructor(private routerState: RouterStateService) {}

  ngOnInit(): void {
    this.routerState.initialize();
  }
}

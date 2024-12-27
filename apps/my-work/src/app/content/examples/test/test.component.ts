import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  title = 'Test Component';

  constructor() {}

  ngOnInit(): void {
    console.log('TestComponent initialized');
  }
}

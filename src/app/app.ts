import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NativeAppService } from './core/services/native-app.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor() {
    inject(NativeAppService).init();
  }
}

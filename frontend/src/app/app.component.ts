import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="discord-layout">
      <app-navbar></app-navbar>
      <main class="discord-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .discord-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .discord-content {
      flex: 1;
      display: flex;
      width: 100%;
      min-height: 0;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'Community Help Hub';
}

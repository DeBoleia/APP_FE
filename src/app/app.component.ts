import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'APP_FE';
}


bootstrapApplication(AppComponent, {
  providers: []
}).catch(err => console.error(err));  providers: [

  ]

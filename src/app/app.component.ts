import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthenticatorService } from './services/authenticator.service';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RgpdComponent } from './component/rgpd/rgpd.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showBackToTop = false;

  constructor(
    private auth: AuthenticatorService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Current user role:', this.auth.getUserRole());
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    const role = this.auth.getUserRole();
    return role === 'admin';
  }

  getUserId(): string | null {
    return this.auth.getUserId();
  }

  logout(): void {
    this.auth.logout();
  }

  manageApplications(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/application']);
    } else {
      this.auth.saveTargetUrl('/application');
      this.router.navigate(['/login']);
    }
  }

  manageTrips(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/trips']);
    } else {
      this.auth.saveTargetUrl('/trips');
      this.router.navigate(['/login']);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showBackToTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}


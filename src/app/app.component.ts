import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticatorService } from './services/authenticator.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading-service.service';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { ViewChild } from '@angular/core'; //fred
import { MatSidenav } from '@angular/material/sidenav'; //fred

import { Router } from '@angular/router';
// import { UtilizadoresService } from './services/utilizadores.service';
// import { Utilizadores } from './interfaces/utilizadores';
//import { StatusService } from './services/status.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent { 
  title = 'AGENCIA_UPSKILL';
  currentStatus: string = '';
  message: { title: string, text: string; type: string } | null = null;
  isLoading: boolean = true;
  userRole: string | null = null;
  userID: string | null = null;
  userStatus: string | null = null;
  @ViewChild('drawer') drawer!: MatSidenav;


  constructor(
    public authenticatorService: AuthenticatorService,
    public loadingService: LoadingService,
    //private statusService: StatusService,
    private router: Router
  ) { }

  ngOnInit() {
    // console.log("STATUS ORIGINAL:", this.currentStatus );
    // this.statusService.currentStatus$.subscribe(status => {
    //   if (status === 'active') {
    //     this.currentStatus = 'ativo';
    //   } else {
    //     this.currentStatus = 'inativo';
    //   }
    //   // console.log('Status no AnotherComponent:', this.currentStatus);
    // });
    // this.currentStatus = this.authService.getUserStatus() ?? 'defaultStatus';
  
    // this.loadingService.loading$.subscribe((loading) => {
    //   setTimeout(() => {
    //     this.isLoading = loading;
    //   }, 500); // Adiciona um delay de 500ms
    // });
    this.userID = this.authenticatorService.getUserID();
    console.log('User ID onInit:', this.userID); 

    this.userRole = this.authenticatorService. getUserRole()
    console.log('User ROLE onInit:', this.userRole); 

    this.userStatus = this.authenticatorService.getUserStatus();
    console.log('User Status onInit:', this.userStatus);
  }

  onProfileClick() {
    this.userRole = this.authenticatorService. getUserRole()
    console.log('User Email no clique:', this.userRole); 
    //this.router.navigate(['/user', this.userID]);

  }

  // para recolha automatica ao fim de 1000 (1s)
  closeDrawerAfterDelay(): void {
    setTimeout(() => {
      this.drawer.close();
    }, 500);
  }


  // logoutAndClose(): void {
  //   this.authService.logout();
  //   this.closeDrawerAfterDelay();
  // }

}
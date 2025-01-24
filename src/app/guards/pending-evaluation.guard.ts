import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticatorService } from '../services/authenticator.service';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PendingEvaluationDialogComponent } from '../component/pending-evaluation-dialog/pending-evaluation-dialog.component';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PendingEvaluationGuard implements CanActivate {
  constructor(
    private auth: AuthenticatorService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    const userId = this.auth.getUserID();

    if (!userId) {
      return of(this.router.createUrlTree(['/login']));
    }

    return this.userService.getUserByUserID(userId).pipe(
      map((user) => {
        if (
          user.pendingPassengerEvaluations.length > 0 || 
          user.pendingDriverEvaluations.length > 0
        ) {
          this.dialog.open(PendingEvaluationDialogComponent, {
            data: {
              pendingPassengerEvaluations: user.pendingPassengerEvaluations,
              pendingDriverEvaluations: user.pendingDriverEvaluations,
            },
            disableClose: true,
          });
    
          return false;
        }
        return true;
      }),
      catchError((err) => {
        console.error('Error fetching user:', err);
        return of(this.router.createUrlTree(['/home']));
      })
    );
  }    
}

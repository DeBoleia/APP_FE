import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { AuthenticatorService } from '../../services/authenticator.service';
@Component({
  selector: 'app-pending-evaluation-dialog',
  templateUrl: './pending-evaluation-dialog.component.html',
  styleUrls: ['./pending-evaluation-dialog.component.scss'],
})
export class PendingEvaluationDialogComponent {
  pendingPassengerEvaluations: any[];
  pendingDriverEvaluations: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { pendingPassengerEvaluations: any[]; pendingDriverEvaluations: any[] },
    private dialogRef: MatDialogRef<PendingEvaluationDialogComponent>,
    private userService: UserService,
    private auth: AuthenticatorService
  ) {
    this.pendingPassengerEvaluations = data.pendingPassengerEvaluations;
    this.pendingDriverEvaluations = data.pendingDriverEvaluations;
  }

  completePassengerEvaluation(evaluation: any): void {
    console.log('Completing passenger evaluation for:', evaluation);
    const userId = this.auth.getUserID();
    // const { userID, rating, evaluatorID } = req.body;
    if (userId) {
      this.userService.rateOnePassenger(evaluation).subscribe({
        next: () => {
          this.pendingPassengerEvaluations = this.pendingPassengerEvaluations.filter(
            (e) => e !== evaluation
          );

          this.closeDialogIfDone();
        },
        error: (err) => {
          console.error('Error completing passenger evaluation:', err);
        },
      });
    }
  }

  completeDriverEvaluation(evaluation: any): void {
    console.log('Completing driver evaluation for:', evaluation);
    const userId = this.auth.getUserID();
    // const { userID } = req.params;
    // const { rating } = req.body;
    // const { evaluatorID } = req.body;
    if (userId) {
      this.userService.rateDriver(userId, evaluation).subscribe({
        next: () => {
          this.pendingDriverEvaluations = this.pendingDriverEvaluations.filter(
            (e) => e !== evaluation
          );

          this.closeDialogIfDone();
        },
        error: (err) => {
          console.error('Error completing driver evaluation:', err);
        },
      });
    }
  }

  private closeDialogIfDone(): void {
    if (
      this.pendingPassengerEvaluations.length === 0 &&
      this.pendingDriverEvaluations.length === 0
    ) {
      this.dialogRef.close();
    }
  }
}

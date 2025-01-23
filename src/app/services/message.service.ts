import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';  // Importando o MatSnackBar
import { Subject, Observable } from 'rxjs';
import { MessageComponent } from '../component/message/message.component';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) { }

  showSnackbar(message: string = 'Done.', type: string = 'default', duration: number = 10000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: this.getSnackbarClass(type),
    });
  }

  private getSnackbarClass(type: string): string {
    switch (type) {
      case 'success':
        return 'snackbar-success';
      case 'error':
        return 'snackbar-error';
      case 'info':
        return 'snackbar-info';
      case 'warning':
        return 'snackbar-warning';
      default:
        return 'snackbar-default';
    }
  }

  showConfirmationDialog(
    title: string, 
    text: string, 
    requiredCode?: string
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px',
      data: {
        title: title,
        text: text,
        type: 'confirmation',
        isConfirmation: true,
        requiresCodeInput: !!requiredCode,
        requiredCode: requiredCode
      },
    });
  
    return dialogRef.afterClosed();
  }

  showRenameBrandDialog(currentBrandName: string): Observable<string | null> {
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px',
      data: {
        title: 'Renomear Marca',
        text: `Introduza o novo nome para a marca "${currentBrandName}"`,
        isConfirmation: true,
        requiresCodeInput: true,  // Ativa o campo de input existente
        requiredCode: '',         // Permite qualquer valor
        initialBrandName: currentBrandName
      }
    });
  
    return dialogRef.afterClosed();
  }

    // Novo método para adicionar um novo modelo
    showAddModelDialog(brand: string): Observable<string | null> {
      const dialogRef = this.dialog.open(MessageComponent, {
        width: '400px',
        data: {
          title: 'Adicionar Novo Modelo',
          text: `Introduza o nome do novo modelo para a marca "${brand}"`,
          isConfirmation: true,
          requiresCodeInput: true,  // Ativa o campo de input para o nome do modelo
          requiredCode: '',         // Não requer um código específico
          initialBrandName: brand
        }
      });
    
      return dialogRef.afterClosed();
    }



}

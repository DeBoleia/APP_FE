import { Component } from '@angular/core';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {

}


/*
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Morada, Utilizadores } from '../../interfaces/utilizadores';
import { UtilizadoresService } from '../../services/utilizadores.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { UtilizadoresDialogComponent } from '../../forms/utilizadores-edit/utilizadores-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReservasComponent } from "../../components/reservas/reservas.component";
import { MessageService } from '../../services/message.service';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-utilizadores-details',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReservasComponent,
    MatDivider
  ],
  templateUrl: './utilizadores-details.component.html',
  styleUrls: ['./utilizadores-details.component.scss'],
})
export class UtilizadoresDetailsComponent implements OnInit {
  utilizador: any;
  morada: Morada[] = [];
  errorMessage: { [key: string]: any } = {};

  utilizadorForm!: FormGroup;

  isEditing: boolean = false;
  isCreating: boolean = false;
  originalUtilizador: Utilizadores | null = null;
  email: string = '';
  setEnd: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private utilizadoresService: UtilizadoresService,
    private router: Router,
    public authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }



  loadUtilizadorData(): void {
    this.utilizadoresService.getUtilizadoresByEmail(this.email).subscribe({
      next: (data) => {
        this.utilizador = data;
        this.utilizadorForm.patchValue(data);
      },
      error: (error) => {
        console.error('Erro ao carregar dados do utilizador:', error);
      },
    });
  }
  ngOnInit(): void {
    const emailFromToken = this.authService.getUserEmail();

    if (emailFromToken) {
      this.email = emailFromToken;
      console.log('EMAIL DO TOKEN:', this.email);
    } else {
      console.error('Email não encontrado no token!');
      return;
    }

    this.utilizadorForm = this.fb.group({
      id: [''],
      nome: [''],
      email: [''],
      telefone: [''],
      NIF: [''],
      dataNascimento: [''],
      tipoUtilizador: [''],
      status: [''],
      morada: this.fb.group({
        rua: [''],
        localidade: [''],
        codigoPostal: [''],
        localidadePostal: [''],
        pais: [''],
      }),
    });

    this.utilizadorForm.get('email')?.setValue(this.email);

    this.loadAllData(this.email);
  }

  loadAllData(email: string): void {
    console.log('Chamando API para obter utilizadores com email:', this.email);

    if (this.email) {
      this.utilizadoresService.getUtilizadoresByEmail(this.email).subscribe({
        next: (data) => {
          console.log('Dados carregados:', data);
          this.utilizador = data;
          this.populateUtilizadorForm(this.utilizador);
        },
        error: (error) => {
          console.error('Erro ao carregar dados do utilizador:', error);
        },
      });
    } else {
      console.error('Email não definido para carregar dados!');
    }
  }

  populateUtilizadorForm(utilizador: any): void {
    console.log('Função populateUtilizadorForm chamada');
    if (utilizador) {
      this.utilizadorForm.patchValue({
        id: utilizador.id || '',
        nome: utilizador.nome || '',
        email: utilizador.email || '',
        telefone: utilizador.telefone || '',
        NIF: utilizador.NIF || '',
        dataNascimento: utilizador.dataNascimento || '',
        status: utilizador.status === 'ativo' ? 'ativo' : 'inativo',
        tipoUtilizador: utilizador.tipoUtilizador || '',
        morada: {
          rua: utilizador.morada?.rua || '',
          localidade: utilizador.morada?.localidade || '',
          codigoPostal: utilizador.morada?.codigoPostal || '',
          localidadePostal: utilizador.morada?.localidadePostal || '',
          pais: utilizador.morada?.pais || '',
        },
      });

      console.log(
        '### Status do utilizador:',
        utilizador.status === 'ativo' ? 'Ativo' : 'Inativo'
      );
    }
  }

  onSubmit(): void {
    if (this.utilizadorForm.valid) {
      const formData = this.utilizadorForm.value;
      formData.status = formData.status === 'ativo' ? 'active' : 'inactive';

      console.log('Dados do formulário antes de enviar:', formData);

      this.utilizadoresService
        .updateUtilizadoresByEmail(formData.email, formData)
        .subscribe({
          next: (response) => {
            console.log('Utilizador atualizado com sucesso!');
            Swal.fire(
              'Sucesso',
              'O utilizador foi atualizado com sucesso!',
              'success'
            );

            this.utilizadorForm.patchValue({
              status: formData.status,
            });

            this.utilizador.status =
              formData.status === 'active' ? 'ativo' : 'inativo';

            this.loadUtilizadorData();
          },
          error: (error) => {
            console.error('Erro ao atualizar utilizador:', error);
            Swal.fire(
              'Erro',
              'Houve um erro ao atualizar o utilizador.',
              'error'
            );
          },
        });
    } else {
      Swal.fire(
        'Erro',
        'Por favor, preencha todos os campos obrigatórios.',
        'error'
      );
    }
  }

  toggleEditMode(): void {
    this.isEditing = true;
    this.utilizadorForm.patchValue({ ...this.utilizador! });
  }

  editUtilizador(utilizador: Utilizadores): void {
    const dialogRef = this.dialog.open(UtilizadoresDialogComponent, {
      width: '1200px',
      data: { utilizador: this.utilizador },
      autoFocus: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedUtilizador: Utilizadores = {
          ...this.utilizador,
          nome: result.nome ?? this.utilizador.nome,
          email: result.email ?? this.utilizador.email,
          telefone: result.telefone ?? this.utilizador.telefone,
          NIF: result.NIF ? result.NIF.toString() : this.utilizador.NIF,
          dataNascimento:
            result.dataNascimento ?? this.utilizador.dataNascimento,
          status: result.status ?? this.utilizador.status,
          morada: {
            rua: result.rua ?? this.utilizador.morada?.rua ?? '',
            localidade:
              result.localidade ?? this.utilizador.morada?.localidade ?? '',
            codigoPostal:
              result.codigoPostal ?? this.utilizador.morada?.codigoPostal ?? '',
            localidadePostal:
              result.localidadePostal ??
              this.utilizador.morada?.localidadePostal ??
              '',
            pais: result.pais ?? this.utilizador.morada?.pais ?? '',
          },
        };

        this.utilizadoresService
          .updateUtilizadoresByEmail(this.utilizador.email, updatedUtilizador)
          .subscribe({
            next: () => {
              console.log('Utilizador atualizado com sucesso! CCC');
              this.router
                .navigate(['/utilizadores', updatedUtilizador.email])
                .then(() => {
                  this.loadUtilizadorData();
                });
            },
            error: (error) => {
              console.error('Erro ao atualizar utilizador:', error);
              this.messageService.showSnackbar(error.error.error, 'error');
            },
          });
      }
    });
  }

  getStatusLabel(status: string | null): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'active':
      case 'ativo':
        return 'ativo';
      case 'inactive':
      case 'inativo':
        return 'inativo';
      default:
        return status;
    }
  }

  desativarConta() {
    this.messageService.showConfirmationDialog(
      'Tem certeza que deseja desativar esta conta? (Insira o seu email para validar)',
      'Desativar conta',
      this.authService.getUserEmail() || '').subscribe(result => {
        if (result) {
          this.utilizadoresService.desativarConta(this.authService.getUserId()).subscribe(
            () => {
              this.messageService.showSnackbar('Conta desativada com sucesso!', 'success');
              this.authService.logout();
            },
            (error) => {
              console.error('Erro ao desativar Conta', error);
              this.messageService.showSnackbar('Erro ao criar Reserva: ' + error.error.message, 'error');
            });
        }
      });
    }
}

*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../services/authenticator.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

interface LoginResponse {
  userToken?: string;
  error?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatDivider
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isAccountInactive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authenticatorService: AuthenticatorService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Se a conta estiver inativa, exibe a mensagem e não faz login
      if (this.isAccountInactive) {
        this.messageService.showSnackbar('Conta desativada. Por favor, reative-a.', 'error');
        return;
      }

      this.authenticatorService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
          if (response.userToken) {
            this.messageService.showSnackbar('Login efetuado com sucesso!', 'success');
            this.authenticatorService.saveToken(response.userToken);
            this.router.navigateByUrl(this.authenticatorService.getTargetUrl());
          }
        },
        error: (err) => {
          if (err.error && typeof err.error === 'object' && err.error.error) {
            if (typeof err.error.error === 'string' && err.error.error.includes('desativada pelo usuário')) {
              this.isAccountInactive = true;
            }
          }
          this.messageService.showSnackbar("Erro: " + err.error.error, "error", 3000);
          this.errorMessage = "Login falhou. Por favor, tente novamente.";
        },
      });
    } else {
      console.log("Formulário inválido");
    }
  }

  ativarConta(): void {
    console.log("Tentando ativar conta...");
    const email = this.loginForm.get('email')?.value;
    console.log("Email:", email);

    if (!email) {
      this.messageService.showSnackbar('Por favor, insira o seu e-mail antes de ativar a conta.', 'error');
      return;
    }

    this.authenticatorService.changeStatusByEmail2(email).subscribe({
      next: (response) => {
        console.log('Resposta ao tentar ativar a conta:', response);
        this.messageService.showSnackbar('Conta ativada com sucesso!', 'success');
        this.isAccountInactive = false;

        this.loginForm.reset();
        this.onSubmit();
      },
      error: (error) => {
        console.log('Erro ao tentar ativar a conta:', error);
        if (error.status === 404) {
          console.log('Endpoint não encontrado. Verifique a URL.');
        } else {
          console.log('Erro inesperado:', error);
        }
        this.messageService.showSnackbar("Erro ao ativar a conta. Por favor, tente novamente.", "error");
      }
    });
  }
}

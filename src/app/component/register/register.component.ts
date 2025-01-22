import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticatorService } from '../../services/authenticator.service';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    RouterModule,
  ],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authenticatorService: AuthenticatorService,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rgpd: [false, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    console.log('Form Submitted');
    console.log('Form Values:', this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('Form Invalid');
      //this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const { name, email, phoneNumber, password } = this.registerForm.value;
    console.log('Name:', name); 
    console.log('Email:', email); 
    console.log('Phone:', phoneNumber); 
    console.log('Password:', password);
    

    this.authenticatorService.register(name, email,phoneNumber, password).subscribe({
      next: () => {
        this.successMessage = 'Usuário registado com sucesso!';
        console.log('User registered successfully');
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('Registration failed', error);
        this.errorMessage =
          error.error.error || 'Ocorreu um erro ao registar o usuário.';
        this.registerForm.reset();
      },
    });
  }

  ngOnInit(): void {
    console.log('Component Initialized');
    this.resetForm();
  }

  resetForm(): void {
    console.log('Resetting Form');
    this.registerForm.reset({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
    });
  }
}
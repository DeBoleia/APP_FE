import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces/user';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogContent } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../services/user.service';

//import { StatusService } from '../../services/status.service';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-utilizadores-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatFormField,
    MatDatepicker,
    MatDatepickerModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  isEditing: boolean = false;
  showWarning: boolean = false;
  initialStatus: string = '';
  pendingStatus: string | null = null;
  newStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    // private statusService: StatusService,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data.user;
    this.initForm();
  }

  initForm(): void {
    const status =
      this.data.user?.status &&
      (this.data.user.status.toLowerCase() === 'active')
        ? 'active'
        : 'inactive';

    console.log('INITFORM STATUS: ', status);

    this.userForm = this.fb.group({
      nome: [this.data.user?.name || '', Validators.required],
      email: [this.data.user?.email || '', Validators.required],
      telefone: [this.data.user?.phoneNumber || '', /* Validators.required */],
      NIF: [this.data.user?.NIF || '', /* Validators.required */],
      dataNascimento: [
        this.data.user?.birthDate || '',
        /* Validators.required */,
      ],
      role: [
        {
          value: this.data.user?.role || '',
          disabled: !this.isEditing,
        },
        /* Validators.required */,
      ],
      // rua: [this.data.user?.morada?.rua || '', /* Validators.required */],
      // localidade: [
      //   this.data.utilizador?.morada?.localidade || '',
      //   /* Validators.required */,
      // ],
      // codigoPostal: [
      //   this.data.utilizador?.morada?.codigoPostal || '',
      //   /* Validators.required */,
      // ],
      // localidadePostal: [
      //   this.data.utilizador?.morada?.localidadePostal || '',
      //   /* Validators.required */,
      // ],
      // pais: [this.data.utilizador?.morada?.pais || '', /* Validators.required */]

      // status: new FormControl(status),
    });

    this.initialStatus = status;
    this.newStatus = status; 
  }

  onStatusChange(value: string): void {
    this.showWarning = value === 'inactive';
  }


  onSubmit(): void {
    // if (this.utilizadorForm.valid) {
    //   const formData = this.utilizadorForm.value;
      // this.newStatus = formData.status === 'active' ? 'active' : 'inactive';

      // console.log('INITFORM STATUS 2: ', this.initialStatus);
      // console.log('onSUBMIT STATUS', this.newStatus);

      // this.statusService.updateStatus(this.newStatus);

      // if (this.newStatus !== this.initialStatus) {
      //   this.utilizadoresService.ativarUtilizador(formData.email, formData).subscribe(
      //     (response) => {
      //       console.log('Utilizador atualizado com sucesso!', response);
      //       this.dialogRef.close(formData);
      //     },
      //     (error) => {
      //       console.error('Erro ao atualizar o utilizador:', error);
      //       alert('Erro ao atualizar o utilizador.');
      //     }
      //   );
      // } else {
      //   console.log('Status não foi alterado, nenhuma ação necessária');
      //   this.dialogRef.close(formData);
      // }
      if (this.userForm.valid) {
        this.dialogRef.close(this.userForm.value);
      }
    // }
  }

  onCancel(): void {
    this.userForm.reset();
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { DatabaseCars } from '../../interfaces/car';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-cars-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatFormField,
    MatDatepickerModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
  templateUrl: './cars-edit.component.html',
  styleUrl: './cars-edit.component.scss'
})
export class CarsEditComponent {
  carsForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CarsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data.cars;
    this.initForm();
  }

  initForm(): void {
    this.carsForm = this.fb.group({
      brand: [this.data.cars?.brand || '', ],
      model: [this.data.cars?.model || '', ]  
     
    });
    console.log("form: ", this.carsForm);
  }

  onSubmit(): void {
    if (this.carsForm.valid) {
      this.dialogRef.close(this.carsForm.value);
    }
  }

  onCancel(): void {
    this.carsForm.reset();
    this.dialogRef.close();
  }
}


/*
export class VirusDialogComponent implements OnInit {
  virusForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VirusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data.virus;
    this.initForm();
  }

  initForm(): void {
    this.virusForm = this.fb.group({
      codigoVirus: [this.data.virus?.codigoVirus || '', [Validators.required, Validators.pattern(/^V\d{6}$/i)]],
      nomeVirus: [this.data.virus?.nomeVirus || '', Validators.required]  
     
    });
    console.log("form: ", this.virusForm);
  }

  onSubmit(): void {
    if (this.virusForm.valid) {
      this.dialogRef.close(this.virusForm.value);
    }
  }

  onCancel(): void {
    this.virusForm.reset();
    this.dialogRef.close();
  }
}
*/

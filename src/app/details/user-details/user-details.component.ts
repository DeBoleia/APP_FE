import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Cars, User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { AuthenticatorService } from '../../services/authenticator.service';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../../edit/edit-user/edit-user.component';
import Swal from 'sweetalert2';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MessageService } from '../../services/message.service';
import { MatDivider } from '@angular/material/divider';

import { MatSelectModule } from '@angular/material/select';
import { CarsService } from '../../services/cars.service';

@Component({
  selector: 'app-user-details',
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
	MatDivider,
	MatSelectModule,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  user: any;
  cars: Cars[] = [];
  errorMessage: { [key: string]: any } = {};
  userForm!: FormGroup;
  editingIndex: number | null = null;
  originalCarData: any[] = [];
  isEditing: boolean = false;
  isCreating: boolean = false;
  originalUser: User | null = null;
  userID: string = '';
  setEnd: boolean = false;

  constructor(
	private route: ActivatedRoute,
	private userService: UserService,
	private router: Router,
	public authenticatorService: AuthenticatorService,
	private dialog: MatDialog,
	private messageService: MessageService,
	private fb: FormBuilder,
	private carsService: CarsService
  ) {
	this.userForm = this.fb.group({
	  userID: [''],
	  name: [''],
	  email: [''],
	  role: [''],
	  phoneNumber: [''],
	  NIF: [''],
	  status: [''],
	  birthDate: [''],
	  driverRating: [''],
	  driverRatingCount: [''],
	  passengerRating: [''],
	  passengerRatingCount: [''],
	  driversLicense: [''],
	  cars: this.fb.array([]),
	});
  }

  loadUserData(): void {
	this.userService.getUserByUserID(this.userID).subscribe({
	  next: (data) => {
		this.user = data;
		this.userForm.patchValue(data);
	  },
	  error: (error) => {
		console.error('Error fecthing the user:', error);
	  },
	});
  }

	ngOnInit(): void {
		const userIDFromToken = this.authenticatorService.getUserID();
	  
		if (userIDFromToken) {
		  this.userID = userIDFromToken;
		  console.log('userID DO TOKEN @@ :', this.userID);
		  this.loadAllData(this.userID); 
		  this.isEditing = true;
		  this.loadCarBrands();
		} else {
		  console.error('userID not found in the token!');
		  return;
		}
	  }

  loadAllData(userID: string): void {
	console.log(
	  'Chamando API para obter utilizadores com userID:',
	  this.userID
	);

		if (this.userID) {
			this.userService.getUserByUserID(this.userID).subscribe({
				next: (data) => {
					console.log('Data has been loaded:', data);
					this.user = data;
					if (this.user) {
						this.populateUserForm(this.user);
						this.isEditing = true;
					}
				},
				error: (error) => {
					console.error('Error loading user data:', error);
				},
			});
		} else {
			console.error('Cannot load data: userID is not defined!');
		}
	}

  populateUserForm(user: User): void {
	console.log('Função populateUserForm chamada');
	console.log('Dados do utiliz:', user);
	if (user) {
	  this.userForm.patchValue({
		userID: user.userID || '',
		name: user.name || '',
		email: user.email || '',
		role: user.role || '',
		phoneNumber: user.phoneNumber || '',
		NIF: user.NIF || '',
		birthDate: user.birthDate || '',
		status: user.status === 'active' ? 'active' : 'inactive',
		driverRating: user.driverRating || '',
		driverRatingCount: user.driverRatingCount || '',
		passengerRating: user.passengerRating || '',
		passengerRatingCount: user.passengerRatingCount || '',
		driversLicense: user.driversLicense || '',
	  });

	  const carsArray = this.carsFormArray;
	  carsArray.clear();

	  if (Array.isArray(user.cars)) {
		user.cars.forEach((car: Cars) => {
		  carsArray.push(
			this.fb.group({
			  brand: [car.brand || ''],
			  model: [car.model || ''],
			  color: [car.color || ''],
			  licensePlate: [car.licensePlate || ''],
			})
		  );
		});
	  } else {
		console.warn('user.cars não é um array!');
	  }
	}
  }

  get carsFormArray(): FormArray {
	return this.userForm.get('cars') as FormArray;
  }

  isAllCarsValid(): boolean {
	let allCarsValid = true;
	this.carsFormArray.controls.forEach((carFormGroup) => {
	  if (!carFormGroup.valid) {
		allCarsValid = false;
	  }
	});
	return allCarsValid;
  }

  onSubmit(): void {
	if (this.userForm.valid && this.isAllCarsValid()) {
	  const formData = this.userForm.value;
	  formData.status = formData.status === 'ativo' ? 'active' : 'inactive';

	  console.log('Dados do formulário antes de enviar:', formData);

	  this.userService.updateUserByUserID(formData.userID, formData).subscribe({
		next: (response) => {
		  console.log('Utilizador atualizado com sucesso!');

		  this.userForm.patchValue({
			status: formData.status,
		  });

		  if (this.user) {
			this.user.status =
			  formData.status === 'active' ? 'active' : 'inactive';
		  }

		  this.carsFormArray.controls.forEach((carGroup, index) => {
			const carData = carGroup.value;
			if (
			  this.originalCarData[index] &&
			  JSON.stringify(this.originalCarData[index]) !==
				JSON.stringify(carData)
			) {
			  const carID = carData.licensePlate;
			  this.carsService.updateCar(this.userID, carData).subscribe({
				next: () => {
				  console.log(`Carro ${carID} atualizado com sucesso!`);
				},
				error: (error) => {
				  console.error(`Erro ao atualizar o carro ${carID}:`, error);
				},
			  });
			}
		  });

		  this.loadUserData();
		},
		error: (error) => {
		  console.error('Erro ao atualizar utilizador:', error);
		},
	  });
	} else {
	  console.log('ola');
	}
  }

  toggleEditMode(): void {
	this.isEditing = true;
	this.userForm.patchValue({ ...this.user! });
  }

  editUser(user: User): void {
	const dialogRef = this.dialog.open(UserDialogComponent, {
	  width: '1200px',
	  data: { user: this.user },
	  autoFocus: true,
	  disableClose: true,
	});

	dialogRef.afterClosed().subscribe((result) => {
	  console.log(':', result);
	  if (result) {
		const updatedUser: User = {
		  ...this.user,
		  name: result.name ?? this.user.name,
		  email: result.email ?? this.user.email,
		  telefone: result.phoneNumber ?? this.user.phoneNumber,
		  NIF: result.NIF ? result.NIF.toString() : this.user.NIF,
		  birthDate: result.birthDate ?? this.user.birthDate,
		  status: result.status ?? this.user.status,
		};
		console.log('Utilizador atualizado:', updatedUser);

		this.userService
		  .updateUserByUserID(this.user.userID, updatedUser)
		  .subscribe({
			next: () => {
			  console.log('Utilizador atualizado com sucesso! CCC');
			  this.router.navigate(['/user', updatedUser.userID]).then(() => {
				this.loadUserData();
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

  brandOptions: string[] = [];
  modelOptions: string[] = [];
  colorOptions = [
	'Red',
	'Blue',
	'Green',
	'Yellow',
	'Orange',
	'Purple',
	'Pink',
	'Brown',
	'Black',
	'White',
	'Gray',
	'Cyan',
	'Magenta',
	'Lime',
	'Indigo',
	'Violet',
	'Maroon',
	'Olive',
	'Teal',
	'Navy',
	'Gold',
	'Silver',
	'Beige',
	'Turquoise',
	'Lavender',
  ];

  loadCarBrands(): void {
	this.carsService.getCarBrands().subscribe(
	  (response) => {
		console.log('Marcas de carros recebidas:', response);
		this.brandOptions = response;
	  },
	  (error) => {
		console.error('Error fetching car brands:', error);
	  }
	);
  }

  loadCarModels(brand: string): void {
	console.log('Marca recebida para carregar modelos:', brand);

	this.carsService.getCarModels(brand).subscribe(
	  (response) => {
		if (response && response.length > 0) {
		  console.log(`Modelos de carros para ${brand}:`, response);
		  this.modelOptions = response;
		  console.log('modelOptions atualizados:', this.modelOptions);
		} else {
		  console.warn('Nenhum modelo encontrado para:', brand);
		  this.modelOptions = [];
		}
	  },
	  (error) => {
		console.error('Erro ao buscar modelos de carros:', error);
	  }
	);
  }
  loadModelsForExistingBrand(index: number): void {
	const car = this.carsFormArray.at(index);
	const brand = car.get('brand')?.value;

	if (brand) {
	  this.carsService.getCarModels(brand).subscribe(
		(response) => {
		  if (response && response.length > 0) {
			console.log(`Modelos de carros para ${brand}:`, response);
			this.modelOptionsMap[index] = response;
		  }
		},
		(error) => {
		  console.error('Erro ao buscar modelos de carros:', error);
		}
	  );
	}
  }

  editCar(index: number): void {
	this.isAddingCar = false;
	this.editingIndex = index;
	const car = this.carsFormArray.at(index).value;
	this.originalCarData[index] = { ...car };

	this.loadModelsForExistingBrand(index);
  }

  onBrandChange(selectedBrand: string | null, index: number): void {
	console.log(
	  `Evento disparado - Marca selecionada para carro ${index}:`,
	  selectedBrand
	);

	if (selectedBrand && selectedBrand.trim() !== '') {
	  this.carsService.getCarModels(selectedBrand).subscribe(
		(response) => {
		  if (response && response.length > 0) {
			console.log(`Modelos de carros para ${selectedBrand}:`, response);
			this.modelOptionsMap[index] = response;

			const currentModel = this.carsFormArray
			  .at(index)
			  .get('model')?.value;
			if (!this.modelOptionsMap[index].includes(currentModel)) {
			  this.carsFormArray.at(index).patchValue({ model: '' });
			}
		  }
		},
		(error) => {
		  console.error('Erro ao buscar modelos de carros:', error);
		}
	  );
	} else {
	  this.modelOptionsMap[index] = [];
	  this.carsFormArray.at(index).patchValue({ model: '' });
	}
  }

  modelOptionsMap: { [key: number]: string[] } = {};

  isEditing1(index: number): boolean {
	return this.editingIndex === index;
  }

  handleSave(index: number): void {
	if (!this.isAddingCar && this.isEditing1(index)) {
	  this.saveCarUpdate(index);
	} else {
	  this.saveCar(index);
	}
  }

  saveCarUpdate(index: number): void {
	console.log('Dados salvos:', this.carsFormArray.at(index).value);
	const carData = this.carsFormArray.at(index).value;

	if (
	  this.originalCarData[index] &&
	  JSON.stringify(this.originalCarData[index]) !== JSON.stringify(carData)
	) {
	  this.carsService.updateCar(this.userID, carData).subscribe({
		next: () => {
		  console.log(`Carro ${carData.licensePlate} atualizado com sucesso!`);
		},
		error: (error) => {
		  console.error(
			`Erro ao atualizar o carro ${carData.licensePlate}:`,
			error
		  );
		},
	  });
	}
	this.originalCarData[index] = null;
	this.editingIndex = null;
  }

  cancelEdit(index: number): void {
	if (this.originalCarData[index]) {
	  this.carsFormArray.at(index).patchValue(this.originalCarData[index]);
	}
	this.originalCarData[index] = null;
	this.editingIndex = null;
  }

  deleteCar(index: number): void {
	const car = this.carsFormArray.at(index).value;
	const licensePlate = car.licensePlate;

	if (licensePlate) {
	  this.carsService
		.deleteCarByLicensePlate(this.userID, licensePlate)
		.subscribe({
		  next: (response) => {
			console.log(`Carro com placa ${licensePlate} excluído com sucesso`);
			this.carsFormArray.removeAt(index);
		  },
		  error: (error) => {
			console.error('Erro ao excluir carro:', error);
		  },
		});
	} else {
	  console.warn('Placa do carro não encontrada!');
	}
  }

  isAddingCar: boolean = false;

  addCar() {
	this.isAddingCar = true;
	const newCarGroup = this.fb.group({
	  brand: [''],
	  model: [''],
	  color: [''],
	  licensePlate: [''],
	});
	this.carsFormArray.push(newCarGroup);
	const newIndex = this.carsFormArray.length - 1;
	this.editingIndex = newIndex;
  }

  saveCar(index: number): void {
	const carData = this.carsFormArray.at(index).value;

	if (
	  !carData.brand ||
	  !carData.model ||
	  !carData.color ||
	  !carData.licensePlate
	) {
	  Swal.fire('Error', 'Please fill in all car details', 'error');
	  return;
	}

	this.carsService.createCarInUser(this.userID, carData).subscribe({
	  next: (response) => {
		console.log('Car created successfully:', response);
		Swal.fire('Success', 'Car added successfully', 'success');

		this.editingIndex = null;
		this.isAddingCar = false;

		this.loadAllData(this.userID);
	  },
	  error: (error) => {
		console.error('Error creating car:', error);
		Swal.fire('Error', 'Failed to add car. Please try again.', 'error');
	  },
	});
  }

  desativarConta() {
	this.messageService
	  .showConfirmationDialog(
		'Tem certeza que deseja desativar esta conta? (Insira o seu email para validar)',
		'Desativar conta',
		this.authenticatorService.getUserEmail() || ''
	  )
	  .subscribe((result) => {
		if (result) {
		  this.userService
			.changeStatusByEmail(
			  this.authenticatorService.getUserEmail() ?? '',
			  { status: 'inactive' }
			)
			.subscribe(
			  () => {
				this.messageService.showSnackbar(
				  'Conta desativada com sucesso!',
				  'success'
				);
				this.authenticatorService.logout();
			  },
			  (error) => {
				console.error('Erro ao desativar Conta', error);
				this.messageService.showSnackbar(
				  'Erro ao desativar Conta: ' + error.error.message,
				  'error'
				);
			  }
			);
		}
	  });
  }
}

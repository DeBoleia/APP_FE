import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
	styleUrl: './user-details.component.scss'
})

export class UserDetailsComponent implements OnInit {
	user: any;
	// cars: Cars[] = [];
	//user: User | null = null;
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
			cars: this.fb.array([])
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
		  console.error('userID não encontrado no token!');
		  return;
		}
	  }

	loadAllData(userID: string): void {
		console.log('Chamando API para obter utilizadores com userID:', this.userID);

		if (this.userID) {
			this.userService.getUserByUserID(this.userID).subscribe({
				next: (data) => {
					console.log('Dados carregados:', data);
					this.user = data;
					if (this.user) {
						this.populateUserForm(this.user);
						this.isEditing = true;
					}
				},
				error: (error) => {
					console.error('Erro ao carregar dados do utilizador:', error);
				},
			});
		} else {
			console.error('userID não definido para carregar dados!');
		}
	}

	populateUserForm(user: User): void {
		console.log('Função populateUserForm chamada');
		console.log('Dados do utiliz:', user );
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
				driversLicense: user.driversLicense || ''
			});
	
			const carsArray = this.carsFormArray;
			carsArray.clear(); 
	
			if (Array.isArray(user.cars)) {
				user.cars.forEach((car: Cars) => {
					carsArray.push(this.fb.group({
						brand: [car.brand || ''],
						model: [car.model || ''],
						color: [car.color || ''],
						licensePlate: [car.licensePlate || '']
					}));
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
		this.carsFormArray.controls.forEach(carFormGroup => {
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
	
			// Atualizar o utilizador
			this.userService
				.updateUserByUserID(formData.userID, formData)
				.subscribe({
					next: (response) => {
						console.log('Utilizador atualizado com sucesso!');
	
						this.userForm.patchValue({
							status: formData.status,
						});
	
						if (this.user) {
							this.user.status = formData.status === 'active' ? 'active' : 'inactive';
						}
	
						// Chamar updateCar para cada carro modificado
						this.carsFormArray.controls.forEach((carGroup, index) => {
							const carData = carGroup.value;
							if (this.originalCarData[index] && JSON.stringify(this.originalCarData[index]) !== JSON.stringify(carData)) {
								// Se os dados do carro foram alterados, faz o update
								const carID = carData.licensePlate; // Você pode usar outro campo como identificador
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
	
						// Recarregar os dados do utilizador após atualização
						this.loadUserData();
					},
					error: (error) => {
						console.error('Erro ao atualizar utilizador:', error);
					},
				});
		} else {
			/* Swal.fire(
				'Erro',
				'Por favor, preencha todos os campos obrigatórios.',
				'error'
			);*/
			console.log("ola")
		}
	}

	toggleEditMode(): void {
		this.isEditing = true;
		this.userForm.patchValue({ ...this.user! });
	}

	// editUser() {
	// 	console.log('Editar utilizador', this.user);
	// 	this.router.navigate(['/user', this.user?.userID, 'edit']);
	//   }

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
					birthDate:
						result.birthDate ?? this.user.birthDate,
					status: result.status ?? this.user.status,
				};
				console.log('Utilizador atualizado:', updatedUser);

				this.userService
					.updateUserByUserID(this.user.userID, updatedUser)
					.subscribe({
						next: () => {
							console.log('Utilizador atualizado com sucesso! CCC');
							this.router
								.navigate(['/user', updatedUser.userID])
								.then(() => {
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
		'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Cyan', 'Magenta', 
		'Lime', 'Indigo', 'Violet', 'Maroon', 'Olive', 'Teal', 'Navy', 'Gold', 'Silver', 'Beige', 'Turquoise', 'Lavender'
	  ];

	  loadCarBrands(): void {
		this.carsService.getCarBrands().subscribe(
		  (response) => {
			console.log('Marcas de carros recebidas:', response);
			this.brandOptions = response;  // Atribui as marcas recebidas do backend
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
	  
	  // Update the editCar method
	  editCar(index: number): void {
		this.isAddingCar = false; 
		this.editingIndex = index;
		const car = this.carsFormArray.at(index).value;
		this.originalCarData[index] = { ...car };
		
		// Load models for the existing brand when entering edit mode
		this.loadModelsForExistingBrand(index);
	  }
	  
	  // Update the onBrandChange method
	  onBrandChange(selectedBrand: string | null, index: number): void {
		console.log(`Evento disparado - Marca selecionada para carro ${index}:`, selectedBrand);
		
		if (selectedBrand && selectedBrand.trim() !== '') {
		  this.carsService.getCarModels(selectedBrand).subscribe(
			(response) => {
			  if (response && response.length > 0) {
				console.log(`Modelos de carros para ${selectedBrand}:`, response);
				this.modelOptionsMap[index] = response;
				
				// Only reset model if brand changed
				const currentModel = this.carsFormArray.at(index).get('model')?.value;
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

	// addCar() {
	// 	this.carsFormArray.push(this.fb.group({
	// 	  brand: ['', [Validators.required]],
	// 	  model: ['', [Validators.required]],
	// 	  color: ['', [Validators.required]],
	// 	  licensePlate: ['', [Validators.required]]
	// 	}));
	//   }
	
	// editCar(index: number): void {
	// 	// Defina o índice do carro para indicar que ele está em edição
	// 	this.editingIndex = index;
	// 	// Salvar os dados originais antes de começar a edição
	// 	const car = this.carsFormArray.at(index).value;
	// 	this.originalCarData[index] = { ...car }; // Copiar os dados para o array originalCarData
	// }
	

	isEditing1(index: number): boolean {
		return this.editingIndex === index; // Verifica se o carro está no estado de edição
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
		
		// Verificar se os dados foram alterados
		if (this.originalCarData[index] && JSON.stringify(this.originalCarData[index]) !== JSON.stringify(carData)) {
			// Chamar o método updateCar para atualizar o carro no backend
			this.carsService.updateCar(this.userID, carData).subscribe({
				next: () => {
					console.log(`Carro ${carData.licensePlate} atualizado com sucesso!`);
				},
				error: (error) => {
					console.error(`Erro ao atualizar o carro ${carData.licensePlate}:`, error);
				}
			});
		}
		
		// Limpar dados originais após salvar
		this.originalCarData[index] = null; 
		this.editingIndex = null; // Sai do modo de edição
	}
	
	cancelEdit(index: number): void {
		// Repopular o formulário com os dados originais
		if (this.originalCarData[index]) {
			this.carsFormArray.at(index).patchValue(this.originalCarData[index]);
		}
		this.originalCarData[index] = null; // Limpar os dados originais
		this.editingIndex = null; // Sai do modo de edição
	}


	deleteCar(index: number): void {
		const car = this.carsFormArray.at(index).value;
		const licensePlate = car.licensePlate;
	  
		if (licensePlate) {
		  // Chama o serviço para excluir o carro
		  this.carsService.deleteCarByLicensePlate(this.userID, licensePlate).subscribe({
			next: (response) => {
			  console.log(`Carro com placa ${licensePlate} excluído com sucesso`);
			  // Atualiza a lista de carros após a exclusão
			  this.carsFormArray.removeAt(index);
			},
			error: (error) => {
			  console.error('Erro ao excluir carro:', error);
			}
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
			  licensePlate: ['']
			});
			this.carsFormArray.push(newCarGroup);
			const newIndex = this.carsFormArray.length - 1;
			this.editingIndex = newIndex;
		  }
		
		  saveCar(index: number): void {
			const carData = this.carsFormArray.at(index).value;
			
			// Verify if we have all required data
			if (!carData.brand || !carData.model || !carData.color || !carData.licensePlate) {
			  Swal.fire('Error', 'Please fill in all car details', 'error');
			  return;
			}
		
			this.carsService.createCarInUser(this.userID, carData).subscribe({
			  next: (response) => {
				console.log('Car created successfully:', response);
				Swal.fire('Success', 'Car added successfully', 'success');
				
				// Reset flags
				this.editingIndex = null;
				this.isAddingCar = false;
				
				// Reload user data to get updated cars list
				this.loadAllData(this.userID);
			  },
			  error: (error) => {
				console.error('Error creating car:', error);
				Swal.fire('Error', 'Failed to add car. Please try again.', 'error');
			  }
			});
		  }
		





	// getStatusLabel(status: string | null): string {
	// 	if (!status) return '';
	// 	switch (status.toLowerCase()) {
	// 		case 'active':
	// 		case 'ativo':
	// 			return 'ativo';
	// 		case 'inactive':
	// 		case 'inativo':
	// 			return 'inativo';
	// 		default:
	// 			return status;
	// 	}
	// }

	desativarConta() {
		this.messageService.showConfirmationDialog(
			'Tem certeza que deseja desativar esta conta? (Insira o seu email para validar)',
			'Desativar conta',
			this.authenticatorService.getUserEmail() || '').subscribe(result => {
				if (result) {
					this.userService.changeStatusByEmail(
						this.authenticatorService.getUserEmail() ?? '',  
						{ status: 'inactive' }
					  ).subscribe(
						() => {
						  this.messageService.showSnackbar('Conta desativada com sucesso!', 'success');
						  this.authenticatorService.logout();
						},
						(error) => {
						  console.error('Erro ao desativar Conta', error);
						  this.messageService.showSnackbar('Erro ao desativar Conta: ' + error.error.message, 'error');
						}
					  );
				}
			});
		}
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
		MatDivider
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
		private fb: FormBuilder
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
			cars: this.fb.array([])  // Definindo o FormArray
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
		  this.isEditing = true;  // Garantir que os dados sejam carregados aqui
		} else {
		  console.error('userID não encontrado no token!');
		  return;
		}
	  }

	// ngOnInit(): void {
	// 	const userIDFromToken = this.authenticatorService.getUserID();

	// 	if (userIDFromToken) {
	// 	  this.userID = userIDFromToken;
	// 	  console.log('userID DO TOKEN @@ :', this.userID);
	// 	} else {
	// 	  console.error('userID não encontrado no token!');
	// 	  return;
	// 	}
	// 	this.userForm = this.fb.group({
	// 		userID: [''],
	// 		name: [''],
	// 		email: [''],
	// 		role: [''],
	// 		phoneNumber: [''],
	// 		NIF: [''],
	// 		birthDate: [''],
	// 		status: [''],
	// 		driverRating: [''],
	// 		driverRatingCount: [''],
	// 		passengerRating: [''],
	// 		passengerRatingCount: [''],
	// 		driversLicense: [''],
	// 		cars: this.fb.array([])
	// 	});

	// 	this.userForm.get('userID')?.setValue(this.userID);

	// 	this.loadAllData(this.userID);
	
	// 	// Atribuir o userID corretamente da rota
	// 	// this.route.paramMap.subscribe(params => {
	// 	// 	this.userID = params.get('userID') || ''; 
	// 	// 	if (this.userID) {
	// 	// 		this.loadAllData(this.userID);
	// 	// 	} else {
	// 	// 		console.error('userID não encontrado na rota!');
	// 	// 	}
	// 	// });
	// }
	
	// ngOnInit(): void {
	// 	// const userIDFromToken = this.authenticatorService.getUserEmail();

	// 	// if (emailFromToken) {
	// 	//   this.email = emailFromToken;
	// 	//   console.log('EMAIL DO TOKEN:', this.email);
	// 	// } else {
	// 	//   console.error('Email não encontrado no token!');
	// 	//   return;
	// 	// }

	// 	this.userForm = this.fb.group({
	// 		userID: [''],
	// 		name: [''],
	// 		email: [''],
	// 		role: [''],
	// 		phoneNumber: [''],
	// 		NIF: [''],
	// 		birthDate: [''],
	// 		status: [''],
	// 		driverRating: [''],
	// 		driverRatingCount: [''],
	// 		passengerRating: [''],
	// 		passengerRatingCount: [''],
	// 		driversLicense: [''],
	// 		cars: this.fb.group({
	// 			brand: [''],
	// 			model: [''],
	// 			color: [''],
	// 			licensePlate: [''],
	// 		}),


	// 	});

	// 	this.userForm.get('userID')?.setValue(this.userID);

	// 	this.loadAllData(this.userID);
	// }

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

	onSubmit(): void {
		if (this.userForm.valid) {
			const formData = this.userForm.value;
			formData.status = formData.status === 'ativo' ? 'active' : 'inactive';

			console.log('Dados do formulário antes de enviar:', formData);

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

						this.loadUserData();
					},
					error: (error) => {
						console.error('Erro ao atualizar utilizador:', error);
						
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
					// morada: {
					// 	rua: result.rua ?? this.utilizador.morada?.rua ?? '',
					// 	localidade:
					// 		result.localidade ?? this.utilizador.morada?.localidade ?? '',
					// 	codigoPostal:
					// 		result.codigoPostal ?? this.utilizador.morada?.codigoPostal ?? '',
					// 	localidadePostal:
					// 		result.localidadePostal ??
					// 		this.utilizador.morada?.localidadePostal ??
					// 		'',
					// 	pais: result.pais ?? this.utilizador.morada?.pais ?? '',
					// },
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
							//this.messageService.showSnackbar(error.error.error, 'error');
						},
					});
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

	// desativarConta() {
	// 	this.messageService.showConfirmationDialog(
	// 		'Tem certeza que deseja desativar esta conta? (Insira o seu email para validar)',
	// 		'Desativar conta',
	// 		this.authService.getUserEmail() || '').subscribe(result => {
	// 			if (result) {
	// 				this.userService.desativarConta(this.authService.getUserId()).subscribe(
	// 					() => {
	// 						this.messageService.showSnackbar('Conta desativada com sucesso!', 'success');
	// 						this.authService.logout();
	// 					},
	// 					(error) => {
	// 						console.error('Erro ao desativar Conta', error);
	// 						this.messageService.showSnackbar('Erro ao criar Reserva: ' + error.error.message, 'error');
	// 					});
	// 			}
	// 		});
	// 	}
}

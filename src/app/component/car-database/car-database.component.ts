import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { CarDatabaseService } from '../../services/cardatabase.service';
import { CarsService } from '../../services/cars.service';
import { MessageService } from '../../services/message.service';
import { DatabaseCars } from '../../interfaces/car';
import { CarsEditComponent } from '../../edit/cars-edit/cars-edit.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-car-database',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    RouterModule,
    MatSelectModule,
  ],
  templateUrl: './car-database.component.html',
  styleUrl: './car-database.component.scss'
})
export class CarDatabaseComponent implements OnInit, AfterViewInit {
  
  displayedColumns: string[] = ['brand', 'actions'];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<DatabaseCars>();
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  brandOptions: string[] = [];
  modelOptions: string[] = [];

  constructor(
    private carDatabaseService: CarDatabaseService,
    private carsService: CarsService,
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.loadCarBrands();
  }

  loadCarBrands(): void {
    this.carDatabaseService.getBrandsList().subscribe({
      next: (brands: string[]) => {
        this.dataSource.data = brands.map((brand: string) => ({ brand } as DatabaseCars));
      },
      error: (error) => {
        this.messageService.showSnackbar('Error loading brands', 'error');
      }
    });
  }

  filterBrands(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dataBaseCars: DatabaseCars[] = [];

  addNewCar(): void {
    const dialogRef = this.dialog.open(CarsEditComponent, {
      width: '900px',
      data: {
        brand: '',
        model: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dados recebidos após fechamento do diálogo:', result);


        const newCar: DatabaseCars = {
          brand: result.brand,
          model: result.model,
        };

        console.log('Novo objeto de carsDB a ser enviado:', newCar);


        this.carDatabaseService.addNewCar(newCar).subscribe(
          (response) => {
            this.messageService.showSnackbar('car criado com sucesso!', 'success');

            this.loadCarBrands();
          },
          (error) => {
            console.error('Erro ao criar car:', error);
            this.messageService.showSnackbar(
              'Erro ao criar car: ' +
              (error.error?.error ? error.error.error : error.message)
            );
          }
        );
      } else {

        console.log('Ação de criação de car foi cancelada');
      }
    });
  }


  // openVirusDialog(): void {
  //   const dialogRef = this.dialog.open(VirusDialogComponent, {
  //     width: '900px',
  //     data: {
  //       codigoVirus: '',
  //       nomeVirus: '',
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       console.log('Dados recebidos após fechamento do diálogo:', result);


  //       const newVirus: Virus = {
  //         codigoVirus: result.codigoVirus,
  //         nomeVirus: result.nomeVirus,
  //       };

  //       console.log('Novo objeto de vírus a ser enviado:', newVirus);


  //       this.virusService.createVirus(newVirus).subscribe(
  //         (response) => {
  //           this.messageService.showSnackbar('Vírus criado com sucesso!', 'success');

  //           this.getAllVirus();
  //         },
  //         (error) => {
  //           console.error('Erro ao criar vírus:', error);
  //           this.messageService.showSnackbar(
  //             'Erro ao criar vírus: ' +
  //             (error.error?.error ? error.error.error : error.message)
  //           );
  //         }
  //       );
  //     } else {

  //       console.log('Ação de criação de vírus foi cancelada');
  //     }
  //   });
  // }

  // addNewCar(): void {
  //   this.messageService.showConfirmationDialog(
  //     'Add New Car',
  //     'Enter brand and model (separated by comma)',
  //     ''
  //   ).subscribe((result: string | boolean) => {
  //     if (result && typeof result === 'string') {
  //       const parts: string[] = result.split(',');
  //       const brand = parts[0]?.trim();
  //       const model = parts[1]?.trim();
        
  //       if (brand && model) {
  //         this.carDatabaseService.addNewCar({ brand, model }).subscribe({
  //           next: () => {
  //             this.messageService.showSnackbar('Car added successfully', 'success');
  //             this.loadCarBrands();
  //           },
  //           error: (error) => {
  //             console.error('Error adding car:', error);
  //             this.messageService.showSnackbar('Error adding car', 'error');
  //           }
  //         });
  //       } else {
  //         this.messageService.showSnackbar('Please enter both brand and model', 'error');
  //       }
  //     }
  //   });
  // }

  renameBrand(brand: string): void {

  }
  
  // renameBrand(brand: string): void {
  //   this.messageService.showConfirmationDialog(
  //     'Rename Brand',
  //     `Enter new name for ${brand}`,
  //     brand
  //   ).subscribe(result => {
  //     if (result && typeof result === 'string') {
  //       this.carDatabaseService.renameBrand(brand, result).subscribe({
  //         next: () => {
  //           this.messageService.showSnackbar('Brand renamed successfully', 'success');
  //           this.loadCarBrands();
  //         },
  //         error: (error) => {
  //           console.error('Error renaming brand:', error);
  //           this.messageService.showSnackbar('Error renaming brand', 'error');
  //         }
  //       });
  //     }
  //   });
  // }

  viewBrandDetails(brand: string): void {
    this.router.navigate(['/cars', brand]);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
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
    MatSelectModule
  ],
  templateUrl: './car-database.component.html',
  styleUrl: './car-database.component.scss'
})
export class CarDatabaseComponent implements OnInit {
  displayedColumns: string[] = ['brand', 'modelCount', 'actions'];
  dataSource = new MatTableDataSource<DatabaseCars>();
  
  brandOptions: string[] = [];
  modelOptions: string[] = [];

  constructor(
    private carDatabaseService: CarDatabaseService,
    private carsService: CarsService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCarBrands();
  }

  loadCarBrands(): void {
    this.carsService.getCarBrands().subscribe({
      next: (response) => {
        console.log('Car brands returned:', response);
        this.brandOptions = response;
        this.processBrandsData(response);
      },
      error: (error) => {
        console.error('Error fetching car brands:', error);
        this.messageService.showSnackbar('Error loading car brands', 'error');
      }
    });
  }

  private processBrandsData(brands: string[]): void {
    const brandSummaries: Promise<DatabaseCars>[] = brands.map(async brand => {
      return new Promise((resolve) => {
        this.carsService.getCarModels(brand).subscribe({
          next: (models) => {
            resolve({
              brand,
              modelCount: models.length
            });
          },
          error: () => {
            resolve({
              brand,
              modelCount: 0
            });
          }
        });
      });
    });

    Promise.all(brandSummaries).then(summaries => {
      this.dataSource.data = summaries;
    });
  }

  filterBrands(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewCar(): void {
    this.messageService.showConfirmationDialog(
      'Add New Car',
      'Enter brand and model (separated by comma)',
      ''
    ).subscribe((result: string | boolean) => {
      if (result && typeof result === 'string') {
        const parts: string[] = result.split(',');
        const brand = parts[0]?.trim();
        const model = parts[1]?.trim();
        
        if (brand && model) {
          this.carDatabaseService.addNewCar({ brand, model }).subscribe({
            next: () => {
              this.messageService.showSnackbar('Car added successfully', 'success');
              this.loadCarBrands();
            },
            error: (error) => {
              console.error('Error adding car:', error);
              this.messageService.showSnackbar('Error adding car', 'error');
            }
          });
        } else {
          this.messageService.showSnackbar('Please enter both brand and model', 'error');
        }
      }
    });
  }
  
  renameBrand(brand: string): void {
    this.messageService.showConfirmationDialog(
      'Rename Brand',
      `Enter new name for ${brand}`,
      brand
    ).subscribe(result => {
      if (result && typeof result === 'string') {
        this.carDatabaseService.renameBrand(brand, result).subscribe({
          next: () => {
            this.messageService.showSnackbar('Brand renamed successfully', 'success');
            this.loadCarBrands();
          },
          error: (error) => {
            console.error('Error renaming brand:', error);
            this.messageService.showSnackbar('Error renaming brand', 'error');
          }
        });
      }
    });
  }

  viewBrandDetails(brand: string): void {
    this.router.navigate(['/cars', brand]);
  }
}
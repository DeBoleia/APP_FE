import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CarDatabaseService } from '../../services/cardatabase.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-car-brand-details',
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
    RouterModule
  ],
  templateUrl: './car-brand-details.component.html',
  styleUrl: './car-brand-details.component.scss'
})
export class CarBrandDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  brand = '';
  displayedColumns: string[] = ['model', 'actions'];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  dataSource = new MatTableDataSource<{model: string}>();

  constructor(
    private carDatabaseService: CarDatabaseService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: { [key: string]: string }) => {
      this.brand = params['brand'] || '';
      this.loadBrandModels();
    });
  }

  loadBrandModels(): void {
    console.log('Loading models for brand:', this.brand);
    this.carDatabaseService.getCarsByBrand(this.brand).subscribe({
      next: (cars) => {
        console.log('Received models:', cars);
        this.dataSource.data = cars.map((model: string) => ({ model }));
      },
      error: (error) => {
        console.error('Error loading models:', error);
        this.messageService.showSnackbar('Error loading models', 'error');
      }
    });
  }

  filterModels(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editModel(model: string): void {
    this.messageService.showConfirmationDialog(
      'Edit Model',
      `Enter new name for ${model}`,
      model  // Provide current value as default
    ).subscribe(result => {
      if (result && typeof result === 'string') {
        this.carDatabaseService.updateCarModel(this.brand, model, { 
          newModel: result 
        }).subscribe({
          next: () => {
            this.messageService.showSnackbar('Model updated successfully', 'success');
            this.loadBrandModels();
          },
          error: (error) => {
            console.error('Error updating model:', error);
            this.messageService.showSnackbar('Error updating model', 'error');
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cars']);
  }

  addNewModel(): void {
    this.messageService.showConfirmationDialog(
      'Add New Model',
      `Enter model name for ${this.brand}`,
      ''
    ).subscribe(result => {
      if (result && typeof result === 'string') {
        this.carDatabaseService.addNewCar({ 
          brand: this.brand, 
          model: result 
        }).subscribe({
          next: () => {
            this.messageService.showSnackbar('Model added successfully', 'success');
            this.loadBrandModels();
          },
          error: (error) => {
            console.error('Error adding model:', error);
            this.messageService.showSnackbar('Error adding model', 'error');
          }
        });
      }
    });
  }
}
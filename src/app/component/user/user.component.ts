import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorService } from '../../services/authenticator.service';
//import { userDialogComponent } from '../../forms/utilizadores-edit/utilizadores-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'status',
    'acoes',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  user: User[] = [];
  dataSource!: MatTableDataSource<User>;

  constructor(
    private utilizadoresService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthenticatorService
  ) {}


  ngOnInit(): void {
    //this.getAllUtilizadores();
  }
}





/*
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Utilizadores } from '../../interfaces/utilizadores';
import { UtilizadoresService } from '../../services/utilizadores.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import moment from 'moment';
import { UtilizadoresDialogComponent } from '../../forms/utilizadores-edit/utilizadores-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-utilizadores',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './utilizadores.component.html',
  styleUrls: ['./utilizadores.component.scss'],
})
export class UtilizadoresComponent implements OnInit {
  displayedColumns: string[] = [
    'nome',
    'email',
    'tipoUtilizador',
    'status',
    'aproved',
    'acoes',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  utilizador: Utilizadores[] = [];
  dataSource!: MatTableDataSource<Utilizadores>;

  constructor(
    private utilizadoresService: UtilizadoresService,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllUtilizadores();
  }

  filterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllUtilizadores(): void {
    this.utilizadoresService.getAllUtilizadores().subscribe({
      next: (data: Utilizadores[]) => {
        this.utilizador = data;
        this.utilizador = this.utilizador.map((utilizador) => {
          return {
            ...utilizador,
            aproved: utilizador.aproved ?? false,
          };
        });

        this.dataSource = new MatTableDataSource(this.utilizador);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (
          data: Utilizadores,
          filter: string
        ) => {
          const dataStr = data.nome + data.email + data.telefone;
          return dataStr.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: (error: any) => {
        console.error('Erro ao carregar utilizadores:', error);
      },
    });
  }

  showDetails(email: any) {
    this.router.navigate(['/utilizadores', email]);
    console.log('ESTOU_AQUI');
  }

  toggleAproved(element: any): void {
    element.aproved = !element.aproved;

    this.authService.changeStatusByEmail(element.email).subscribe(
      (response: any) => {
        console.log('Status atualizado com sucesso:', response);
        this.dataSource.data = [...this.utilizador];
        this.dataSource._updateChangeSubscription();
        this.getAllUtilizadores();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: any) => {
        console.error('Erro ao atualizar status:', error);
        element.aproved = !element.aproved;
      }
    );
  }

  
}



*/
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `http://localhost:8082/api/user`;

  constructor(private http: HttpClient) {}

  // Common headers, assuming 'verifyToken' middleware checks the token from local storage or session storage
  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  // ======================== GET ======================== //

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user by userID
  getUserByUserID(userID: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${userID}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user by email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user by token
  getUserByToken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byToken`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user info for passenger (for driver)
  getPassengersInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/passenger`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ======================== PUT ======================== //

  // Update user by userID
  updateUserByUserID(userID: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/id/${userID}`, userData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update user by email
  updateUserByEmail(email: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/email/${email}`, userData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Change user status by userID
  changeStatusByUserID(userID: string, statusData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/status/${userID}`, statusData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Change user password by userID
  changePasswordByUserID(userID: string, passwordData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pass/${userID}`, passwordData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ======================== PATCH ======================== //

  // Rate driver by userID
  rateDriver(userID: string, ratingData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/ratedriver/${userID}`, ratingData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Rate passengers
  ratePassengers(ratingData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/ratepassengers`, ratingData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ======================== DELETE ======================== //

  // Delete user by userID
  deleteUser(userID: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/id/${userID}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ======================== Error Handler ======================== //

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing the request.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error: ${error.status} - ${error.message}`;
    }
    return throwError(errorMessage);
  }
}


/*
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Utilizadores } from '../interfaces/utilizadores';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilizadoresService {
  private apiUrl = environment.SAFE_BE_URL +  '/api/utilizadores';

  constructor(private http: HttpClient) {}

  // ===================== POST =====================

  createUtilizador(utilizador: Utilizadores): Observable<Utilizadores> {
    console.log('Utilizador recebido no servico AAA:', utilizador);
    return this.http.post<Utilizadores>(this.apiUrl, utilizador).pipe(
      catchError((error) => {
        console.error('Erro ao procurar utilizadores:', error);
        return throwError(() => new Error('Erro ao carregar utilizadores.'));
      })
    );
  }

  // ===================== GET =====================

  getAllUtilizadores(): Observable<Utilizadores[]> {
    return this.http.get<Utilizadores[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erro ao carregar todos os utilizadores:', error);
        return throwError(
          () => new Error('Erro ao carregar todos os utilizadores.')
        );
      })
    );
  }

  getUtilizadoresById(id: string): Observable<Utilizadores> {
    return this.http.get<Utilizadores>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Erro ao carregar utilizador com ID ${id}:`, error);
        return throwError(
          () => new Error(`Erro ao carregar utilizador com ID ${id}.`)
        );
      })
    );
  }

  getUtilizadoresByNome(nome: string): Observable<Utilizadores[]> {
    return this.http.get<Utilizadores[]>(`${this.apiUrl}/nome/${nome}`).pipe(
      catchError((error) => {
        console.error(`Erro ao carregar utilizadores com nome ${nome}:`, error);
        return throwError(
          () => new Error(`Erro ao carregar utilizadores com nome ${nome}.`)
        );
      })
    );
  }

  getUtilizadoresByEmail(email: string): Observable<Utilizadores[]> {
    console.log('Chamando API para obter utilizadores com email:', email);
    return this.http.get<Utilizadores[]>(`${this.apiUrl}/email/${email}`).pipe(
      catchError((error) => {
        console.error(
          `Erro ao carregar utilizadores com email ${email}:`,
          error
        );
        return throwError(
          () => new Error(`Erro ao carregar utilizadores com email ${email}.`)
        );
      })
    );
  }

  getUtilizadoresByNIF(NIF: number): Observable<Utilizadores[]> {
    return this.http.get<Utilizadores[]>(`${this.apiUrl}/nif/${NIF}`).pipe(
      catchError((error) => {
        console.error(`Erro ao carregar utilizadores com NIF ${NIF}:`, error);
        return throwError(
          () => new Error(`Erro ao carregar utilizadores com NIF ${NIF}.`)
        );
      })
    );
  }

  getUtilizadoresByTelefone(tel: string): Observable<Utilizadores[]> {
    return this.http.get<Utilizadores[]>(`${this.apiUrl}/tel/${tel}`).pipe(
      catchError((error) => {
        console.error(
          `Erro ao carregar utilizadores com telefone ${tel}:`,
          error
        );
        return throwError(
          () => new Error(`Erro ao carregar utilizadores com telefone ${tel}.`)
        );
      })
    );
  }

  // ===================== PUT =====================

  desativarConta(userId:any):Observable<Utilizadores> {
    return this.http.put<Utilizadores>(this.apiUrl + '/status/' + userId, {});
  }

  // ativarConta(email:any):Observable<Utilizadores> {
  //   return this.http.put<Utilizadores>(this.apiUrl + '/status/' + email, {});
  // }
  

  // ===> vou ter de enviar id do backend para fazer put

  updateUtilizadoresById(utilizador: Utilizadores): Observable<Utilizadores> {
    return this.http
      .put<Utilizadores>(`${this.apiUrl}/${utilizador.id}`, utilizador)
      .pipe(
        catchError((error) => {
          console.error(
            `Erro ao atualizar utilizador com ID ${utilizador.id}:`,
            error
          );
          return throwError(
            () =>
              new Error(`Erro ao atualizar utilizador com ID ${utilizador.id}.`)
          );
        })
      );
  }

  updateUtilizadoresByEmail(
    email: string,
    utilizador: Utilizadores
  ): Observable<Utilizadores> {
    return this.http
      .put<Utilizadores>(`${this.apiUrl}/email/${email}`, utilizador)
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         console.error(
  //           `Erro ao atualizar utilizador com email ${email}:`,
  //           error
  //         );
  //         return throwError(error);
  //       })
  //     );
  }

  ativarUtilizador(email: string, formData: Utilizadores): Observable<any> {
    return this.http.put(`${this.apiUrl}/ativar/${email}`, formData);
  }

  ativarUtilizador2(email: string): Observable<any> {
    // Envia o PUT com apenas o e-mail na URL, sem formData
    const url = `${this.apiUrl}/ativar/${email}`;
    console.log("Requisição PUT para ativar conta:", url);  // Log para verificar a URL
    return this.http.put(url, {});  // Enviando um corpo vazio
  }

  // ===================== DELETE =====================

  deleteUtilizadores(id: string): Observable<Utilizadores> {
    return this.http.delete<Utilizadores>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Erro ao apagar utilizador com ID ${id}:`, error);
        return throwError(
          () => new Error(`Erro ao apagar utilizador com ID ${id}.`)
        );
      })
    );
  }
}



*/
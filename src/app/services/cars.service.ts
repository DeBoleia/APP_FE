import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private baseUrl = 'http://localhost:8082/api/cars';  // URL base do seu backend

  constructor(private http: HttpClient) { }

  // Função para obter todas as marcas de carros
  getCarBrands(): Observable<any> {

    return this.http.get(`${this.baseUrl}/brands`);
  }

  // Função para obter os modelos de carros baseado na marca
  getCarModels(brand: string): Observable<any> {
    console.log('getCarModels ESTOU AQUI');
    return this.http.post(`${this.baseUrl}/models`, { brand });
  }

  // Função para atualizar o carro (por ID de usuário)
  updateCar(userID: string, carData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCar/${userID}`, carData);
  }

  // Função para criar um carro no usuário (por ID de usuário)
  createCarInUser(userID: string, carData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/selectCar/${userID}`, carData);
  }

  // Função para excluir todos os carros de um usuário
  deleteCars(userID: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCars/${userID}`);
  }

  // Função para excluir um carro pelo license plate
  deleteCarByLicensePlate(userID: string, licensePlate: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCars/${userID}/${licensePlate}`);
  }
}
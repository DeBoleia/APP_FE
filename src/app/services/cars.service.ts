import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cars } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private baseUrl = 'http://localhost:8083/api/cars';  // URL base do seu backend

  constructor(private http: HttpClient) { }

  // Função para obter todas as marcas de carros
  getCarBrands(): Observable<any> {

    const cars = this.http.get(`${this.baseUrl}`);
    console.log(cars);
    return cars.pipe(map((carArray: any) => new Set(carArray.map((car: any) => car.brand))));
  }
  
  // Função para obter os modelos de carros baseado na marca
  getCarModels(brand: string): Observable<any> {
    const cars = this.http.get<Cars>(`${this.baseUrl}`);
    console.log(cars);
    return cars.pipe(map((carArray: any) => carArray.map((car: any) => car.model)));
  }

  // Função para atualizar o carro (por ID de usuário)
  updateCar(userID: string, carData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCar/${userID}`, carData);
  }

  // Função para criar um carro no usuário (por ID de usuário)
  createCarInUser(userID: string, carData: any): Observable<any> {
    return this.http.post(`http://localhost:8082/api/cars/selectCar/${userID}`, carData);
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
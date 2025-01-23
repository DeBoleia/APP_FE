import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cars } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private baseUrlCarros = 'http://localhost:8083/api/cars';
  private baseUrlDeBoleia = 'http://localhost:8082/api/cars'; 

  constructor(private http: HttpClient) { }

  // Função para obter todas as marcas de carros
  getCarBrands(): Observable<any> {

    return this.http.get(`${this.baseUrlDeBoleia}/brands`);
  }
  
  // Função para obter os modelos de carros baseado na marca
  // getCarModels(brand: string): Observable<any> {
  //   console.log('getCarModels ESTOU AQUI');
  //   return this.http.post(`${this.baseUrl}/models`, { brand });
  // }
  getCarModels(brand: string): Observable<any> {
    console.log('getCarModels ESTOU AQUI para a brand:', brand);
    return this.http.get(`${this.baseUrlCarros}/${brand}/models`);
  }

  // Função para atualizar o carro (por ID de usuário)
  updateCar(userID: string, carData: any): Observable<any> {
    return this.http.put(`${this.baseUrlDeBoleia}/updateCar/${userID}`, carData);
  }

  // Função para criar um carro no usuário (por ID de usuário)
  createCarInUser(userID: string, carData: any): Observable<any> {
    return this.http.post(`${this.baseUrlDeBoleia}/selectCar/${userID}`, carData);
  }

  // Função para excluir todos os carros de um usuário
  deleteCars(userID: string): Observable<any> {
    return this.http.delete(`${this.baseUrlDeBoleia}/deleteCars/${userID}`);
  }

  // Função para excluir um carro pelo license plate
  deleteCarByLicensePlate(userID: string, licensePlate: string): Observable<any> {
    return this.http.delete(`${this.baseUrlDeBoleia}/deleteCars/${userID}/${licensePlate}`);
  }

  getAllCarBrands(): Observable<any> {
    console.log('A obter todas as marcas de carros...');
    return this.http.get(`${this.baseUrlCarros}/all/brands`);
  }
}
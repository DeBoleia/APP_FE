import { Injectable } from '@angular/core';

export interface Location {
  parish:string;
  municipality: string;
  district: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})

export class LocationService {

  private baseUrl = 'https://geoapi.pt/'

  constructor() { } 

  getDistricts(): Promise<string[]> {
    const url = `${this.baseUrl}distritos?json=true`;
    return fetch(url)
      .then(response => response.json())
      .then(data => data.map((item: any) => item.distrito));
  }

  getMunicipalities(district: string): Promise<string[]> {
    const url = `${this.baseUrl}distrito/${district}/municipios?json=true`;
    return fetch(url)
      .then(response => response.json())
      .then(data => data.municipios.map((item: any) => item.nome));
  }

  getParishes(municipality: string): Promise<string[]> {
    const url = `${this.baseUrl}municipio/${municipality}/freguesias?json=true`;
    return fetch(url)
      .then(response => response.json())
      .then(data => data.freguesias);
  }

  
}

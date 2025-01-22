import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface Location {
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

  getCoordinates({ parish, municipality, district }: { parish?: string; municipality?: string; district?: string }): Observable<Location> {
    if (parish) {
      const url = `${this.baseUrl}municipio/${municipality}/freguesia/${parish}?json=true`;
      return from(fetch(url)
        .then(response => response.json())
        .then(data => {
          const [lng, lat] = data.geojson.properties.centros.centro;
          return { lat, lng };
        }));
    }
  
    else if (municipality) {
      const url = `${this.baseUrl}distrito/${district}/municipios?json=true`;
      return from(fetch(url)
        .then(response => response.json())
        .then(data => {
          const municipalityData = data.geojsons.municipios.find((item: any) => {
            console.log('Checking item: ', item.properties.Concelho);
            return item.properties.Concelho === municipality;
          });
          if (!municipalityData) return { lat: 0, lng: 0 };
          const [lng, lat] = municipalityData.properties.centros.centro;
          return { lat, lng };
        }));
    }
  
    else if (district) {
      const url = `${this.baseUrl}distrito/${district}?json=true`;
      return from(fetch(url)
        .then(response => response.json())
        .then(data => {
          const [lng, lat] = data.geojson.properties.centros.centro;
          return { lat, lng };
        }));
    }
  
    // Caso nenhum parâmetro seja fornecido, rejeitar a promessa.
    return new Observable<Location>((observer) => {
      observer.error('No valid location attributes provided.');
    });
  }
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BikeModel } from './bike-model.service';
import { Store } from './store.service';
import { BikeGualti } from './prenotazione.service';

export interface Bike {
  _id?: string;
  idPuntoVendita: String;
  idModello: BikeModel;
  quantity: number;
}

export interface BikeInput {
  _id?: string;
  idPuntoVendita: String;
  idModello: String;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class BikeService {
  conStr = 'https://cloneride-spa.onrender.com';

  constructor(private http: HttpClient) {}

  getBikesDisponibili(
    start: Date,
    end: Date,
    pickup_location: string
  ): Observable<Bike[]> {
    const body = {
      start,
      end,
      pickup_location,
    };
    return this.http
      .post<{ message: string; data: Bike[] }>(
        this.conStr + '/api/bikes/disponibili',
        body
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  getBikesDisponibiliGualti(
    start: Date,
    end: Date,
    pickup_location: string
  ): Observable<BikeGualti[]> {
    const body = {
      start,
      end,
      pickup_location,
    };
    return this.http
      .post<{ message: string; data: BikeGualti[] }>(
        this.conStr + '/api/bikes/disponibili',
        body
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  getBikesByPuntoVendita(store: string): Observable<Bike[]> {
    return this.http
      .get<{ message: string; data: Bike[] }>(
        this.conStr + '/api/bikes/' + store
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  createBike(bikeInput: BikeInput): Observable<Bike> {
    var bikeInputNoId = { ...bikeInput, _id: undefined };
    return this.http
      .post<{ message: string; data: Bike }>(
        this.conStr + '/api/bikes/',
        bikeInputNoId
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  updateBike(bikeInput: BikeInput): Observable<Bike> {
    return this.http
      .put<{ message: string; data: Bike }>(
        this.conStr + '/api/bikes/' + bikeInput._id,
        { quantity: bikeInput.quantity }
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  deleteBike(id: string): Observable<Bike> {
    return this.http
      .delete<{ message: string; data: Bike }>(this.conStr + '/api/bikes/' + id)
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }
}

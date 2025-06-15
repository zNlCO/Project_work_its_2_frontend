import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BikeModel } from './bike-model.service';
import { Store } from './store.service';

export interface Bike {
    _id?: string;
    idPuntoVendita: String;
    idModello: BikeModel;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class BikeService {
    conStr = 'https://cloneride-spa.onrender.com';

    constructor(private http: HttpClient) { }

    getBikesDisponibili(start: Date, end: Date, pickup_location: string): Observable<Bike[]> {
        const body = {
            start,
            end,
            pickup_location
        };
        return this.http.post<{ message: string; data: Bike[] }>(this.conStr + '/api/bikes/disponibili', body)
            .pipe(
                // Extract only the Data property
                map(response => response.data)
            );
    }
}

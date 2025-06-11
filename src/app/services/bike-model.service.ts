import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
export interface BikeModel {
    _id?: string;
    descrizione: string;
    type: string;
    size: string;
    elettrica: boolean;
    prezzo: number;
    imgUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class BikeModelService {

    conStr = 'https://cloneride-spa.onrender.com';

    constructor(private http: HttpClient) { }

    getBikeModels(): Observable<BikeModel[]> {
        return this.http.get<{ message: string; data: BikeModel[] }>(this.conStr + '/api/bike-model/')
            .pipe(
                // Extract only the Data property
                map(response => response.data)
            );
    }
}

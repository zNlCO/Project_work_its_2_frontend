import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from './store.service';
import { Bike } from './bike.service';
import { map, Observable } from 'rxjs';

export interface Prenotazione {
    id: string;
    idUser: string;
    bikes: [{
        bike: Bike;
        accessori: [String];
        assicurazione: String
    }];
    start: Date;
    stop: Date;
    pickupLocation: Store;
    dropLocation: Store;
    manutenzione: boolean;
    cancelled: boolean;
    status: String;
}

// prenotazione input
export interface PrenotazioneInput {
    idUser?: string;
    bikes: [{
        id: string;
        quantity: number;
        accessori: [String];
        assicurazione: String
    }];
    start: Date;
    stop: Date;
    pickupLocation: string;
    dropLocation: string;
}

@Injectable({
    providedIn: 'root'
})
export class PrenotazioneService {

    conStr = 'https://cloneride-spa.onrender.com'

    constructor(private http: HttpClient) { }

        addPrenotazione(prenotazioneInput: PrenotazioneInput): Observable<Prenotazione> {
            return this.http.post<{ message: string; data: Prenotazione }>(this.conStr + '/api/bookings/insert', prenotazioneInput) 
                .pipe(
                    // Extract only the Data property
                    map(response => response.data)
                );
        }
}

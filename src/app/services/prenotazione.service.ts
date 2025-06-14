import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from './store.service';
import { Bike } from './bike.service';

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

@Injectable({
    providedIn: 'root'
})
export class PrenotazioneService {

    conStr = 'https://cloneride-spa.onrender.com'

    constructor(private http: HttpClient) { }
}

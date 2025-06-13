import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Accessory {
    id?: string;
    descrizione: string;
    prezzo: number;
}

@Injectable({
    providedIn: 'root'
})
export class AccessoryService {
    conStr = 'https://cloneride-spa.onrender.com';

    constructor(private http: HttpClient) { }

    getAccessories(): Observable<Accessory[]> {
        return this.http.get<Accessory[]>(this.conStr + '/api/accessories');
    }
}

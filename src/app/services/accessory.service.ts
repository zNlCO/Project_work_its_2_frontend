import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Accessory {
    _id?: string;
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
        return this.http.get<{message: string; data: Accessory[]}>(this.conStr + '/api/accessories')
            .pipe(
                // Extract only the Data property
                map(response => response.data)
            );
    }
}

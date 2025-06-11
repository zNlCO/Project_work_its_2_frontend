import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Store {
    _id?: string;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    private conStr = 'https://cloneride-spa.onrender.com'

    constructor(private http: HttpClient) { }

    getStores(): Observable<Store[]> {
        return this.http.get<{ message: string; data: Store[] }>(this.conStr + '/api/store')
            .pipe(
                // Extract only the Data property
                map(response => response.data)
            );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Insurance {
    _id?: string;
    descrizione: string;
    prezzo: number;
}

@Injectable({
    providedIn: 'root'
})
export class InsuranceService {
    conStr = 'https://cloneride-spa.onrender.com';

    constructor(private http: HttpClient) { }

    getInsurances(): Observable<Insurance[]> {
        return this.http.get<{message: string; data: Insurance[]}>(this.conStr + '/api/insurances').pipe(
            map(response => response.data)
        );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Insurance {
    id?: string;
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
        return this.http.get<Insurance[]>(this.conStr + '/api/insurances');
    }
}

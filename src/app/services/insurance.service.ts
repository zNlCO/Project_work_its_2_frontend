import { Injectable } from '@angular/core';

export interface Insurance {
    id?: string;
    descrizione: string;
    prezzo: number;
}

@Injectable({
    providedIn: 'root'
})
export class InsuranceService {

    constructor() { }
}

import { Injectable } from '@angular/core';

export interface Accessory {
    id?: string;
    descrizione: string;
    prezzo: number;
}

@Injectable({
    providedIn: 'root'
})
export class AccessoryService {

    constructor() { }
}

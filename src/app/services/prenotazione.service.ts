import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrenotazioneService {

    constructor(private http: HttpClient) { }
}

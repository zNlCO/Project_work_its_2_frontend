import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from './store.service';
import { Bike } from './bike.service';
import { map, Observable } from 'rxjs';
import { BikeModel } from './bike-model.service';

export interface Prenotazione {
  _id: string;
  idUser: string;
  bikes: PrenotazioneBikeGualti[];
  start: string; // oppure Date, se già convertito
  stop: string;
  pickupLocation: Store;
  dropLocation: Store;
  manutenzione: boolean;
  cancelled: boolean;
  status: 'Cancellato' | 'In corso' | 'Completato' | 'Prenotato';
  createdAt: string;
  problems: string[];
}

export interface PrenotazioneGualti {
  _id: string;
  idUser: UserGualti;
  bikes: PrenotazioneBikeGualti[];
  start: string; // oppure Date, se già convertito
  stop: string;
  pickupLocation: Store;
  dropLocation: Store;
  manutenzione: boolean;
  cancelled: boolean;
  status: 'Cancellato' | 'In corso' | 'Completato' | 'Prenotato';
  createdAt: string;
  problems: string[];
}
export interface UserGualti {
  id: string;
  name: string;
  email: string;
  isOperator: boolean;
  isVerified: boolean;
}
export interface PrenotazioneBikeGualti {
  _id: string;
  id: BikeGualti; // riferimento alla bici completa
  quantity: number;
  accessori: AccessoryGualti[];
  assicurazione: InsuranceGualti | null;
}
export interface BikeGualti {
  _id: string;
  idPuntoVendita: Store;
  idModello: BikeModelGualti;
  quantity: number;
}

export interface BikeModelGualti {
  _id: string;
  descrizione: string;
  type: string;
  size: string;
  elettrica: boolean;
  prezzo: number;
  imgUrl: string;
}

export interface AccessoryGualti {
  _id: string;
  descrizione: string;
  prezzo: number;
}

export interface InsuranceGualti {
  _id: string;
  descrizione: string;
  prezzo: number;
}
export interface StoreGualti {
  _id: string;
  location: string;
}

// prenotazione input
export interface PrenotazioneInput {
  idUser?: string;
  bikes: {
    id: string;
    quantity: number;
    accessori: string[];
    assicurazione?: string;
  }[];
  start: Date;
  stop: Date;
  pickupLocation: string;
  dropLocation: string;
}

export interface PrenotazioneInputPol {
  idUser?: string;
  bikes: {
    id: string;
    quantity: number;
    accessori: AccessoryGualti[];
    assicurazione: InsuranceGualti | null;
  }[];
  start: Date;
  stop: Date;
  pickupLocation: string;
  dropLocation: string;
}

export interface Analytics {
  prenotazioniMeseCorrente: number;
  ricaviMeseCorrente: number;
  biciInNoleggio: number;
  biciInManutenzione: number;
  ricaviUltimi6Mesi: number[];
  prenotazioniUltimi6Mesi: number[];
}

@Injectable({
  providedIn: 'root',
})
export class PrenotazioneService {
  conStr = 'https://cloneride-spa.onrender.com';
  //conStr = 'http://localhost:3001'

  constructor(private http: HttpClient) {}

  addPrenotazioneUnlogged(
    prenotazioneInput: PrenotazioneInput
  ): Observable<Prenotazione> {
    return this.http
      .post<{ message: string; data: Prenotazione }>(
        this.conStr + '/api/bookings/insert',
        prenotazioneInput
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  addPrenotazione(
    prenotazioneInput: PrenotazioneInput
  ): Observable<Prenotazione> {
    return this.http
      .post<{ message: string; data: Prenotazione }>(
        this.conStr + '/api/bookings/insertLogged',
        prenotazioneInput
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  getPrenotazione(id: string): Observable<Prenotazione> {
    return this.http
      .get<{ message: string; data: Prenotazione }>(
        this.conStr + '/api/bookings/detail/' + id
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  getUserPrenotazioni(): Observable<PrenotazioneGualti[]> {
    return this.http
      .get<{ message: string; data: PrenotazioneGualti[] }>(
        this.conStr + '/api/bookings/mie'
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  getPrenotazioniGualti(): Observable<PrenotazioneGualti[]> {
    return this.http
      .get<{ message: string; data: any[] }>(this.conStr + '/api/bookings/all') // cambia '/api/nuova-rotta' con la tua url reale
      .pipe(
        map((response) => {
          // mappiamo ogni oggetto raw nel tipo PrenotazioneGualti
          return response.data.map((item) =>
            this.mapToPrenotazioneGualti(item)
          );
        })
      );
  }

  getAnalytics(): Observable<Analytics> {
    return this.http.get<Analytics>(this.conStr + '/api/bookings/analytics');
  }

  deletePrenotazione(id: string): Observable<PrenotazioneGualti> {
    return this.http
      .put<{ message: string; data: PrenotazioneGualti }>(
        `${this.conStr}/api/bookings/cancel/${id}`,
        null // corpo vuoto, ma serve per non avere errore
      )
      .pipe(map((response) => this.mapToPrenotazioneGualti(response.data)));
  }

  // funzione helper per mappare un singolo oggetto
  private mapToPrenotazioneGualti(raw: any): PrenotazioneGualti {
    return {
      _id: raw._id,
      idUser: {
        id: raw.idUser.id,
        name: raw.idUser.name,
        email: raw.idUser.email,
        isOperator: raw.idUser.isOperator,
        isVerified: raw.idUser.isVerified,
      },
      bikes: raw.bikes.map((b: any) => ({
        _id: b._id,
        id: {
          _id: b.id._id,
          idPuntoVendita: b.id.idPuntoVendita,
          idModello: b.id.idModello,
          quantity: b.id.quantity,
        },
        quantity: b.quantity,
        accessori: b.accessori,
        assicurazione: b.assicurazione,
      })),
      start: raw.start,
      stop: raw.stop,
      pickupLocation: raw.pickupLocation,
      dropLocation: raw.dropLocation,
      manutenzione: raw.manutenzione,
      cancelled: raw.cancelled,
      status: raw.status,
      createdAt: raw.createdAt,
      problems: raw.problems,
    };
  }
}

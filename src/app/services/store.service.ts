import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Store {
  _id?: string;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private conStr = 'https://cloneride-spa.onrender.com';

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http
      .get<{ message: string; data: Store[] }>(this.conStr + '/api/store')
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  createStore(storeInput: Store): Observable<Store> {
    return this.http
      .post<{ message: string; data: Store }>(
        this.conStr + '/api/store',
        storeInput
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  updateStore(storeInput: Store): Observable<Store> {
    return this.http
      .put<{ message: string; data: Store }>(
        this.conStr + '/api/store/modify/' + storeInput._id,
        storeInput
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }

  deleteStore(id: string): Observable<Store> {
    return this.http
      .delete<{ message: string; data: Store }>(
        this.conStr + '/api/store/' + id
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }
}

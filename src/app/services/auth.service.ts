import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, tap } from "rxjs"
import { JwtService } from "./jwt.service";

export interface User {
    id: string;
    name: string;
    email: string;
    isOperator: boolean;
    isVerified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _currentUser$ = new BehaviorSubject<User | null>(null);
    currentUser$ = this._currentUser$.asObservable();

    conStr: string = 'https://cloneride-spa.onrender.com'

    constructor(private jwtSrv: JwtService,
        private http: HttpClient,
        private router: Router) {
        this.fetchUser();
    }

    isLoggedIn() {
        return this.jwtSrv.hasToken();
    }

    login(email: string, password: string) {
        return this.http.post<{ user: User, token: string }>(this.conStr + '/api/auth/login', { email, password })
            .pipe(
                tap(res => this.jwtSrv.setToken(res.token)),
                tap(res => this._currentUser$.next(res.user)),
                map(res => res.user)
            );
    }

    register(name: string, email: string, password: string) {
        return this.http.post<User>(this.conStr + '/api/auth/register', { name, email, password });
    }

    logout() {
        this.jwtSrv.removeToken();
        this._currentUser$.next(null);
        this.router.navigate(['/']);
    }

    verifyEmail(token: string) {
        return this.http.get(this.conStr + '/api/auth/verify-email/' + token, { observe: 'response' });
    }

    private fetchUser() {
        this.http.get<User>(this.conStr + '/api/auth/me')
            .subscribe(user => this._currentUser$.next(user));
    }

    fetchUsers(): Observable<User[]> {
        return this.http.get<User[]>('/api/users/auth/operators');
    }
}

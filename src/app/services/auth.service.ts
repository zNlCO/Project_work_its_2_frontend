import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, of, tap } from "rxjs"
import { JwtService } from "./jwt.service";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    picture: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _currentUser$ = new BehaviorSubject<User | null>(null);
    currentUser$ = this._currentUser$.asObservable();

    private _users$ = new BehaviorSubject<User[] | null>(null);
    users$ = this._users$.asObservable();

    constructor(private jwtSrv: JwtService,
        private http: HttpClient,
        private router: Router) {
        this.fetchUser();
    }

    isLoggedIn() {
        return this.jwtSrv.hasToken();
    }

    login(username: string, password: string) {
        return this.http.post<{ user: User, token: string }>('/api/login', { username, password })
            .pipe(
                tap(res => this.jwtSrv.setToken(res.token)),
                tap(res => this._currentUser$.next(res.user)),
                map(res => res.user)
            );
    }

    register(name: string, username: string, password: string) {
        return this.http.post<User>('/api/register', { name, username, password });
    }

    logout() {
        this.jwtSrv.removeToken();
        this._currentUser$.next(null);
        this.router.navigate(['/']);
    }

    private fetchUser() {
        this.http.get<User>('/api/users/me')
            .subscribe(user => this._currentUser$.next(user));
    }

    fetchUsers() {
        this.http.get<User[]>('/api/users/fetch')
            .subscribe(users => this._users$.next(users));
    }
}

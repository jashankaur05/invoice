import { Observable, switchMap, of } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CryptoEncryptionService } from './crypto-encryption.service';
import { AppConfig } from 'src/app/app-config';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    static readonly JWT_SESSION_STORAGE_KEY: string = 'token';
    static readonly USER_SESSION_STORAGE_KEY: string = 'currentUser';


    private _token: string | null = null;

    private _currentUser: LoginResponse | null = null;

    set token(token: string | null) {
        this._token = token;
    }
    get token(): string | null {
        if (!this._token) {
            this._token = this.getToken();
        }
        return this._token;
    }

    private http: HttpClient;
    constructor(handler: HttpBackend,
        private readonly router: Router,
        public readonly encryptor: CryptoEncryptionService
        ) {
        this.http = new HttpClient(handler);
    }


    isTokenValid(token: string | null = this.token): boolean {

        if (!token) {
            return false;
        }

        const expirationDate = this.getTokenExpirationDate(token);

        if (!expirationDate) {
            return true;
        }

        return expirationDate.valueOf() > new Date().valueOf();
    }

    getTokenExpirationDate(token: string): Date | null {

        const decoded: any = jwtDecode(token);

        if (decoded.exp === undefined) {
            return null;
        }

        const date: Date = new Date(0);
        date.setUTCSeconds(decoded.exp);

        return date;
    }


    logout(): void {

        this.clearCurrentUser()
        this.router.navigateByUrl(AppConfig.LOGIN_PATH);
    }


    login(credentials: LoginRequest): Observable<LoginResponse> {

        this.token = null;

        localStorage.removeItem(LoginService.JWT_SESSION_STORAGE_KEY);

        const credCopy = structuredClone(credentials);
        credCopy.password = this.encryptor.encryptAES(credCopy.password);
        const {remember, ...cred} = credCopy;

        let $ =  this.http.post<LoginResponse>(AppConfig.apiUrl + AppConfig.LOGIN_PATH, cred);

        $ = $.pipe( switchMap((response) => {

                sessionStorage.setItem(LoginService.JWT_SESSION_STORAGE_KEY, response.accessToken);

                this.saveCurrentUserSession(response);

                if (credentials.remember) {
                    localStorage.setItem( LoginService.JWT_SESSION_STORAGE_KEY, response.accessToken );
                }

                return of(response);
            })
        );

        return $;
    }

    get currentUser(): LoginResponse | null {

        if (!this._currentUser) {
            const currentUserJson = sessionStorage.getItem(LoginService.USER_SESSION_STORAGE_KEY);
            this._currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
        }

        return this._currentUser;
    }

    private getToken(): string | null {

        return (
            localStorage.getItem(LoginService.JWT_SESSION_STORAGE_KEY) ??
            sessionStorage.getItem(LoginService.JWT_SESSION_STORAGE_KEY)
        );
    }


    private saveCurrentUserSession(currentUser: LoginResponse): void {

        sessionStorage.setItem(LoginService.USER_SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    }

    private clearCurrentUser(): void {

        sessionStorage.removeItem(LoginService.JWT_SESSION_STORAGE_KEY);
        localStorage.removeItem(LoginService.JWT_SESSION_STORAGE_KEY);
        this._currentUser = null;
        sessionStorage.removeItem(LoginService.USER_SESSION_STORAGE_KEY);
    }
}

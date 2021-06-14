import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { User } from "./user.model";

export interface AuthResponseData {
    email: string,
    idToken: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBexegqVohoJHYXKLtYf8QQaxYte4BGASU',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(errorRes => {
            console.log(errorRes);
            return throwError(this.convertErrorMessage(errorRes?.error?.error?.message));
        }),
        tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBexegqVohoJHYXKLtYf8QQaxYte4BGASU',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(errorRes => {
            console.log(errorRes);
            return throwError(this.convertErrorMessage(errorRes?.error?.error?.message));
            }),
        tap(resData =>
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        ));
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) return;
        
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }

    }

    logout() {
        console.log(this.user)
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
      }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration)
    }

    private handleAuthentication(email: string, userID: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userID, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    private convertErrorMessage(message: string): string {
        switch (message) {
            case 'EMAIL_EXISTS':
                return 'This email exists already';
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                return 'Too many login attempts, try again later';
            case 'EMAIL_NOT_FOUND':
                return 'Email not found';
            case 'INVALID_PASSWORD':
                return 'Invalid password'
            case 'USER_DISABLED':
                return 'User disabled';
            default:
                return 'An unknown error occured';
        }
    }
}


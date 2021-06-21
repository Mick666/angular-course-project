import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    email: string,
    idToken: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

const handleAuthentication = (resData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate)
    localStorage.setItem('userData', JSON.stringify(user))
    return new AuthActions.AuthenticateSuccess({ 
        email: resData.email, 
        userID: resData.localId, 
        token: resData.idToken, 
        expirationDate: expirationDate
    })
}

const handleError = (error) => {
    return of(new AuthActions.AuthenticateFail(convertErrorMessage(error.error.error.message)));
}

const convertErrorMessage = (message: string): string => {
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

@Injectable()
export class AuthEffects {
    constructor(
            private actions$: Actions,
            private http: HttpClient,
            private router: Router,
            private authService: AuthService
        ){}

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                map(resData => handleAuthentication(resData)),
                catchError(error => handleError(error))
            );
        }),
    )

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                map(resData => handleAuthentication(resData)),
                catchError(error => handleError(error))
            )
        })
    )

    @Effect({ dispatch: false })
    authLogout = this.actions$
        .pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        )
    
    @Effect()
    autoLogin = this.actions$
        .pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                    const userData: {
                        email: string;
                        id: string;
                        _token: string;
                        _tokenExpirationDate: string;
                    } = JSON.parse(localStorage.getItem('userData'));
                    if (!userData) return;
                    
                    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

                    if (loadedUser.token) {
                        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                        tap(resData => this.authService.setLogoutTimer(expirationDuration))
                        return new AuthActions.AuthenticateSuccess({ 
                                email: userData.email,
                                userID: userData.id,
                                token: userData._token,
                                expirationDate: new Date(userData._tokenExpirationDate) 
                            })
                        
                        // this.autoLogout(expirationDuration);
                    }
                    return { type: 'DUMMY' }
            })
        )
    
    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
      tap(() => {
        this.router.navigate(['/']);
      })
    );
}
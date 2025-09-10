import { inject } from '@angular/core';
import { catchError, exhaustMap, from, map, of, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

export const login = createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService), router = inject(Router)) => {
        return actions$.pipe(
            ofType(AuthActions.login),
            exhaustMap(() =>
                from(authService.loginWithGoogle()).pipe(
                    map(() => {
                        router.navigate(['/dashboard']);
                        return AuthActions.loginSuccess()
                    }),
                    catchError((error: { message: string }) =>
                        of(AuthActions.loginFailure({ error: error.message }))
                    )
                )
            )
        );
    },
    { functional: true }
);
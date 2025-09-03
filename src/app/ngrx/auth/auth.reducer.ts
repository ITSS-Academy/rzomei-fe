import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.state";
import * as AuthActions from "./auth.actions";

const initialState: AuthState = {
    authInfo: null,
    token: null,
    error: null,
    loginSuccess: false
};


export const authReducer = createReducer(
    initialState,


    on(AuthActions.login, (_, { type }) => {
        console.log(type);
        return<AuthState>{
            ...initialState
        }
    }),

    on(AuthActions.loginSuccess, (state, {type}) => {
        console.log(type);
        return<AuthState>{
            ...state,
            loginSuccess: true
        }
    }),

    on(AuthActions.loginFailure, (state, {type, error}) => {
        console.log(type);
        return<AuthState>{
            ...state,
            error: error
        }
    }),

    on(AuthActions.storeAuth, (state, {type, authInfo, token}) => {
        console.log(type);
        return<AuthState>{
            ...state,
            authInfo: authInfo,
            token: token
        }
    }),

    on(AuthActions.clearAuth, (_, {type}) => {
        console.log(type);
        return<AuthState>{
            ...initialState
        }
    })


)
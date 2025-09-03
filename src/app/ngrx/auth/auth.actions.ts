import { createAction, props } from "@ngrx/store";
import { AuthModel } from "../../models/auth.model";

export const login = createAction("[Auth] Login");
export const loginSuccess = createAction("[Auth] Login Success");
export const loginFailure = createAction("[Auth] Login Failure", props<{ error: any }>());

export const storeAuth = createAction("[Auth] Store Auth", props<{ authInfo: AuthModel, token: string }>());

export const clearAuth = createAction("[Auth] Clear Auth");
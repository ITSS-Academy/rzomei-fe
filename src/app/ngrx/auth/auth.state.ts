import { AuthModel } from "../../models/auth.model";

export interface AuthState {
    authInfo: AuthModel | null;
    token: string | null;

    error: any | null;

    loginSuccess: boolean;
}
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  async loginWithGoogle() {
    const credential = await signInWithPopup(
      this.auth,
      new GoogleAuthProvider()
    );
    const token = await credential.user.getIdToken();
    return { user: credential.user, token };
  }

  logout() {
    return this.auth.signOut();
  }
}

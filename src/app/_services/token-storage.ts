import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode'

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem("auth-token");
    if (user) {
      return jwt_decode(user);
      // return JSON.parse(user);
    }

    return {};
  }

  saveUserobject(user: PublicKeyCredentialUserEntity) {
    window.sessionStorage.setItem("UserObject", JSON.stringify(user));
  }

  getUserObject() {
    const userString = window.sessionStorage.getItem("UserObject");
    if (userString) {
      const user = JSON.parse(userString);
      return {
        accountNonExpired: true,
        accountNonLocked: true,
        adress: user.adress,
        authorities: user.authorities,
        cin: user.cin,
        city: user.city,
        credentialsNonExpired: true,
        deliveries: [],
        enabled: true,
        firstname: user.firstname,
        id: user.id,
        image: user.image,
        lastname: user.lastname,
        orders: [],
        password: user.password,
        products: [],
        role: user.role,
        telephone: user.telephone,
        username: user.username,
        isactive:user.isActive
      };
    }

    return null;
  }

}

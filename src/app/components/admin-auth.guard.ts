// admin-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {TokenStorageService} from "../_services/token-storage";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  user:any
  isAdmin:boolean = false
  constructor(private router: Router,private tokenStorage:TokenStorageService) {}

  canActivate(): boolean {
    this.user = this.tokenStorage.getUserObject();
    if (this.user) {
      if (this.user.role === "ADMIN") {
        console.log(this.user.role);
        this.isAdmin==true;
      }
      else {
        this.isAdmin==false;
      }
    }
    // Replace this logic with how you check the user's role or any other authentication mechanism.

    if (!this.isAdmin) {
      // Redirect to another route if the user is not an admin (e.g., the home page).
      this.router.navigate(['/Admin']);
      return false;
    }

    return true;
  }
}

import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../_services/token-storage";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  userName: string = '';
  role: string = '';
  isDropdownOpen: boolean = false;
  nbproduct: any;

  constructor(private tokenStorage: TokenStorageService,private router:RouterModule) { }

  ngOnInit() {
    const user = this.tokenStorage.getUserObject();
    if (user) {
      console.log(this.tokenStorage.getUserObject());
      this.loggedIn = true;
      this.userName = user.firstname+' '+user.lastname;
      this.role = user.role;
      console.log(this.role);
    }
    this.nbproduct=this.getCartItemCount()
    console.log(this.nbproduct);
  }
  getCartItemCount(): number {
    // Step 1: Get the cart items from sessionStorage
    const cartItemsString = sessionStorage.getItem('cartItems');

    // Step 2: Parse the cart items string into an array
    const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

    // Step 3: Return the count of IDs in the cartItems array
    return cartItems.length;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  viewProfile() {
    window.location.href = '/profile';  }
  logout() {
    this.tokenStorage.signOut();
    location.reload();
    this.userName="";
  }
}

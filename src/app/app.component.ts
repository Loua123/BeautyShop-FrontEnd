import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import {TokenStorageService} from "./_services/token-storage";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUsername: string;
  isStoreRoute: boolean;
  user:any;
  role: any;
  constructor(public location: Location,private tokenStorage:TokenStorageService) {
    this.currentUsername = window.sessionStorage.getItem('username');

    this.user = this.tokenStorage.getUserObject();
    if (this.user)
    {
      this.role=this.user.role;

    }
  }

  addUsername(username: string) {
    window.sessionStorage.setItem('username', username);
    this.currentUsername = window.sessionStorage.getItem('username');
  }

  ngOnInit() {
    const isEmpty = this.isLocalStorageEmpty();

    if (isEmpty) {
      this.currentUsername = null;
    }
  }

  isMap(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
      return false;
    } else {
      return true;
    }
  }

  private isLocalStorageEmpty(): boolean {
    return Object.keys(window.sessionStorage).length === 0;
  }
}

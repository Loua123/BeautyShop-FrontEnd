import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../_services/auth.service";

@Component({
  selector: 'app-gestion-users',
  templateUrl: './gestion-users.component.html',
  styleUrls: ['./gestion-users.component.css']
})
export class GestionUsersComponent implements OnInit {
  listofusers:any;

  constructor(private authservice:AuthService) { }

  ngOnInit(): void {
    this.authservice.getAllUsers().subscribe((users) => {
      this.listofusers=users;
    })
  }

}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../_services/auth.service";
import {TokenStorageService} from "../../_services/token-storage";

@Component({
  selector: 'app-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.css']
})
export class SucessComponent implements OnInit {
user:any
  constructor(private route: ActivatedRoute,private authService:AuthService,private tokenStorage:TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUserObject();
    // You can access query parameters returned by Stripe here, if needed
    this.route.queryParams.subscribe((params) => {
      console.log(params)
      if (params['iduser']==null &&   params['orderId']==null)
      {
        location.href='/'
      }
      this.authService.addSales(params['iduser'],this.user.id,params['orderId']).subscribe((response)=>{
        console.log(response)
      })
    });
  }

}

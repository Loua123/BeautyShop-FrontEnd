import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../_services/auth.service";

@Component({
  selector: 'app-listproducts',
  templateUrl: './listproducts.component.html',
  styleUrls: ['./listproducts.component.css']
})
export class ListproductsComponent implements OnInit {
  listofproducts: any;

  constructor(private authservice:AuthService) { }

  ngOnInit(): void {
    this.authservice.getAllproducts().subscribe((products) => {
      console.log(products)
      this.listofproducts=products;
    })
  }

}

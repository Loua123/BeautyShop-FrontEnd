import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../_services/auth.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private authservice:AuthService) { }
  lineChartData: any[] = [
    { data: [1, 3, 4, 1, 0, 2, 4], label: 'Vente',
      backgroundColor: 'rgba(99,130,255)', // Set the background color of the line
      borderColor: 'rgb(99,130,255)',},
    // You can add more datasets if needed
  ];
  lineChartData2: any[] = [
    { data: [5, 10, 12, 11.2, 6.4, 8.9, 2.6], label: 'Benefice',
      backgroundColor: 'rgb(60,98,38)', // Set the background color of the line
      borderColor: 'rgb(99,130,255)',},
    // You can add more datasets if needed
  ];

  lineChartLabels: string[] = ['Vendeur :annie', 'Vendeur :kosyt', 'Vendeur :John', 'Vendeur :Loua', 'Vendeur :Benger', 'Vendeur :Juis', 'Vendeur :Astro'];
  lineChartLabels1: string[] = ['Order :1', 'Order :2', 'Order :3', 'Order :4', 'Order :5', 'Order :6', 'Order :7'];


  lineChartOptions: any = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

nbusers: number;
nbstores: number;
nvsells: number;
wallet: any;
  ngOnInit(): void {
this.authservice.getAllStores().subscribe((stores) => {
  this.nbstores=stores.length;
  console.log(this.nbstores);
})
    this.authservice.getAllUsers().subscribe((users) => {
      this.nbusers=users.length;
    })
  }

}

import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../_services/auth.service";
import {TokenStorageService} from "../../../_services/token-storage";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private authservice:AuthService,private tokenStorage: TokenStorageService) { }
  lineChartData: any[] = []; // Initialize as an empty array

  lineChartData2: any[] = [
    { data: [5, 10, 12, 11.2, 6.4, 8.9, 2.6], label: 'Benefice',
      backgroundColor: 'rgb(60,98,38)', // Set the background color of the line
      borderColor: 'rgb(99,130,255)',},
    // You can add more datasets if needed
  ];

  lineChartLabels: string[] = [];
  lineChartLabels1: string[] = ['Order :1', 'Order :2', 'Order :3', 'Order :4', 'Order :5', 'Order :6', 'Order :7'];


  lineChartOptions: any = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

nbusers: number;
nbstores: number;
nbsells: any;
countselles:number;
wallet: any;
  listvendeur: any[] = []; // Initialize listvendeur as an array to hold the extracted data.
  listbeneficie: any[] = []; // Initialize listvendeur as an array to hold the extracted data.

  ngOnInit(): void {
    this.authservice.GetallSales().subscribe((sales) => {
      // Ensure this.nbsells is an array, even if it's a single number
      this.nbsells = Array.isArray(sales) ? sales : [sales];
      console.log(this.nbsells);
      this.countselles=this.nbsells.length
    });

    this.authservice.getVendeurlist().subscribe((vendeurlist) => {
      this.listvendeur = vendeurlist.map((vendeur) => {
        return {
          id: vendeur.id,
          firstname: vendeur.firstname,
          lastname: vendeur.lastname,
          vente: 0
        };
      });

      // Update vente property based on this.nbsells
      this.listvendeur.forEach((vendeur) => {
        this.nbsells.forEach((sale) => {
          if (sale.idSeller === vendeur.id) {
            vendeur.vente += 1;
          }
        });
      });

      console.log('List of Vendeurs:', this.listvendeur);

      if (this.listvendeur && this.listvendeur.length > 0) {
        // Dynamically generate the lineChartLabels based on this.listvendeur
        this.lineChartLabels = this.listvendeur.map((vendeur) => {
          return `Vendeur: ${vendeur.firstname} ${vendeur.lastname}`;
        });
      } else {
        console.error('this.listvendeur is empty or not populated correctly.');
      }
      // Create an array of values representing sales for each user
      const salesData = this.listvendeur.map((vendeur) => vendeur.vente);

      // Create a single dataset with the sales data
      this.lineChartData = [
        {
          data: salesData,
          label: 'Vente', // You can set a common label for all users
          backgroundColor: 'rgba(99,130,255)', // Set the background color of the bars
          borderColor: 'rgb(99,130,255)',
        }
      ];
    });

    this.authservice.getAllStores().subscribe((stores) => {
      this.nbstores = stores.length;
      console.log('Number of Stores:', this.nbstores);
    });

    this.authservice.getAllUsers().subscribe((users) => {
      this.nbusers = users.length;
      console.log('Number of Users:', this.nbusers);
    });


  }


  logout() {
    this.tokenStorage.signOut();
    location.reload();
  }
}

import { Component, OnInit } from '@angular/core';
import {ChartDataset, ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'app-stat-vente',
  templateUrl: './stat-vente.component.html',
  styleUrls: ['./stat-vente.component.css']
})
export class StatVenteComponent implements OnInit {
  lineChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    // You can add more datasets if needed
  ];

  lineChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  lineChartOptions: any = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  constructor() { }

  ngOnInit(): void {
  }

}

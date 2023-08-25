import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {

  constructor(private http:HttpClient) { }
  getallproduct(){
    return this.http.get(`${environment.basaeurl}getAllProducts`)
  }
}

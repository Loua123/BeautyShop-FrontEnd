import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryserviceService {
 
  constructor(private http:HttpClient) { }
  getallcategory(){
  return this.http.get(`${environment.basaeurl}/category`)}
}



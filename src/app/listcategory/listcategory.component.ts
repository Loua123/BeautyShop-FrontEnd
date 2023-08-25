import { Component, OnInit } from '@angular/core';
import { CategoryserviceService } from '../_services/categoryservice.service';

@Component({
  selector: 'app-listcategory',
  templateUrl: './listcategory.component.html',
  styleUrls: ['./listcategory.component.css']
})
export class ListcategoryComponent implements OnInit {
  listcategory: any
  category:any

  constructor(private CategoryService:CategoryserviceService) { }
  ngOnInit(): void {

  }
  getallcategory(){
    this.CategoryService.getallcategory().subscribe((res:any)=>{
      this.listcategory=res
      console.log("list of category ", this.listcategory)
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from "../../_services/auth.service";
import {createClient, SupabaseClient} from "@supabase/supabase-js";

@Component({
  selector: 'app-detailsproduct',
  templateUrl: './detailsproduct.component.html',
  styleUrls: ['./detailsproduct.component.css']
})
export class DetailsproductComponent implements OnInit {
  productId: string; // or number, depending on your ID type
  product:any;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  constructor(private route: ActivatedRoute,private authService:AuthService) {}
  ngOnInit(): void {
    // Access the 'id' parameter from the URL
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');

    });
    this.authService.getProductByID(this.productId).subscribe(async (result) => {
      this.product = result
      this.product.image = await this.getImageUrl(this.product.image)
      console.log(this.product.image)
    })

  }
  async getImageUrl(imageName: string): Promise<string> {
    try {
      const {data} = await this.supabase.storage
        .from('images/Products')
        .getPublicUrl(imageName);
      const imageUrl = data.publicUrl;
      return imageUrl;
    } catch (error) {
      console.error('Failed to get image URL:', error);
      throw new Error('Failed to get image URL');
    }
  }
}


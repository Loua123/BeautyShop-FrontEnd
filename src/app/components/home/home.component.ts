import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listofProducts: any[] = [];
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  constructor(private authservice:AuthService) { }

  ngOnInit(): void {
    this.authservice.getAllproducts().subscribe(async products => {
      this.listofProducts = products
      for (let i = 0; i < this.listofProducts.length; i++) {
        try {
          const imageUrl = await this.getImageUrl(this.listofProducts[i].image);
          this.listofProducts[i].image = imageUrl;

        } catch (error) {
          console.error('Error getting image URL for product:', error);
        }
      }
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
  getCartItems(): number[] {
    const cartItemsString = sessionStorage.getItem('cartItems');
    return cartItemsString ? JSON.parse(cartItemsString) : [];
  }
  addToCart(id: number) {

    // Get the existing cart items from sessionStorage
    const cartItems = this.getCartItems();
    // Add the new item to the cart items array
    cartItems.push(id);
    // Save the updated cart items array back to sessionStorage
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    Swal.fire('Succès', 'Votre produit a été ajouté au panier avec succès.', 'success')
    // Optionally, you can also add some logic here to handle other cart-related operations.
  }
}

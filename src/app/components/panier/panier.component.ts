import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";
import {TokenStorageService} from "../../_services/token-storage";

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  constructor(private authservice:AuthService,private tokenStorage:TokenStorageService) { }
  user:any;
  quantity: number = 1;
  listproducttoShop: any[] = [];
  total:number=0;
  orderDetails: { productId: number; quantity: number }[] = [];
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  ngOnInit(): void {
    this.user = this.tokenStorage.getUserObject();

    // Step 1: Get the cart items from sessionStorage
    const cartItems = this.getCartItems();

    // Step 2: Use each cart item ID to fetch the product and add it to listproducttoShop
    for (const itemId of cartItems) {
      this.authservice.getProductByID(itemId).subscribe(
        async (product) => {
          // Convert the product price to a number before adding it to the total
          product.price = parseFloat(product.price);
          const imgurl = product.image
          product.image = await this.getImageUrl(imgurl)
          product.quantity=1
          // Step 3: Push the product object to the listproducttoShop array
          this.listproducttoShop.push(product);
          // Step 4: Add the product price to the total
          this.total += product.price;
        },
        (error) => {
          console.error(`Error fetching product with ID ${itemId}:`, error);
        }
      );
    }

  }

// Step 1: Create a function to get the cart items from sessionStorage
  getCartItems(): number[] {
    const cartItemsString = sessionStorage.getItem('cartItems');
    return cartItemsString ? JSON.parse(cartItemsString) : [];
  }
// Step 4: Calculate the total price

  removeProductFromCart(product: any): void {
    // Show the confirmation dialog
    Swal.fire({
      title: 'Vous souhaitez supprimer cet élément de votre panier ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      // If the user clicks "Oui", proceed with removing the product
      if (result.isConfirmed) {
        const index = this.listproducttoShop.indexOf(product);
        if (index !== -1) {
          this.listproducttoShop.splice(index, 1);
          const prix = parseFloat(product.price);
          this.total = this.total - prix;

          // Get the current cart items from sessionStorage
          const cartItemsString = sessionStorage.getItem('cartItems');
          const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

          // Find the index of the product ID in the cartItems array
          const productIdIndex = cartItems.indexOf(product.id);

          // If the product ID is found in the cartItems array, remove it
          if (productIdIndex !== -1) {
            cartItems.splice(productIdIndex, 1);
            // Update the cartItems in sessionStorage with the updated array
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
          }
        }
      }
    });
  }


  pay(id) {

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
  confirmOrder(): void {
    this.orderDetails = [];

    // Step 3: Loop through the listproducttoShop array to extract the IDs and quantities
    this.listproducttoShop.forEach((product) => {
      if (product.quantity > 0) {
        this.orderDetails.push({ productId: product.id, quantity: product.quantity });
      }
    });

    // Step 4: Show SweetAlert dialog
    Swal.fire({
      title: 'Confirmer votre commande?',
      text: 'Êtes-vous sûr de vouloir valider votre commande?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Oui", you can proceed with further actions
        // For example, you can send the order details to the server here
        this.authservice.addcommande(this.orderDetails, this.user.id,this.listproducttoShop[0].store.user.id).subscribe(
          (result) => {
            // Handle success response here
            Swal.fire('Commande validée!', 'Votre commande a été confirmée avec succès!', 'success')
              .then(() => {
                sessionStorage.removeItem('cartItems')
                location.href="/Commande"
            });
          },
          (error) => {
            // Handle error response here
            console.error("Error adding order:", error);
          }
        );
        // Show a success message to the user
      } else {
        // User clicked "Non", show a message
        Swal.fire('Votre panier est toujours disponible', 'Valider votre commande :)', 'info');
      }
    });
  }

}

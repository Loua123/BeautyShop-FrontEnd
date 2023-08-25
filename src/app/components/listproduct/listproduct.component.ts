import { Component, OnInit } from '@angular/core';
import { ProductserviceService } from '../../_services/productservice.service';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.css']
})
export class ListproductComponent implements OnInit {
  listproduct: any
  showSubMenu = false;
  product: any;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  filteredProducts: any[] = [];
  filterValue: string; // Make sure filterValue is defined here
  selectedSortOption: string = 'low'; // Default sorting option
  category: string;
  isCatExecuted: boolean = false;

  constructor(private ProductService:ProductserviceService,private route: ActivatedRoute) { }
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.category = params['category'];
      if (this.category!=null) {
        this.getallcatproduct(this.category)
      }else
      {
        this.getallproduct();
      }
    });

    this.filterValue = ''; // Initialize filterValue
    this.filteredProducts = []; // Initialize filteredProducts

  }
  getallcatproduct(cat: string) {
    this.isCatExecuted = true;
    this.filteredProducts=null;
    this.ProductService.getallproduct().subscribe(async (res: any) => {
      this.listproduct = res;
      this.filteredProducts = []; // Clear previous filtered products

      for (let i = 0; i < this.listproduct.length; i++) {
        const productCategory = this.listproduct[i].categories.toLowerCase();
        if (productCategory === cat.toLowerCase()) {
          try {
            const imageUrl = await this.getImageUrl(this.listproduct[i].image);
            this.listproduct[i].image = imageUrl;
            this.filteredProducts.push(this.listproduct[i]); // Add the matching product to the filteredProducts array
          } catch (error) {
            console.error('Error getting image URL for product:', error);
          }
        }

      }
    });
  }

    getallproduct(){
      this.filteredProducts=null;

      this.ProductService.getallproduct().subscribe(async (res: any) => {
        this.listproduct = res
        for (let i = 0; i < this.listproduct.length; i++) {
          try {
            const imageUrl = await this.getImageUrl(this.listproduct[i].image);
            this.listproduct[i].image = imageUrl;

          } catch (error) {
            console.error('Error getting image URL for product:', error);
          }
        }
        this.filteredProducts = this.listproduct; // Initialize filteredProducts with all products
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
  filterProducts(searchTerm: string): void {

    searchTerm = searchTerm.toLowerCase();

    if (!searchTerm) {
      this.filteredProducts = this.listproduct.slice(); // Reset filtered products if search term is empty
      return;
    }
console.log(searchTerm)
console.log(this.filteredProducts)
    this.filteredProducts = this.listproduct.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.categories.toLowerCase().includes(searchTerm)
      // Add more conditions for other attributes if needed
    );
  }
  applySorting(): void {
    if (this.selectedSortOption === 'low') {
      this.filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (this.selectedSortOption === 'high') {
      this.filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (this.selectedSortOption === 'latest') {
      // No sorting needed, keep the original order
      this.filteredProducts = [...this.listproduct]; // Copy the original array
    }
  }
}

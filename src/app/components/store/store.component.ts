import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../_services/token-storage";
import {AuthService} from "../../_services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";
export class Product {
  name: string;
  price: string;
  description: string;
  image: string;
  categories: string;
  soucat: string;
  idstore: number;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  form: FormGroup;
  user: any;
  listofStores: any[] = [];
  listofProducts: any[] = [];
  showVentes = false;
  showForm = false; // Set initial value to hide the form
  file: File = null;
  optionsList: any;
  producttoAdd: any;
  productforPromotion:any;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  prod
  isLoading: boolean;
  imageUrl: string;

  constructor(private tokenStorage: TokenStorageService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.form = this.formBuilder.group({
      titre: ['', Validators.required], // Title is required
      Description: ['', Validators.required], // Description is required
      categories: ['', Validators.required], // Category is required
      souscat: ['', Validators.required], // Subcategory is required
      Promotion: '', // Optional field
      profilePicture: [null, Validators.required], // Profile Picture is required
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Prix is required and must be a centime value
    });
    this.producttoAdd = new Product();

    // If you have a default option for 'optionsList', you can set the initial value for 'product.souscat' here
    // this.product.souscat = yourDefaultValue;
  }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUserObject();
    this.authService.getAllStoresbyuser(this.user.id).subscribe(data => {
      this.listofStores = data
      this.authService.getProductByStore(this.listofStores[0].id).subscribe(async data => {
        this.listofProducts = data
        for (let i = 0; i < this.listofProducts.length; i++) {
          try {
            const imageUrl = await this.getImageUrl(this.listofProducts[i].image);
            this.listofProducts[i].image = imageUrl;
          } catch (error) {
            console.error('Error getting image URL for product:', error);
          }
        }
      })
    })

  }

  async submitForm() {
    this.producttoAdd.name = this.form.get('titre')?.value;
    this.producttoAdd.description = this.form.get('Description')?.value;
    this.producttoAdd.categories = this.form.get('categories')?.value;
    this.producttoAdd.soucat = this.form.get('souscat')?.value;
    this.producttoAdd.price = this.form.get('price')?.value;
    this.producttoAdd.idstore = this.listofStores[0].id;

    if (this.file) {
      const filePath = `Products/${this.file.name}`; // Specify the desired file path in the storage bucket
      this.isLoading = true; // Activer l'état de chargement
      try {
        const {data, error} = await this.supabase.storage
          .from('images')
          .upload(filePath, this.file);

        if (error) {
          console.error('Failed to upload file:', error);
          // Handle the failure case
          Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
          return;
        }
        this.isLoading = false; // Activer l'état de chargement

        this.producttoAdd.image = this.file.name; // Assign the file path to the Userregister object
        this.authService.addProduct(this.producttoAdd).subscribe(
          (result) => {
            this.isLoading = false; // Activer l'état de chargement
            Swal.fire('Succès', 'Produit ajoutée avec succes', 'success')
              .then(() => {
                window.location.href = '/store';
              });
          },
          (error) => {
            // Handle errors that occurred during the HTTP request.
            Swal.fire('Erreur', 'Veuillez vérifier les champs du formulaire', 'error');
          }
        );

      } catch (error) {
        console.error('Failed to upload file:', error);
        // Handle the failure case
        Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
        return;
      }
    }


  }

  uploadfile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  loadsouscat(selectedCategory: string) {
    if (selectedCategory == "ONGLE") {
      this.optionsList = [
        "Vernis a ongle ",
        "Base et top coat",
        "Autre produit spécifique ongle",
        // Add more options here as needed
      ];
    } else if (selectedCategory == "LÈVRES") {
      this.optionsList = [
        "Crayon à lèvres \n",
        "Rouge à lèvres",
        "Rouge à lèvres liquide/ gloss\n",
        // Add more options here as needed
      ];
    } else if (selectedCategory == "YEUX") {
      this.optionsList = [
        "Palette yeux \n",
        "Mascara",
        "Sourcils",
        "Fard à paupières \n",

        // Add more options here as needed
      ];
    } else if (selectedCategory == "TEINT") {
      this.optionsList = [
        "Palette teint \n",
        "Base de teint \n",
        "Fond de teint \n",
        "Fard à joues/ bronzer\n \n",
        "Highlighter / contouring \n",
        // Add more options here as needed
      ];
    } else if (selectedCategory == "SOINS CORPS") {
      this.optionsList = [
        "Déodorant",
        "Savon liquide \n",
        "Gel douche",
        // Add more options here as needed
      ];
    } else if (selectedCategory == "SOINS VISAGE") {
      this.optionsList = [
        "soins hydratant",
        "Masque",
        "gommage",
        "Démaquillant",
        "nettoyant",
        // Add more options here as needed
      ];
    } else if (selectedCategory == "SOIN MAIN") {
      this.optionsList = [
        "--",

        // Add more options here as needed
      ];
    } else if (selectedCategory == "SOIN PIED") {
      this.optionsList = [
        "--",
        // Add more options here as needed
      ];
    } else if (selectedCategory == "SHAMPOING") {
      this.optionsList = [
        "shampoing sec",
        "Shampoing sans sulfate",
        "Shampoing normale",
        // Add more options here as needed
      ];
    }
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

  deleteProduct(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteProduct(id).subscribe(
          () => {

          },
          (error) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Product has been deleted.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Reload the page or redirect to a different route
              window.location.reload(); // Reloading the current page
              // You can also use Angular Router to navigate to a different route if needed
            });
          }
        );
      }
    });
  }

  Viewproduct(id) {

  }

  Updateproduct(id) {


  }

  async applypromo(id: number): Promise<void> {
    try {
      // Display a SweetAlert2 input modal to prompt the user to enter a float value
      const { value: discountValue } = await Swal.fire({
        title: 'Promotion',
        input: 'number',
        inputLabel: 'Reduction:',
        inputPlaceholder: 'Reduction',
        showCancelButton: true,
        inputValidator: (value) => {
          // Validate the user input (optional)
          if (!value) {
            return 'Please enter a valid positive float value';
          }
          return null; // Return null if the input is valid
        },
      });

      // If the user clicks on "Confirm" (Oui), and the discount value is valid
      if (discountValue) {
        // Convert the input value to a float (assuming the input is a valid number)
        const discountAmount = parseFloat(discountValue);
        this.authService.getProductByID(id).subscribe((product) => {
          this.productforPromotion=product;
          this.authService.addPromotion(this.productforPromotion.id, this.productforPromotion.price-discountAmount).subscribe((result)=>{
            console.log(result);
          })
        })
        // Apply the discount amount to the cart total
        // Display a success message with the applied discount amount
        Swal.fire({
          title: 'Promotion Applied!',
          text: `You have applied a discount of ${discountAmount} to your cart.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        // Display a cancel message if the user clicks on "Cancel" (Non)
        Swal.fire({
          title: 'Promotion Canceled',
          text: 'The promotion has been canceled.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      // Handle any errors that occurred during the SweetAlert2 prompt or processing
      console.error('Error applying promotion:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while applying the promotion. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}

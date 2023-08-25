import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../../_services/token-storage";
import {AuthService} from "../../../_services/auth.service";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
user:any;
listofusers:any;
listofstores:any;
selectedTab: string = 'clients';
selectedStoreDetails: any = null; // Variable pour stocker les détails de la boutique sélectionnée
userdetail:any ;
imageUrlProfile: string;
imageUrlCin_Passport: string;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );

  constructor(private tokenStorage: TokenStorageService,private authservice:AuthService) { }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUserObject();
    if (this.user.role!="ADMIN")
    {
      location.href="/"
    }
  this.authservice.getAllUsers().subscribe((users) => {
    this.listofusers=users;
  })
    this.authservice.getAllStores().subscribe((stores) => {
      this.listofstores=stores
      console.log(this.listofstores)
    })
    if (this.user && this.user.image) {
      this.getImageUrlProfile(this.user.image);

    }
  }
  async getImageUrlProfile(imageName: string) {
    try {
      // @ts-ignore
      const { data, error } = await this.supabase.storage
        .from('images/avatars')
        .getPublicUrl(imageName);

      if (error) {
        console.error('Failed to get image URL:', error);
        return;
      }

      this.imageUrlProfile = data.publicUrl;
      console.log(this.imageUrlProfile)

    } catch (error) {
      console.error('Failed to get image URL:', error);
    }
  }
  async getImageUrlCinPassport(imageName: string) {
    try {
      // @ts-ignore
      const { data, error } = await this.supabase.storage
        .from('images/Pieces')
        .getPublicUrl(imageName);

      if (error) {
        console.error('Failed to get image URL:', error);
        return;
      }

      this.imageUrlCin_Passport = data.publicUrl;
      console.log(this.imageUrlCin_Passport)

    } catch (error) {
      console.error('Failed to get image URL:', error);
    }
  }
  showDetails(store: any) {
    this.selectedStoreDetails = store;
    this.userdetail=this.selectedStoreDetails.user
    this.getImageUrlCinPassport(store.img_de_piece)
    console.log(this.userdetail)
  }


  confirmStore() {
    // Use SweetAlert for confirmation
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de confirmer cette demande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Oui" in SweetAlert, proceed with confirmation
        this.authservice.ConfirmStore(this.selectedStoreDetails.user.id, this.selectedStoreDetails.id).subscribe((res) => {
          if (res==1)
          {
            Swal.fire('Succès', 'La demande a été confirmée avec succès', 'success').then(() => {

              window.location.href = '/Admin/DashBoard';
            });

          }
          // Show success message using SweetAlert
        });
      } else {
        // User clicked "Non" in SweetAlert, show a message
        Swal.fire('Annulation', 'La demande est toujours en attente', 'info');
      }
    });
  }


  closewindow() {
    this.selectedStoreDetails = null;
  }

  cancelStore() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de refuser cette demande ?',
      icon: 'warning',
      input: 'textarea', // Add a textarea input to get the reason from the user
      inputAttributes: {
        required: 'true' // Make the textarea field mandatory
      },
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      inputLabel: 'Pourquoi vous refusez la demande', // Add the label for the textarea
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          // Show an error message if the textarea is empty or null
          return 'Veuillez fournir un motif de refus.';
        }
        // Validation passed, return null to indicate success
        return null;
      }
    }).then((result) => {
      // Check if the user clicked "Oui" in SweetAlert
      if (result.isConfirmed) {
        const reason = result.value; // Get the reason entered by the user

        // Make sure the reason is not empty or null before proceeding
        if (reason && reason.trim().length > 0) {
          // User provided a reason, proceed with confirmation
          this.authservice.RefuseStore(this.selectedStoreDetails.user.id, this.selectedStoreDetails.id,reason).subscribe((res) => {
            if (res == 1) {
              Swal.fire('Succès', 'La demande a été refusée avec succès', 'success').then(() => {
                window.location.href = '/Admin/DashBoard';
              });
            }
            // Show success message using SweetAlert
          });
        } else {
          // Show an error message if the reason is empty or null
          Swal.fire('Erreur', 'Veuillez fournir un motif de refus.', 'error');
        }
      } else {
        // User clicked "Non" in SweetAlert, show a message
        Swal.fire('Annulation', 'La demande est toujours en attente', 'info');
      }
    });
  }

}

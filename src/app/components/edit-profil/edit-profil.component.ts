import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {TokenStorageService} from "../../_services/token-storage";
import {RouterModule} from "@angular/router";
import {SupabaseService} from "../../_services/supabase.service";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup,FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../_services/auth.service";
import Swal from 'sweetalert2';
export class User {
  id: number;
  lastname: string;
  firstname: string;
  password: string;
  username: string;
  adress: string;
  city: string;
  telephone: number;
  cin: number;
  image: string;





}
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css']
})
export class EditProfilComponent implements OnInit {
user:any;
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;

  imageUrl: string;
  showUpdate: boolean = false; // Flag to control button visibility
  showActivation = false;
  verificationCode :any
  form: FormGroup;
  isEditing: boolean = false;
  isEditingpaswword: boolean = false;
  profileForm: FormGroup;
  profileFormPassword: FormGroup;
  userupdated:any;
  isLoading = false;
  listofStores: any[] = [];

  isShopActive: boolean=false;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );




  constructor(private tokenStorage: TokenStorageService,private router:RouterModule, private supabaseService: SupabaseService,private formBuilder: FormBuilder,private authService: AuthService)
  {
    this.form = this.formBuilder.group({
      verificationCode: ['', Validators.required]
    });
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  }
  ngOnInit(): void {
     this.user = this.tokenStorage.getUserObject();

    if (this.user && this.user.image) {
      this.getImageUrl(this.user.image);
    }
  this.authService.getAllStoresbyuser(this.user.id).subscribe(data => {
    this.listofStores=data
  })
  }


  storeName: string="";
  storeAdresse: string="";
  storeVille: string="";
  storePostal: string="";
  ownerDOB: Date= new Date();
  idImage: any=""; // You can adjust the type for image as required
  matriculefiscale: boolean = false;
  matriculeFiscaleValue: string="";
  termsAccepted: boolean = false;

   formData = {
    storeName: this.storeName,
    storeAdresse: this.storeAdresse,
    storeVille: this.storeVille,
    storePostal: this.storePostal,
    ownerDOB: this.ownerDOB,
    idImage: this.idImage,
    matriculefiscale: this.matriculefiscale,
    matriculeFiscaleValue: this.matriculeFiscaleValue,
    termsAccepted: this.termsAccepted
  };

  async getImageUrl(imageName: string) {
    try {
      // @ts-ignore
      const { data, error } = await this.supabase.storage
        .from('images/avatars')
        .getPublicUrl(imageName);

      if (error) {
        console.error('Failed to get image URL:', error);
        return;
      }

      this.imageUrl = data.publicUrl;
      console.log(this.imageUrl)

    } catch (error) {
      console.error('Failed to get image URL:', error);
    }
  }
  handleImageClick(): void {
    this.imageInputRef.nativeElement.click();
  }
  showUpdateButton(): void {
    this.showUpdate = true;
  }
  hideUpdateButton(): void {
    this.showUpdate = false;
  }


  async handleImageUpload(event: any): Promise<void> {
    const file = event.target.files[0];

    if (file) {
      const filePath = `avatars/${file.name}`; // Specify the desired file path in the storage bucket
      this.isLoading = true; // Activer l'état de chargement

      try {
        const { data, error } = await this.supabase.storage
          .from('images')
          .upload(filePath, file);

        if (error) {
          console.error('Failed to upload file:', error);
          // Handle the failure case
          Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
          return;
        }

        console.log('File uploaded successfully!');
        const old=this.user.image
        this.user.image = file.name; // Assign the file path to the Userregister object
        this.authService.updateprofilepicture(this.user.username,file.name).subscribe();
        window.sessionStorage.setItem('UserObject', JSON.stringify(this.user));

        const { data: removeData, error: removeError } = await this.supabase.storage
          .from('images')
          .remove([`avatars/${old}`]);

        if (removeError) {
          console.error('Failed to remove old image:', removeError);
          // Handle the failure case
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'ancienne image', 'error');
          return;
        }

        console.log('Old image removed successfully!');
        this.isLoading = false; // Désactiver l'état de chargement après la requête

        window.location.href = '/profile';

      } catch (error) {
        console.error('Failed to upload file:', error);
        // Handle the failure case
        Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
        return;
      }
    }
  }

// Add the following property to your component to store the image URL

  showActivationForm() {
    this.showActivation = true;
  }
  resendVerificationCode() {
    this.authService.resendCodeforactiveAccount(this.user.username).subscribe(
      (result)=>
      {
        if (result==1)
        {
          Swal.fire('Succès', 'Code envoyer par email', 'success')
        }
        else
        {
          console.log("error")
        }
      }
    )
  }

  activateAccount() {
    this.authService.activeAccount(this.form.get("verificationCode").value, this.user.username).subscribe(
      (res) => {
        // Success case
        if (res==1)
        {
          Swal.fire('Succès', 'Votre compte a ete bien activer', 'success')
            .then(() => {
              this.user.isactive==true
              window.sessionStorage.setItem('UserObject', JSON.stringify(this.user));
              window.location.href = '/profile';
            });
        }
        else
        {
          Swal.fire({
            title: 'Erreur',
            text: 'Le code que vous avez saisi est incorrect ou a expiré. Voulez-vous recevoir un nouveau code par e-mail ?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
          }).then((result) => {
            if (result.isConfirmed) {
              // User clicked "Oui"
this.authService.resendCodeforactiveAccount(this.user.username).subscribe(
  (result)=>
  {
    if (result==1)
    {
      Swal.fire('Succès', 'Code envoyer par email', 'success')
    }
    else
    {
      console.log("error")
    }
  }
)} else {
              // User clicked "Non" or closed the dialog
            }
          });
        }
      },
      (error) => {
        // Error case
        console.error('Account activation failed:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
      }
    );
  }
  cancelActivation() {
    this.showActivation = false;
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.profileForm = new FormGroup({
      nom: new FormControl(this.user.lastname, Validators.required),
      prenom: new FormControl(this.user.firstname, Validators.required),
      email: new FormControl(this.user.username, [Validators.required, Validators.email]),
      adresse: new FormControl(this.user.adress, Validators.required),
      telephone: new FormControl(this.user.telephone, Validators.required),
    });
  }
  initializeFormPassword() {
    this.profileFormPassword = new FormGroup({
      oldpassword: new FormControl('', Validators.required),
      newpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repeatnewpassword: new FormControl('', Validators.required),
    });
  }
  update() {
    this.userupdated = new User();
    this.userupdated.id = this.user.id
    this.userupdated.lastname = this.profileForm.get("nom").value;
    this.userupdated.firstname = this.profileForm.get("prenom").value;
    this.userupdated.username = this.profileForm.get("email").value;
    this.userupdated.adress = this.profileForm.get("adresse").value;
    this.userupdated.telephone = this.profileForm.get("telephone").value;
    this.userupdated.password =this.user.password
    this.userupdated.city = this.user.city
    this.userupdated.cin =this.user.cin
    this.userupdated.image=this.user.image
    this.userupdated.role=this.user.role
    this.userupdated.isActive=this.user.isactive
    this.authService.updateprofile(this.userupdated).subscribe(
      (res) => {
        console.log(res)
        // Success case

        Swal.fire('Succès', 'Mise a jour effectué avec succes', 'success').then((result) => {
          // Code to execute after the Swal.fire() dialog is closed
          // You can perform additional actions here
          // For example, you can redirect the user to another page or update the UI
          // based on the user's interaction with the Swal.fire() dialog
          if (result.isConfirmed) {
            window.sessionStorage.setItem('UserObject', JSON.stringify(this.userupdated));
            window.location.href = '/profile';
          } else {
            // User clicked the "Cancel" button or closed the dialog
            // Perform other actions or handle the cancellation
          }
        });
        // Perform any actions needed for a successful profile update
        // For example, display a success message to the user
      },
      (error) => {
        // Error case
        console.error('Profile update failed:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
      }
    );
  }
  toggleEditpassword() {
    this.isEditingpaswword= !this.isEditingpaswword;
    if (this.isEditingpaswword) {
      this.initializeFormPassword();
    }
  }
  // Inside your component class
  togglePasswordVisibility(fieldId: string): void {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    if (field.type === 'password') {
      field.type = 'text';
    } else {
      field.type = 'password';
    }
  }
  isPasswordVisible(fieldId: string): boolean {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    return field.type === 'text';
  }
  logout() {
    this.tokenStorage.signOut();
    window.location.href = '/';
  }
  updatePassword() {
const oldpassword =this.profileFormPassword.get('oldpassword')?.value;
const newpassword =this.profileFormPassword.get('newpassword')?.value;
const repeatnewpassword =this.profileFormPassword.get('repeatnewpassword')?.value;
if (newpassword!=repeatnewpassword)
{
  Swal.fire('Erreur', 'Les deux nouveaux mot de passes ne sont pas identique', 'error');

}else
{
    this.authService.updatepassword(this.user.username, oldpassword, newpassword).subscribe(
      (res) => {
        console.log(res);
        if (res==1)
        {
          Swal.fire('Succès', 'Votre mot de passe a ete bien modifier', 'success').then((result) => {
            if (result.isConfirmed) {
              this.logout();
              window.location.href = '/';

            }
          });
        }
        else
        {
          Swal.fire('Erreur', 'mot de passe actuel incorrect', 'error');
        }
      },
      (error) => {
        console.log('Error occurred while updating password:', error);
      }
    );
}}


  consulterStore(store: any) {

  }

  modifierStore(store: any) {

  }

  supprimerStore(store: any) {

  }
}


import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../_services/auth.service";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";
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
  nameStore: string;
  adresseStore: string;
  villeStore: string;
  codepostalStore: string;
  type_de_pieceStore: string;
  img_de_pieceStore: string;
  ownerDOB: Date;
  matriculefiscaleStore: boolean;
  valueOfmatriculefiscaleStore: string;
}

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: ['./register-store.component.css']
})
export class RegisterStoreComponent implements OnInit {
  form: any;
  isLoading: any;
  Userregister:User;

  constructor(private formBuilder: FormBuilder,private  authService: AuthService) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      idCardNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      profilePicture: ['', Validators.required],

      storeName: ['', Validators.required],
      storeAdress: ['', Validators.required],
      storeVille: ['', Validators.required],
      storePostal: ['', Validators.required],
      ownerDOB: ['', Validators.required],
      idImage: ['', Validators.required],
      matriculeFiscale: [null],
      matriculeFiscaleValue: [''],
      termsAccepted: [false, Validators.requiredTrue]
    },
      {
        validator: this.passwordMatchValidator // Utilisation de la fonction de validation personnalisée
      }
    );
    this.Userregister = new User();

  }
  url = '';
  file!: File;
  filePiece!: File;
  showSecondPart = false;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  ngOnInit() {

  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
  }
  async submit() {

    if (this.form.invalid) {
      if (this.form.get('email')?.invalid) {
        Swal.fire('Erreur', 'L\'adresse email est incorrecte', 'error');
      } else if (this.form.get('password')?.value!=this.form.get('confirmPassword')?.value) {
        Swal.fire('Erreur', 'Verifier le mot de passe', 'error');
      } else {
        Swal.fire('Erreur', 'Veuillez vérifier les champs du formulaire', 'error');
      }if (this.form.get('idCardNumber')?.invalid) {
        Swal.fire('Erreur', 'CIN invalide', 'error');
      }if (this.form.get('phoneNumber')?.invalid) {
        Swal.fire('Erreur', 'numero de telephone invalide', 'error');
      }
      return;
    }
    this.Userregister.firstname = this.form.get('firstName')?.value;
    this.Userregister.lastname = this.form.get('lastName')?.value;
    this.Userregister.username = this.form.get('email')?.value;
    this.Userregister.password = this.form.get('password')?.value;
    this.Userregister.adress = this.form.get('address')?.value;
    this.Userregister.city = this.form.get('city')?.value;
    this.Userregister.telephone = this.form.get('phoneNumber')?.value;
    this.Userregister.cin = this.form.get('cin')?.value;
    this.Userregister.nameStore = this.form.get('storeName')?.value;
    this.Userregister.adresseStore = this.form.get('storeAdress')?.value;
    this.Userregister.villeStore = this.form.get('storeVille')?.value;
    this.Userregister.codepostalStore = this.form.get('storePostal')?.value;
    this.Userregister.ownerDOB = this.form.get('ownerDOB')?.value;
    this.Userregister.type_de_pieceStore = this.form.get('cin')?.value;
    this.Userregister.matriculefiscaleStore = this.form.get('matriculeFiscale')?.value;
    this.Userregister.valueOfmatriculefiscaleStore = this.form.get('matriculeFiscaleValue')?.value;
    // Upload the image to Supabase if available
    if (this.file && this.filePiece) {
      const filePath = `avatars/${this.file.name}`; // Specify the desired file path in the storage bucket
      const filePathPiece = `Pieces/${this.filePiece.name}`; // Specify the desired file path in the storage bucket
      this.isLoading = true; // Activer l'état de chargement

      try {
        this.isLoading = true;
        // Upload the first image
        const imagePath1 = await this.uploadImage(filePath, this.file);
        // Upload the second image
        const imagePath2 = await this.uploadImage(filePathPiece, this.filePiece);
        this.isLoading = false; // Deactivate the loading state
        // Assign the file paths to the Userregister object
        this.Userregister.image = imagePath1;
        this.Userregister.img_de_pieceStore = imagePath2;
      } catch (error) {
        console.error('Failed to upload file:', error);
        // Handle the failure case
        Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
        return;
      }
      this.authService.registerSeller(this.Userregister).subscribe(
        (response) => {
          // Success case: The registration was successful
          Swal.fire('Succès', 'Félicitations ! Votre inscription a été effectuée avec succès. Vous allez bientôt recevoir un email de confirmation. Vous pouvez dès à présent accéder à notre plateforme. Cependant, veuillez noter que votre demande de création de boutique est en attente de validation par l\'administrateur.', 'success')
            .then(() => {
              window.location.href = '/';
            });
        },
        (error) => {
          // Error case: An error occurred during registration
          Swal.fire('Erreur', 'Une erreur est survenue ', 'error');
          // You can handle the error, display error messages, etc. as needed.
        }
      );
    }
  }

  uploadfile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  uploadfilePiece(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.filePiece = event.target.files[0];
    }
  }
  async uploadImage(filePath: string, file: File): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        console.error('Failed to upload file:', error);
        throw new Error('Failed to upload file');
      }

      console.log('File uploaded successfully!');
      return file.name; // Return the file name
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file');
    }
  }

}

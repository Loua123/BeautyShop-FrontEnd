import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import {AuthService} from "../../_services/auth.service";
import {disableDebugTools} from "@angular/platform-browser";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  Userregister:User;
  isLoading = false;

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
      profilePicture: ['', Validators.required]
    });
    this.Userregister = new User();
  }
  url = '';
  file!: File;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );

  uploadfile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  async submit() {
    if (this.form.invalid) {
      Swal.fire('Erreur', 'Veuillez vérifier les champs du formulaire', 'error');
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

    // Upload the image to Supabase if available
    if (this.file) {
      const filePath = `avatars/${this.file.name}`; // Specify the desired file path in the storage bucket
      this.isLoading = true; // Activer l'état de chargement

      try {
        const { data, error } = await this.supabase.storage
          .from('images')
          .upload(filePath, this.file);

        if (error) {
          console.error('Failed to upload file:', error);
          // Handle the failure case
          Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
          return;
        }
        this.isLoading = false; // Activer l'état de chargement

        console.log('File uploaded successfully!');
        this.Userregister.image = this.file.name; // Assign the file path to the Userregister object
      } catch (error) {
        console.error('Failed to upload file:', error);
        // Handle the failure case
        Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
        return;
      }
    }
    else
      console.log(false)

    // Call the register API
    this.authService.register(this.Userregister).subscribe(
      (response) => {
        Swal.fire('Succès', 'Inscription réussie ! Vous allez recevoir un email de confirmation', 'success')
          .then(() => {

            window.location.href = '/';
          });
      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'inscription veuillez réessayer plus tard.', 'error');
      }
    );
  }
  ngOnInit(): void {

  }

}

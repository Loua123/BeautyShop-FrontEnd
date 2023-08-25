import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthService} from "../../../_services/auth.service";
import {TokenStorageService} from "../../../_services/token-storage";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import Swal from "sweetalert2";
import {User} from "../../register/register-store/register-store.component";
export class Store {
  nameStore: string;
  adresseStore: string;
  villeStore: string;
  codepostalStore: string;
  type_de_pieceStore: string;
  img_de_pieceStore: string;
  ownerDOB: Date;
  matriculefiscaleStore: boolean;
  valueOfmatriculefiscaleStore: string;
  iduser:any;
}
@Component({
  selector: 'app-add-shop',
  templateUrl: './add-shop.component.html',
  styleUrls: ['./add-shop.component.css']
})
export class AddShopComponent implements OnInit {
  form: any;
  isLoading: any;
  Storeregister:Store;

  constructor(private formBuilder: FormBuilder, private authservice: AuthService,
              private tokenStorage: TokenStorageService) {
    this.form = this.formBuilder.group({
      storeName: ['', Validators.required],
      storeAdress: ['', Validators.required],
      storeVille: ['', Validators.required],
      storePostal: ['', Validators.required],
      ownerDOB: ['', Validators.required],
      idImage: ['', Validators.required],
      matriculeFiscale: [null],
      matriculeFiscaleValue: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });
    this.Storeregister = new Store();

  }
  user:any;

  url = '';
  filePiece!: File;
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );

  ngOnInit() {
    this.user = this.tokenStorage.getUserObject();
  }


  async submit() {
    this.Storeregister.nameStore = this.form.get('storeName')?.value;
    this.Storeregister.adresseStore = this.form.get('storeAdress')?.value;
    this.Storeregister.villeStore = this.form.get('storeVille')?.value;
    this.Storeregister.codepostalStore = this.form.get('storePostal')?.value;
    this.Storeregister.ownerDOB = this.form.get('ownerDOB')?.value;
    this.Storeregister.type_de_pieceStore = this.form.get('cin')?.value;
    this.Storeregister.matriculefiscaleStore = this.form.get('matriculeFiscale')?.value;
    this.Storeregister.valueOfmatriculefiscaleStore = this.form.get('matriculeFiscaleValue')?.value;
    this.Storeregister.iduser=this.user.id;
    if (this.filePiece) {
      const filePathPiece = `Pieces/${this.filePiece.name}`; // Specify the desired file path in the storage bucket
      this.isLoading = true; // Activer l'état de chargement
      try {
        this.isLoading = true;


        const imagePath2 = await this.uploadImage(filePathPiece, this.filePiece);
        this.isLoading = false; // Deactivate the loading state

        // Assign the file paths to the Userregister object
        this.Storeregister.img_de_pieceStore = imagePath2;
      } catch (error) {
        this.isLoading = false; // Deactivate the loading state

        console.error('Failed to upload file:', error);
        // Handle the failure case
        Swal.fire('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image', 'error');
        return;
      }
      this.authservice.addStore(this.Storeregister).subscribe((store)=>{
        if (store==1)
        {
          Swal.fire('Succès', 'Félicitations !  votre demande de création de boutique est en attente de validation par l\'administrateur.', 'success')
            .then(() => {
              window.location.href = '/';
            });
        }
        else
        {
          Swal.fire('Erreur', 'Une erreur est survenue ', 'error');

        }
      })
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

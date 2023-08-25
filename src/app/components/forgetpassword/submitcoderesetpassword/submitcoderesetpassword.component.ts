import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../_services/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-submitcoderesetpassword',
  templateUrl: './submitcoderesetpassword.component.html',
  styleUrls: ['./submitcoderesetpassword.component.css']
})
export class SubmitcoderesetpasswordComponent implements OnInit {
  form: any;
code:string
email:string
  response:number
  constructor(private router: Router,private  formBuilder : FormBuilder,private  authService: AuthService) {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required, Validators.required]],
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: ""
    });
    const resetEmail = window.sessionStorage.getItem("resetemail");
    if (!resetEmail) {
      this.router.navigate(['/']);
    }
  }

  submit() {
    this.code=this.form.get('code')?.value;
    this.email=window.sessionStorage.getItem("resetemail");
    this.authService.verifycodereset(this.email,this.code).subscribe(
      (response) => {
       if (response==1)
       {
         this.response=1;
         const newPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
         const repeatNewPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
         this.form = this.formBuilder.group({
           newPassword,
           repeatNewPassword
         });
         console.log(newPassword)
       }
       else
       {
         Swal.fire('Erreur', 'Le code que vous avez saisie est incorrect ou bien expiré ', 'error');
       }


      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'inscription veuillez réessayer plus tard.', 'error');
      }
    );
  }
  submitNewPassword() {
    const newPassword = this.form.get('newPassword')?.value;
    const repeatNewPassword = this.form.get('repeatNewPassword')?.value;
    if (newPassword === repeatNewPassword) {
      this.authService.resetpassword(newPassword,this.email).subscribe(
        (response) => {
          if (response==1)
          {
            Swal.fire('Succès', 'Votre mot de passe a été bien modifier', 'success')
              .then(() => {

                window.location.href = '/';
              });
          }
          else
          {
            Swal.fire('Erreur', 'Une erreur est survenue veuillez réessayer plus tard.', 'error');
          }

        },
        (error) => {
          Swal.fire('Erreur', 'Une erreur est survenue veuillez réessayer plus tard.', 'error');

        }
      );
    } else {
      Swal.fire('Erreur', 'les deux mot de passe ne sont pas compatible', 'error');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../_services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  form: FormGroup;
  email:string='';

  constructor(private  formBuilder : FormBuilder,private  authService: AuthService) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit(): void {
    this.form=this.formBuilder.group({
      email:"",
    })

  }

  submit() {
    this.email=this.form.get('email')?.value;
  this.authService.SendResetPasswordEmail(this.email).subscribe(
    (response) => {
      if (response.result==1)
      {
        Swal.fire('Succès', 'Verifier votre boite email', 'success')
          .then(() => {
            window.sessionStorage.setItem("resetemail", JSON.stringify(this.email));

            window.location.href = '/Submitcoderesetpassword';
          });
      }
      else
      {
        Swal.fire('Erreur', 'Email introuvable.', 'error');
      }
    },
    (error) => {
      Swal.fire('Erreur', 'Une erreur est survenue lors de l\'inscription veuillez réessayer plus tard.', 'error');
    }
  );
  }
}

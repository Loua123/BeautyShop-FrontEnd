import {Component, OnInit, Output,EventEmitter} from '@angular/core';
import {FormBuilder , FormGroup, } from "@angular/forms";
import {AuthService} from "../../_services/auth.service";
import {TokenStorageService} from "../../_services/token-storage";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  token:any;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  @Output() newUsernameEvent= new EventEmitter<string>();
  email:string='';
  roles: string[] = [];


  constructor(private  formBuilder : FormBuilder,

              private  authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
  ) {


  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.form=this.formBuilder.group({
      email:"",
      password:""
    })


  }
  getCurrentUsername(){
    this.newUsernameEvent.emit(this.email);
  }

  submit() {
    this.authService.login(this.form.value)
      .subscribe(
        (data) => {
          if (data.token) {
            console.log(data.user)
            this.tokenStorage.saveToken(data.token);
            this.tokenStorage.saveUser(data);
            this.tokenStorage.saveUserobject(data.user)
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            this.email = this.tokenStorage.getUser().sub;
            this.getCurrentUsername();
            this.reloadPage();
          }
        },
        (error) => {
          // Afficher un message d'erreur générique
          Swal.fire('Erreur', 'Mot de passe ou e-mail incorrect.', 'error');
        }
      );
  }

  reloadPage(): void {
    window.location.reload();
  }

}

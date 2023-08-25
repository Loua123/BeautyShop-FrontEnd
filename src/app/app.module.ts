import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ListproductComponent } from './components/listproduct/listproduct.component';
import { DetailsproductComponent } from './components/detailsproduct/detailsproduct.component';
import { DetailscategoryComponent } from './components/Admin/admin-dashboard/detailscategory/detailscategory.component';
import {  HttpClientModule } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { EditProfilComponent } from './components/edit-profil/edit-profil.component';
import { ListclientsComponent } from './components/Admin/listclients/listclients.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { DebugComponentComponent } from './debug-component/debug-component.component';
import { SubmitcoderesetpasswordComponent } from './components/forgetpassword/submitcoderesetpassword/submitcoderesetpassword.component';
import { FormsModule } from '@angular/forms';
import { RegisterStoreComponent } from './components/register/register-store/register-store.component';
import { DashboardComponent } from './components/Admin/dashboard/dashboard.component';
import { AddShopComponent } from './components/edit-profil/add-shop/add-shop.component';
import { CancelComponent } from './stripe/cancel/cancel.component';
import { SucessComponent } from './stripe/sucess/sucess.component';
import { CheckoutComponent } from './stripe/checkout/checkout.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { ListmarquesComponent } from './listmarques/listmarques.component';
import { StoreComponent } from './components/store/store.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';
import { HeaderAdminComponent } from './components/Admin/admin-dashboard/header-admin/header-admin.component';
import { GestionUsersComponent } from './components/Admin/admin-dashboard/gestion-users/gestion-users.component';
import { DemandeVendeursComponent } from './components/Admin/admin-dashboard/demande-vendeurs/demande-vendeurs.component';
import { LeftsidebarComponent} from "./components/Admin/admin-dashboard/header-admin/leftsidebar/leftsidebar.component";
import { ListproductsComponent } from './components/Admin/admin-dashboard/listproducts/listproducts.component';
import { PanierComponent } from './components/panier/panier.component';
import { CommandeComponent } from './components/commande/commande.component';
import { StatVenteComponent } from './components/Admin/admin-dashboard/stat-vente/stat-vente.component';
import { StatBeneficeComponent } from './components/Admin/admin-dashboard/stat-benefice/stat-benefice.component';
import {NgChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    ForgetpasswordComponent,
    DebugComponentComponent,
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ContactComponent,
    AboutComponent,
    ListproductComponent,
    DetailsproductComponent,
    DetailscategoryComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    EditProfilComponent,
    ListclientsComponent,
    SubmitcoderesetpasswordComponent,
    RegisterStoreComponent,
    DashboardComponent,
    AddShopComponent,
    CancelComponent,
    SucessComponent,
    CheckoutComponent,
    ListmarquesComponent,
    StoreComponent,
    AdminDashboardComponent,
    HeaderAdminComponent,
    GestionUsersComponent,
    DemandeVendeursComponent,
    LeftsidebarComponent,
    ListproductsComponent,
    PanierComponent,
    CommandeComponent,
    StatVenteComponent,
    StatBeneficeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, Ng5SliderModule, ReactiveFormsModule, FormsModule,
    MatCardModule,
    MatButtonModule, NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

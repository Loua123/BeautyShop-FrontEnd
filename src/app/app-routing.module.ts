import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ListproductComponent } from './components/listproduct/listproduct.component';
import {ListcategoryComponent} from './listcategory/listcategory.component';
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {EditProfilComponent} from "./components/edit-profil/edit-profil.component";
import {ForgetpasswordComponent} from "./components/forgetpassword/forgetpassword.component";
import {
  SubmitcoderesetpasswordComponent
} from "./components/forgetpassword/submitcoderesetpassword/submitcoderesetpassword.component";
import {RegisterStoreComponent} from "./components/register/register-store/register-store.component";
import {DashboardComponent} from "./components/Admin/dashboard/dashboard.component";
import {CheckoutComponent} from "./stripe/checkout/checkout.component";
import {CancelComponent} from "./stripe/cancel/cancel.component";
import {SucessComponent} from "./stripe/sucess/sucess.component";
import {AddShopComponent} from "./components/edit-profil/add-shop/add-shop.component";
import {ListmarquesComponent} from "./listmarques/listmarques.component";
import {StoreComponent} from "./components/store/store.component";
import {DetailsproductComponent} from "./components/detailsproduct/detailsproduct.component";
import {AdminDashboardComponent} from "./components/Admin/admin-dashboard/admin-dashboard.component";
import {DemandeVendeursComponent} from "./components/Admin/admin-dashboard/demande-vendeurs/demande-vendeurs.component";
import {PanierComponent} from "./components/panier/panier.component";
import {CommandeComponent} from "./components/commande/commande.component";
import {StatVenteComponent} from "./components/Admin/admin-dashboard/stat-vente/stat-vente.component";
import {StatBeneficeComponent} from "./components/Admin/admin-dashboard/stat-benefice/stat-benefice.component";

const routes: Routes = [
  {path: '',component:HomeComponent},
  {path: 'resetpassword',component:ForgetpasswordComponent},
  {path: 'Submitcoderesetpassword',component:SubmitcoderesetpasswordComponent},
  {path: 'about',component:AboutComponent},
  {path: 'contacts',component:ContactComponent},
  {path: 'product',component:ListproductComponent},
  {path: 'category',component:ListcategoryComponent},
  {path: 'registre',component:RegisterComponent},
  {path: 'profile',component:EditProfilComponent},
  {path: 'registreStore',component:RegisterStoreComponent},
  {path: 'Admin/DashBoard',component:DashboardComponent},
  {path: 'checkout', component: CheckoutComponent,},
  {path: 'cancel', component: CancelComponent },
  {path: 'success', component: SucessComponent },
  {path: 'addStore', component: AddShopComponent },
  {path: 'listmarques', component: ListmarquesComponent },
  {path: 'store', component: StoreComponent },
  {path: 'productDetails/:id', component: DetailsproductComponent },
  {path: 'DashboardAdmin', component: AdminDashboardComponent },
  {path: 'DashboardAdmin/GestionUsers', component: AdminDashboardComponent },
  {path: 'DashboardAdmin/demandeVendeurs', component: DemandeVendeursComponent },
  {path: 'DashboardAdmin/GestionProduits', component: ListproductComponent },
  {path: 'DashboardAdmin/StatVente', component: StatVenteComponent },
  {path: 'DashboardAdmin/StatBenefice', component: StatBeneficeComponent },
  {path: 'Panier', component: PanierComponent },
  {path: 'Commande', component: CommandeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

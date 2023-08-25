import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {TokenStorageService} from "../../_services/token-storage";
import {loadStripe} from "@stripe/stripe-js";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";
import {createClient, SupabaseClient} from "@supabase/supabase-js";

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  nonConfirmedCommands: string[] = ['Commande 1', 'Commande 2', 'Commande 3'];
  confirmedCommands: string[] = ['Commande 4', 'Commande 5', 'Commande 6'];
  listcommande: any;
  user:any;
  listproductOrdes:any;
  stripePromise = loadStripe(environment.stripe);
  Showdetails: boolean=false;
total:number=0;
orderid:any
  supabase: SupabaseClient = createClient(
    'https://tssiqbdwraobqqxihmlr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2lxYmR3cmFvYnFxeGlobWxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1MDU1OSwiZXhwIjoyMDA0MjI2NTU5fQ.DV6oAy2EakVhWJ9Xzqjasx9T9quBesru9RaHewmSkVU'
  );
  constructor(private authService:AuthService,private tokenStorage:TokenStorageService,private http: HttpClient) { }

  ngOnInit(): void {
    this.user = this.tokenStorage.getUserObject();

    this.authService.getOrdersbyuser(this.user.id).subscribe((response)=>{
      this.listcommande= response
      this.nonConfirmedCommands = [];
      this.confirmedCommands = [];
      for (let i = 0; i < this.listcommande.length; i++) {
        const order = this.listcommande[i];
        if (order.status === false) {
          this.nonConfirmedCommands.push(order);
        } else {
          this.confirmedCommands.push(order);
        }
      }
    })

  }

  deleteCommand(id) {
  this.authService.deleteOrder(id).subscribe((response)=>{
    Swal.fire('Succès', 'Votre commande a été annuler avec succes', 'success')
      .then(() => {
        window.location.href = '/Commande';
      });
  })
  }

  showNonConfirmedCommands() {
this.listcommande=this.nonConfirmedCommands;
  }

  showConfirmedCommands() {
    this.listcommande=this.confirmedCommands;

  }

  async pay(command: any): Promise<void> {

    const payment = {
      name: 'Commande',
      currency: 'usd',
      // amount on cents *10 => to be on dollar
      amount: command.price*100,
      quantity: 1,
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: `http://localhost:4200/success?orderId=${command.id}&iduser=${command.user.id}`,
    };
    const stripe = await this.stripePromise;

    // this is a normal http calls for a backend api
    this.http
      .post(`${environment.basaeurl}payment`, payment)
      .subscribe((data: any) => {
        stripe.redirectToCheckout({
          sessionId: data.id,
        });
      });
  }
  showAllCommands() {
    this.authService.getOrdersbyuser(this.user.id).subscribe((response)=> {
      this.listcommande = response
      console.log(response)
    })
  }
  async details(command: any) {
    console.log(command)
    this.Showdetails = true;
    this.listproductOrdes = command.productCollections;
    for (let i = 0; i < this.listproductOrdes.length; i++) {
      const price = parseFloat(this.listproductOrdes[i].price);
      this.total += price
      const imgurl = this.listproductOrdes[i].image
      this.listproductOrdes[i].image = await this.getImageUrl(imgurl)
    }
    this.orderid=command.id;
  }
  async getImageUrl(imageName: string): Promise<string> {
    try {
      const {data} = await this.supabase.storage
        .from('images/Products')
        .getPublicUrl(imageName);
      const imageUrl = data.publicUrl;
      return imageUrl;
    } catch (error) {
      console.error('Failed to get image URL:', error);
      throw new Error('Failed to get image URL');
    }
  }
  closedetails() {
    location.reload();
  }

  removeproduct(id) {
    if (this.listproductOrdes.length>1)
    {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous supprimer ce produit de votre commande?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {

        // Appeler le service pour supprimer le produit de la commande
        this.authService.removeProductFromOrder(this.orderid, id).subscribe(data => {
          if (data === true) {
            Swal.fire('Succès', 'Produit supprimé avec succès', 'success');
            location.reload();
          } else {
            Swal.fire('Erreur', 'Une erreur est survenue. Veuillez réessayer ultérieurement', 'error');
          }
        });
      }
    });
    }
    else
    {
      Swal.fire({
        title: 'Confirmation',
        text: 'Voulez-vous annuler la commande ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result.isConfirmed) {

          // Appeler le service pour supprimer le produit de la commande
          this.authService.removeProductFromOrder(this.orderid, id).subscribe(data => {
            if (data === true) {
              this.authService.deleteOrder(this.orderid).subscribe(data => {
                Swal.fire('Succès', 'Commande supprimé avec succès', 'success');
              location.reload();
              })
            } else {
              Swal.fire('Erreur', 'Une erreur est survenue. Veuillez réessayer ultérieurement', 'error');
            }
          });
        }
      });
    }
  }
}

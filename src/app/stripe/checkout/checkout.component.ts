import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
//this is for test only plz delete it later use payment service instead
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  // We load  Stripe
  stripePromise = loadStripe(environment.stripe);
  constructor(private http: HttpClient) {}

  //this is for test only plz delete it later use payment service instead
  async pay(): Promise<void> {
    // here we create a payment object
    const payment = {
      name: 'Iphone',
      currency: 'usd',
      // amount on cents *10 => to be on dollar
      amount: 99900,
      quantity: '1',
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: 'http://localhost:4200/success',
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
}

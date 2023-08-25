import { Injectable } from '@angular/core';
import {loadStripe} from "@stripe/stripe-js";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  stripePromise = loadStripe(environment.stripe);
  constructor(private http: HttpClient) {}
  async customPay(productName,amount,quantity): Promise<void> {
    // here we create a payment object
    const payment = {
      name: productName,
      currency: 'usd',
      amount:amount*10,
      quantity: quantity,
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: 'http://localhost:4200/success',
    };
    const stripe = await this.stripePromise;
    this.http
      .post(`${environment.basaeurl}payment`, payment)
      .subscribe((data: any) => {
        stripe.redirectToCheckout({
          sessionId: data.id,
        });
      });
  }
}

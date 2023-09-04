import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
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
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(log:any): Observable<any> {
    return this.http.post(
      `${env.basaeurl}authenticate`,log

    );
  }

  logout():any {
    return  this.http.post(`${env.basaeurl}logout`,null);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${env.basaeurl}register`,user);
  }
  SendResetPasswordEmail(email: string): Observable<any> {
    const requestBody = { email: email }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}checkaccountbyemail`, requestBody);
  }
  verifycodereset(email: string,resetCode: string): Observable<any> {
    const requestBody = { resetCode: resetCode,email:email }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}verifycodereset`, requestBody);
  }
  resetpassword(newPassword: string,email: string): Observable<any> {
    const requestBody = { newPassword: newPassword,email:email }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}resetpassword`, requestBody);
  }
  activeAccount(code: string,email:string): Observable<any> {
    const requestBody = { code: code,email:email }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}accountActivation`, requestBody);
  }
  resendCodeforactiveAccount(email: string): Observable<any> {
    const requestBody = { email:email }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}resendcodeActivation`, requestBody);
  }
  updateprofile(user:any) : Observable<any> {
    return this.http.post(`${env.basaeurl}updateUser`, user);
  }
  updateprofilepicture(email:string,filename:any) : Observable<any> {
    const requestBody = { email:email,fileName: filename }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}updateprofilepicture`, requestBody);
  }
  updatepassword(email:any,oldpassword:any,newpassword:any) : Observable<any>
  {
    const requestBody = { email:email,oldpassword: oldpassword,newpassword:newpassword }; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}updatepassword`, requestBody);
  }
  registerSeller(user:any) : Observable<any> {
    return this.http.post(`${env.basaeurl}registerSeller`,user);
  }
  getAllUsers() : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getAllUsers`);
  }
  getAllStores() : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getAllStores`);
  }
  ConfirmStore(iduser:any,idstore:any) :Observable<any>
  {
    const requestBody = { iduser:iduser,idstore: idstore}; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}ConfirmStore`,requestBody);
  }
  RefuseStore(iduser:any,idstore:any,morif:any) :Observable<any>
  {
    const requestBody = { iduser:iduser,idstore: idstore,morif:morif}; // Create an object with the required structure
    return this.http.post(`${env.basaeurl}RefuseStore`,requestBody);
  }

  addStore(s:any):Observable<any> {
    return this.http.post(`${env.basaeurl}addStore`,s)
  }
  changeRole(userId):Observable<any>{
   return  this.http.patch(`${env.basaeurl}changeRole?idUser=`+userId,null)
  }
  getAllStoresbyuser(userId:any) :Observable<any>
  {
    return this.http.get(`${env.basaeurl}getAllStoresbyuser/${userId}`);
  }
  addProduct(producttoAdd:any) : Observable<any>
  {
    return this.http.post(`${env.basaeurl}addProduct`,producttoAdd);
  }
  getProductByStore(storeId:any) : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getProductByStore/${storeId}`);
  }
  getProductByID(id:any) : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getProductByID/${id}`);
  }
  getAllproducts() : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getAllProducts`);
  }

  addcommande(orderDetails: { productId: number; quantity: number }[], userid:any,idseller) : Observable<any>{
    const requestBody = { orderDetails:orderDetails,userid: userid,idseller:idseller};
    return this.http.post(`${env.basaeurl}addOrder`,requestBody);
  }
  getOrdersbyuser(iduser:any) : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getOrderByIduser/${iduser}`);
  }
  deleteOrder(idOrder:any) : Observable<any>
  {
    return this.http.delete(`${env.basaeurl}deleteOrder/${idOrder}`);
  }
  addSales(idSeller,idBuyer,idOrder)  : Observable<any>
  {
    const requestBody = { idSeller:idSeller,idBuyer: idBuyer,idOrder:idOrder};

    return this.http.post(`${env.basaeurl}addSales`,requestBody);

  }

  getOrdersbyid(idOrder: any) {
    return this.http.get(`${env.basaeurl}getOrderById/${idOrder}`);
  }

  removeProductFromOrder(idOrder: any,idProduct:any) : Observable<any>{
    return this.http.post(`${env.basaeurl}removeProductFromOrder/${idOrder}/${idProduct}`, null);
  }


  deleteProduct(idProduct:any) : Observable<any>
  {
    return this.http.delete(`${env.basaeurl}deleteProduct/${idProduct}`);
  }
  addPromotion(idProduct,newPrice): Observable<any>
  {
    const requestBody = { idProduct:idProduct,newPrice: newPrice};
    console.log(requestBody);
    return this.http.post(`${env.basaeurl}AddPromotion`,requestBody);
  }
  GetallSales() : Observable<any>
  {
    return this.http.get(`${env.basaeurl}GetallSales`);
  }

  getVendeurlist() : Observable<any>
  {
    return this.http.get(`${env.basaeurl}getVendeurlist`);
  }
}


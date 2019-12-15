import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FiatService {

  baseURL = environment.baseURL;

  constructor(private http: HttpClient, private router: Router) { }

  // Deposit: Process user's fiat deposit request
  processUserFiatDeposit(id: string, email: string, amount: string): Promise<any> {
    return(
      this.http.post(`${this.baseURL}/api/user/deposit/fiat`, { id, email, amount }).toPromise()
    );
  }

  // Withdrawal: Process user's fiat withdrawal request
  processUserFiatWithdrawal(paypalEmail: string, fiatAmt: number) {
    return(
      this.http.post(`${this.baseURL}/api/user/withdraw/fiat`, { paypalEmail, fiatAmt }).toPromise()
    );
  }
}

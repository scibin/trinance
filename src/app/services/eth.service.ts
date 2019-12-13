import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EthService {

  baseURL = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  // Get user's ethereum deposit address
  getEthAddress(): Promise<any> {
    return(
      this.http.get(`${this.baseURL}/api/user/get/ethaddress`).toPromise()
    );
  }

  // Deposit: Process the deposit internally after user
  // has deposited eth into his/her designated eth address
  updateEthDeposit(): Promise<any> {
    return(
      this.http.get(`${this.baseURL}/api/user/deposit/eth`).toPromise()
    );
  }

  // NOTE: Strictly speaking, this function is applicable to fiat too
  // Withdrawal: Gets the user's current eth and fiat
  getCurrentUserAccEthAndFiat(): Promise<any> {
    return(
      this.http.get(`${this.baseURL}/api/user/account/all`).toPromise()
    );
  }

  // Withdrawal: Process user's eth withdrawal request
  processUserEthWithdrawal(addressToWithdrawTo: string, amount: number) {
    return(
      this.http.post(`${this.baseURL}/api/user/withdraw/eth`, { addressToWithdrawTo, amount }).toPromise()
    );
  }
}

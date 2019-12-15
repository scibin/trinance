import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Fave } from '../models';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EthService {

  // Websocket
  private socket;
  WS_SERVER_URL = environment.WS_SERVER_URL;

  // Express backend URL
  baseURL = environment.baseURL;

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
  processUserEthWithdrawal(addressToWithdrawTo: string, amount: number): Promise<any> {
    return(
      this.http.post(`${this.baseURL}/api/user/withdraw/eth`, { addressToWithdrawTo, amount }).toPromise()
    );
  }

  // Get Binance eth/usdt trading pair bid/asks information
  getEthBidAsk(): Promise<any> {
    const tradingpair = 'ETHUSDT';
    return(
      this.http.get(`${this.baseURL}/api/get/bidasks/${tradingpair}`).toPromise()
    );
  }

  // Trade: Process user's trade (buy/sell) request
  processUserTrade(tradeDetailsObj: object, base: string, quote: string): Promise<any> {
    return(
      this.http.post(`${this.baseURL}/api/user/trade/${base}/${quote}`, tradeDetailsObj).toPromise()
    );
  }

  // Favourites: Get user's favourites list
  getUserFavouritesList(): Promise<any> {
    return(
      this.http.get(`${this.baseURL}/api/user/favourites`).toPromise()
    );
  }

  // Favourites: Update user's favourites list
  updateUserFavouritesList(data: Fave): Promise<any> {
    return(
      this.http.put(`${this.baseURL}/api/user/favourites/update`, data).toPromise()
    );
  }

  // Logs: Get all logs of an user
  getUserLogs(): Promise<any> {
    return(
      this.http.get(`${this.baseURL}/api/user/logs`).toPromise()
    );
  }

  // Websocket
  public initSocket(): void {
    this.socket = socketIo(this.WS_SERVER_URL);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('info', (data: any) => observer.next(data));
    });
  }
}

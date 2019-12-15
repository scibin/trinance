import { Component, OnInit, OnDestroy } from '@angular/core';
import { Decimal } from 'decimal.js';
import { FiatService } from 'src/app/services/fiat.service';
import { EthService } from 'src/app/services/eth.service';
import { UtilService } from 'src/app/services/util.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit, OnDestroy {

  // Websocket
  ioConnection: any;

  // Ethereum
  ethBuyPrice = '9999';
  ethSellPrice = '9999';
  ethBuyTotal = '0';
  ethSellTotal = '0';
  amtOfEthToBuy: number;
  amtOfEthToSell: number;

  buyStatus = '';
  sellStatus = '';

  // Type of trade
  type = 'ethBuy';

  constructor(private ethSvc: EthService, private fiatSvc: FiatService, private utilSvc: UtilService) {
    this.ethSvc.initSocket();
  }

  ngOnInit() {
    // this.getEthPrice();
    this.ioConnection = this.ethSvc.onMessage()
      .subscribe((prices: any) => {
        this.ethBuyPrice = prices[1];
        this.ethSellPrice = prices[0];
      });
  }

  getEthPrice() {
    // Get request for eth price
    this.ethSvc.getEthBidAsk()
      .then(result => {
        // buy price / sell price (ask, bid), bid < ask -> Exchange's POV
        this.ethBuyPrice = result.data.askPrice;
        this.ethSellPrice = result.data.bidPrice;
      })
      .catch(err => {
        // Don't set to 0. Will go bankrupt
        this.ethBuyPrice = '9999';
        this.ethSellPrice = '9999';
      });
  }

  showAsFloat(num: string) {
    return parseFloat(num).toFixed(2);
  }

  // Form submission
  trade(form: NgForm) {
    if (this.type === 'ethBuy') {
      // Buy, setup information to pass to server
      // Trading pair price, remove trailing zeroes
      const price: string = parseFloat(this.ethBuyPrice).toString();
      // Amount of base currency bought/sold
      const amt: string = form.value.amtOfEthToBuy;
      // Recalculate total amount of base currency bought / sold
      const total: string = this.utilSvc.multiply(price, amt);
      // Is the trade a buy or sell
      const type = 'buy';
      // Base currency - Quote currency -> e.g. ETHUSD
      const base = 'eth';
      const quote = 'fiat';
      // Submit the information to the server
      const tradeDetailsObj = { price, amt, total, type };
      // IMO parameterizing base/quote currencies is a bad idea,
      // but have to fulfill assessment requirements
      this.ethSvc.processUserTrade(tradeDetailsObj, base, quote)
        .then(result => {
          this.buyStatus = 'Trade is successful!';
        })
        .catch(err => {
          if (err.error['status'] === 1) {
            this.buyStatus = 'Something went wrong, please try again';
          } else {
            this.buyStatus = err.error['status'];
          }
        });
    } else if (this.type === 'ethSell') {
      // Sell, setup information to pass to server
      const price: string = parseFloat(this.ethSellPrice).toString();
      const amt: string = form.value.amtOfEthToSell;
      const total: string = this.utilSvc.multiply(price, amt);
      const type = 'sell';
      const base = 'eth';
      const quote = 'fiat';
      // Submit the information to the server
      const tradeDetailsObj = { price, amt, total, type };
      this.ethSvc.processUserTrade(tradeDetailsObj, base, quote)
        .then(result => {
          this.sellStatus = 'Trade is successful!';
        })
        .catch(err => {
          if (err.error['status'] === 1) {
            this.sellStatus = 'Something went wrong, please try again';
          } else {
            this.sellStatus = err.error['status'];
          }
        });
    }
  }

  changeToBuyEth() {
    this.type = 'ethBuy';
  }

  changeToSellEth() {
    this.type = 'ethSell';
  }

  calculateBuyEthTotal() {
    // Recalculate total
    let input: any;
    if (!this.amtOfEthToBuy) {
      input = 0;
    } else {
      input = this.amtOfEthToBuy;
    }
    this.ethBuyTotal = this.utilSvc.multiply(this.ethBuyPrice, input.toString());
  }

  calculateSellEthTotal() {
    // Recalculate total
    let input: any;
    if (!this.amtOfEthToSell) {
      input = 0;
    } else {
      input = this.amtOfEthToSell;
    }
    this.ethSellTotal = this.utilSvc.multiply(this.ethSellPrice, input.toString());
  }

  ngOnDestroy() {
    this.ethSvc.disconnect();
    this.ioConnection.unsubscribe();
  }

}

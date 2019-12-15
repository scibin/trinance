import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EthService } from 'src/app/services/eth.service';
import { FiatService } from 'src/app/services/fiat.service';


@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {

  // Fiat/eth switch
  isFiat = true;
  type = (this.isFiat) ? 'fiat' : 'eth';

  // Fiat
  fiatWithdrawalStatus = '';
  currentFiat = 0;

  // Eth
  ethWithdrawalStatus = '';
  currentEth = 0;

  constructor(private ethSvc: EthService, private fiatSvc: FiatService) {}

  ngOnInit() {
    this.ethSvc.getCurrentUserAccEthAndFiat()
      .then(result => {
        this.currentFiat = result.fiat;
        this.currentEth = result.eth;
      })
      .catch(err => {
        this.currentFiat = 0;
        this.currentEth = 0;
      });
  }

  withdraw(form: NgForm) {
    if (form.value.type === 'fiat') {
      // process fiat
      this.fiatSvc.processUserFiatWithdrawal(form.value.paypalEmail, form.value.fiatAmt)
      .then(result => {
        this.fiatWithdrawalStatus = 'Withdrawal success!';
      })
      .catch(err => {
        this.fiatWithdrawalStatus = 'Something went wrong, please try again';
      });
    } else if (form.value.type === 'eth') {
      // process eth
      this.ethSvc.processUserEthWithdrawal(form.value.ethAddress, form.value.ethAmount)
      .then(result => {
        this.ethWithdrawalStatus = 'Withdrawal success!';
      })
      .catch(err => {
        this.ethWithdrawalStatus = 'Something went wrong, please try again';
      });
    }
  }

  changeToFiat() {
    this.isFiat = true;
    this.type = 'fiat';
  }

  changeToEth() {
    this.isFiat = false;
    this.type = 'eth';
  }
}

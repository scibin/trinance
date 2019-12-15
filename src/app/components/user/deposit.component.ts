import { Component, OnInit } from '@angular/core';
import { EthService } from 'src/app/services/eth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgForm } from '@angular/forms';
import { FiatService } from 'src/app/services/fiat.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  // For PayPal
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;
  fiatAmount = 10;
  fundClicked = false;
  statusText: string;
  fiatDepositStatus = '';

  // For Ethereum
  userEthereumAddress = '';
  ethDepositStatus = '';

  constructor(private ethSvc: EthService, private snackbar: MatSnackBar, private fiatSvc: FiatService) { }

  ngOnInit() {
    // Get the user's ethereum deposit address
    this.ethSvc.getEthAddress()
      .then(result => {
        this.userEthereumAddress = result.data;
      })
      .catch(err => {
        this.userEthereumAddress = 'Oops something went wrong, please try again';
      });
  }

  copyToClipboard() {
    this.snackbar.open('Copied!', 'Dismiss', {
      duration: 2000
    });
  }

  updateEth() {
    this.ethSvc.updateEthDeposit()
      .then(result => {
        this.ethDepositStatus = 'Deposit is successful!';
      })
      .catch(err => {
        this.ethDepositStatus = 'Something went wrong, please try again.';
      });
  }

  updateFiatDepositStatus(status: string) {
    this.fiatDepositStatus = status;
  }

  // For paypal
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypalClientID,
      // clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.fiatAmount.toString()
              // breakdown: {
              //   item_total: {
              //     currency_code: 'USD',
              //     value: '9.99'
              //   }
              // }
            }
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        this.updateFiatDepositStatus('Payment approved!');
        actions.order.get().then(details => {
        });
      },
      onClientAuthorization: (data) => {
        // Send data to server for update
        this.fiatSvc.processUserFiatDeposit(data.id, data.payer.email_address, data['purchase_units'][0].amount.value)
          .then(result => {
            this.showSuccess = true;
            this.updateFiatDepositStatus('Payment successful!');
          })
          .catch(error => {
            this.updateFiatDepositStatus('Payment error! Please try again.');
          });
      },
      onCancel: (data, actions) => {
        this.updateFiatDepositStatus('Payment cancelled!');
      },
      onError: err => {
        this.updateFiatDepositStatus('Payment error! Please try again.');
      },
      onClick: (data, actions) => {
      },
    };
  }

  activatePayPal(form: NgForm) {
    this.fundClicked = true;
    this.fiatAmount = form.value.fiatAmount;
    // Load PayPal
    this.initConfig();
  }
}

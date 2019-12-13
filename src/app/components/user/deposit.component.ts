import { Component, OnInit } from '@angular/core';
import { EthService } from 'src/app/services/eth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgForm } from '@angular/forms';
import { FiatService } from 'src/app/services/fiat.service';

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
  // Personal
  // sb-biwec701405@personal.example.com
  // )yC@&1k3
  // Business
  // sb-ngv98703568@business.example.com
  // B^rv^p#2
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
      })
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
        this.ethDepositStatus = 'Something went wrong, please try again.'
      })
  }

  // For paypal
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      // !!! Hide this later
      clientId: 'AVkl-fDIc7GqqCLgsvFB8tKXG02iMnW-GIUUggLXZZSvqgRxtGO_PuqINl8-9B0s2j7LCDIYkavxwGHI',
      // clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
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
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          // console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // Send data to server for update
        this.fiatSvc.processUserFiatDeposit(data.id, data.payer.email_address, data['purchase_units'][0].amount.value)
          .then(result => {
            this.showSuccess = true;
            this.statusText = 'Payment successful!';
          })
          .catch(error => {
            this.statusText = 'Payment error! Please try again.';
          })
      },
      onCancel: (data, actions) => {
        // console.log('OnCancel', data, actions);
        this.statusText = 'Payment cancelled!';
      },
      onError: err => {
        // console.log('OnError', err);
        this.statusText = 'Payment error! Please try again.';
      },
      onClick: (data, actions) => {
        // console.log('onClick', data, actions);
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

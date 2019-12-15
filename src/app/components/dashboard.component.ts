import { Component, OnInit } from '@angular/core';
import { EthService } from '../services/eth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  balances = {
    eth: 0,
    fiat: 0,
    santa: 0,
    claus: 0
  };

  constructor(private ethSvc: EthService) { }

  ngOnInit() {
    this.ethSvc.getCurrentUserAccEthAndFiat()
      .then(result => {
        this.balances = {
          eth: result.eth,
          fiat: result.fiat,
          santa: result.santa,
          claus: result.claus
        };
      })
      .then(err => {});
  }

}

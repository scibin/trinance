import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { EthService } from 'src/app/services/eth.service';
import { DEPOSIT, WITHDRAWAL, TRADE } from '../../models';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  // Initialize 3 arrays
  deposits: DEPOSIT[] = [
    {
      amount: 0,
      currency: '',
      from: '',
      id: '',
      time: 1576167218590
    }
  ];

  withdrawals: WITHDRAWAL[] = [
    {
      amount: 0,
      currency: '',
      to: '',
      id: '',
      time: 1576167218590
    }
  ];

  trades: TRADE[] = [
    {
      id: '',
      pair: '',
      price: '',
      quantity: '',
      time: 1576167218590,
      total: '',
      type: '',
    }
  ];

  // Table 1: Deposits | Table 2: Withdrawals | Table 3: Trades
  displayedColumns1: string[] = ['time', 'id', 'amount', 'currency', 'from'];
  dataSource1: MatTableDataSource<DEPOSIT>;

  displayedColumns2: string[] = ['time', 'id', 'amount', 'currency', 'to'];
  dataSource2: MatTableDataSource<WITHDRAWAL>;

  displayedColumns3: string[] = ['type', 'time', 'id', 'pair', 'price', 'quantity', 'total'];
  dataSource3: MatTableDataSource<TRADE>;

  @ViewChild('paginator1', {static: true}) paginator1: MatPaginator;
  @ViewChild('sort1', {static: true}) sort1: MatSort;

  @ViewChild('paginator2', {static: true}) paginator2: MatPaginator;
  @ViewChild('sort2', {static: true}) sort2: MatSort;

  @ViewChild('paginator3', {static: true}) paginator3: MatPaginator;
  @ViewChild('sort3', {static: true}) sort3: MatSort;

  constructor(private ethSvc: EthService) { }

  ngOnInit() {
    this.ethSvc.getUserLogs()
      .then(results => {
        this.deposits = this.convertIntToDate(results.data.deposits);
        this.withdrawals = this.convertIntToDate(results.data.withdrawals);
        // Find and replace the word fiat with usd
        this.trades = results.data.trades.map(v => {
          v.pair = v.pair.includes('fiat') ? v.pair.replace('fiat', 'usd') : v.pair;
          v.id = v.id.substring(0, 8);
          return v;
        });
        this.trades = this.convertIntToDate(this.trades);
        // Material tables
        this.dataSource1 = new MatTableDataSource(this.deposits);
        this.dataSource1.paginator = this.paginator1;
        this.dataSource1.sort = this.sort1;
        this.dataSource2 = new MatTableDataSource(this.withdrawals);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.dataSource3 = new MatTableDataSource(this.trades);
        this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;
      });
  }

  // Convert to date using moment
  convertIntToDate(data: any[]) {
    return (
      data.map(v => {
        v.time = moment(v.time).format('LLL');
        return v;
      })
    );
  }

  // Filters for Angular material tables
  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  applyFilter3(filterValue: string) {
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }
}

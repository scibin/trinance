import { Injectable } from '@angular/core';
import { Decimal } from 'decimal.js';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  multiply(a: string, b: string): string {
    const aDecimal = new Decimal(a);
    const bDecimal = new Decimal(b);
    const multiplied = aDecimal.times(bDecimal).toFixed(2);
    return multiplied;
  }
}

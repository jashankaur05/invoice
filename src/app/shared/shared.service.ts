import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  companyInvoiceData = new BehaviorSubject([]);
  companyInvoiceObservable = this.companyInvoiceData.asObservable();

  private companySource = new BehaviorSubject<any>(null); // BehaviorSubject to store the company data
  currentCompany = this.companySource.asObservable();

  constructor() { }

  setInvoiceData(data: any) {
    this.companyInvoiceData.next(data);
  }

  changeCompany(company: any) {
    this.companySource.next(company);
  }

}

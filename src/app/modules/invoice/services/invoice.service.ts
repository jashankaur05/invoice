import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private db: AngularFireDatabase) { }

  // Get the current financial year
  getCurrentFinancialYear(): string {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based

    const yearStart = currentMonth >= 4 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    const yearEnd = yearStart + 1;

    return `${yearStart}-${yearEnd}`;
  }

  // Fetch all company data from Firebase Realtime Database
  getCustomers(): Observable<any[]> {
    return this.db.list('customers').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          const val = c.payload.val();
          return { key: c.payload.key, ...(typeof val === 'object' ? val : {}) };
        })
      )
    );
  }

  // Fetch a single company by name
  getCompanyById(id: string): Observable<any> {
    return this.db.list('companies', ref => ref.orderByChild('id').equalTo(id))
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c => {
            const val = c.payload.val();
            return { key: c.payload.key, ...(typeof val === 'object' ? val : {}) };
          })
        )
      );
  }

  // Add a new company to Firebase Realtime Database
  addCompany(companyDetails: any) {
    const randomId = this.generateRandomId();
    const companyData = {
      id: randomId,  // Add the generated ID
      ...companyDetails
    };

    return this.db.list('companies').push(companyData);
  }

  // Method to update an existing company in Firebase
  updateCompany(companyId: string, companyData: any) {
    return this.db.object(`companies/${companyId}`).update(companyData);
  }

  // Utility function to generate a random ID
  private generateRandomId(): string {
    // You can modify this to any random ID generation logic you prefer
    return Math.random().toString(36).substr(2, 9) + Date.now();
  }

  getInvoices(financialYear: string, companyId: string): Observable<any[]> {
    return this.db.list(`invoices/${financialYear}`, ref => ref.orderByChild('companyId').equalTo(companyId)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          const val = c.payload.val();
          return { key: c.payload.key, ...(typeof val === 'object' ? val : {}) };
        })
      )
    );
  }


  addInvoice(invoiceDetails: any, financialYear: any) {
    const randomId = this.generateRandomId();
    const invoiceData = {
      id: randomId,
      ...invoiceDetails
    }
    return this.db
      .list(`/invoices/${financialYear}`)
      .push(invoiceData) // Storing in Firebase
  }

  updateInvoiceLockStatus(financialYear: any, invoiceid: string, invoiceData: any) {
    return this.db.object(`invoices/${financialYear}/${invoiceid}`).update({ locked: invoiceData.locked });
  }

  // Fetch a single company by name
  getInvoiceById(financialYear: string, key: string): Observable<any> {
    return this.db.list(`invoices/${financialYear}/${key}`).snapshotChanges().pipe(
      map(changes => {
        let invoiceObj: any = {};

        changes.forEach(c => {
          const value = c.payload.val();

          if (typeof value === 'object') {
            invoiceObj[c.payload.key] = { ...value };  // Assign object values as is
          } else {
            invoiceObj[c.payload.key] = value;  // Assign primitive values directly
          }
        });

        return invoiceObj;  // Return the transformed object with key-value pairs
      })
    );
  }

  updateInvoice(financialYear: string, key: string, invoiceData: any) {
    return this.db.object(`invoices/${financialYear}/${key}`).update(invoiceData);
  }

  deleteInvoice(financialYear: string, key: string) {
    return this.db.object(`invoices/${financialYear}/${key}`).remove();
  }


  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getCustomerByKey(key: string): Observable<any[]> {
    return this.db.list(`customers/${key}`).snapshotChanges().pipe(
      map(changes => {
        let invoiceObj: any = {};

        changes.forEach(c => {
          const value = c.payload.val();

          if (typeof value === 'object') {
            invoiceObj[c.payload.key] = { ...value };  // Assign object values as is
          } else {
            invoiceObj[c.payload.key] = value;  // Assign primitive values directly
          }
        });

        return invoiceObj;  // Return the transformed object with key-value pairs
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  // Add a new company to Firebase Realtime Database
  addCustomer(customerDetails: any) {
    const randomId = this.generateRandomId();
    const customerData = {
      id: randomId,  // Add the generated ID
      ...customerDetails
    };

    return this.db.list('customers').push(customerData);
  }
  editCustomer(key: string, invoiceData: any) {
    return this.db.object(`customers/${key}`).update(invoiceData);
  }

  // Utility function to generate a random ID
  private generateRandomId(): string {
    // You can modify this to any random ID generation logic you prefer
    return Math.random().toString(36).substr(2, 9) + Date.now();
  }
}

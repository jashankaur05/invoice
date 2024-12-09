import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private db: AngularFireDatabase) { }

  // Add a new company to Firebase Realtime Database
  addCompany(companyDetails: any) {
    const randomId = this.generateRandomId();
    const companyData = {
      id: randomId,  // Add the generated ID
      ...companyDetails
    };

    return this.db.list('companies').push(companyData);
  }

  editCompany(key: string, invoiceData: any) {
    return this.db.object(`companies/${key}`).update(invoiceData);
  }

  // Utility function to generate a random ID
  private generateRandomId(): string {
    // You can modify this to any random ID generation logic you prefer
    return Math.random().toString(36).substr(2, 9) + Date.now();
  }
}

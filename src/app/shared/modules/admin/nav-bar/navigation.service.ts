import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private db: AngularFireDatabase) { }

  // Fetch all company data from Firebase Realtime Database
  getCompanies(): Observable<any[]> {
    return this.db.list('companies').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          const val = c.payload.val();
          return { key: c.payload.key, ...(typeof val === 'object' ? val : {}) };
        })
      )
    );
  }

  getInvoices(financialYear: string, companyName: string): Observable<any[]> {
    return this.db.list(`invoices/${financialYear}`, ref => ref.orderByChild('companyName').equalTo(companyName)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          const val = c.payload.val();
          return { key: c.payload.key, ...(typeof val === 'object' ? val : {}) };
        })
      )
    );
  }
}

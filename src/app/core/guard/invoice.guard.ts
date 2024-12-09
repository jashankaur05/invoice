import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { InvoiceService } from 'src/app/modules/invoice/services/invoice.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceGuard implements CanActivate {
  constructor(private invoiceService: InvoiceService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let financialYear = route.paramMap.get('year');
    financialYear = financialYear + "-" + (+financialYear + 1);
    const invoiceId = route.paramMap.get('id');
    return this.invoiceService.getInvoiceById(financialYear, invoiceId).pipe(
      map(data => !data?.locked), // Return true if the invoice is not locked
      tap(isUnlocked => {
        if (!isUnlocked) {
          this.router.navigateByUrl('/invoice'); // Navigate away if locked
        }
      }),
      catchError(error => {
        console.error('Error fetching invoice:', error);
        this.router.navigateByUrl('/invoice'); // Handle error case
        return of(false); // Block navigation on error
      })
    );
  }
}

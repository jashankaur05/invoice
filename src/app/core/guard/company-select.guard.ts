import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({  // Add Injectable decorator to make the guard injectable
  providedIn: 'root'
})

export class CompanySelectGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const companyData = localStorage.getItem('companyData');
    
    if (companyData) {
      // Allow navigation if companyData exists
      return of(true);
    } else {
      // Navigate to home and prevent the current navigation
      this.router.navigate(['/default']);
      return of(false);
    }

  }
}

// Angular import
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';
import { SharedService } from 'src/app/shared/shared.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-nav-left',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbDropdownModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit, OnChanges {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();
  @Input() companies: any[] = [];
  companyForm: FormGroup;

  constructor(
    private sharedService: SharedService,
    private navigationService: NavigationService
  ) {
    this.companyForm = new FormGroup({
      companiesDropdown: new FormControl('')
    })
  }

  ngOnInit(): void {
    // Retrieve companyData from localStorage
    const storedCompanyData = localStorage.getItem('companyData');
    if (storedCompanyData) {
      const companyData = JSON.parse(storedCompanyData);
      this.companyForm.get('companiesDropdown')?.setValue(companyData[0].key);
    }
  }


  ngOnChanges(): void {
    this.companies = this.companies.map(company => {
      const [startYear, endYear] = company.financialYear.split('-');
      return {
        ...company,
        financialYearRange: `1st April ${startYear} - 31st March ${endYear}`
      };
    });
  }

  onCompanyChange(event: any) {
    const company: any = this.companies.filter(company => company.key === event.value);
    localStorage.setItem('companyData', JSON.stringify(company));
    this.sharedService.changeCompany(company);
    let invoices = [];
    this.navigationService.getInvoices(company[0].financialYear, company[0].companyName).subscribe({
      next: (resp: any) => {
        if(resp?.length > 0) {
          invoices = resp;
        }
      },
      error: (error: any) => {
        console.log('error in invoices', error);
      },
      complete: () => {
        this.sharedService.setInvoiceData(invoices);
      }
    })
  }

}

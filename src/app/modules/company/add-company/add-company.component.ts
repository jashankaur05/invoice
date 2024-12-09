import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { CompanyService } from '../services/company.service';
import { NgxLoadingModule } from 'ngx-loading';
import { NavigationService } from 'src/app/shared/modules/admin/nav-bar/navigation.service';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { Currency } from '../../invoice/models/company-details';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CalendarModule, NgxLoadingModule, TableModule,MultiSelectModule,InputTextModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent {
  companyDetailsForm: FormGroup;
  isNewCompany = false;
  companies: any[] = [];
  address: any;
  isLoading = false;
  minYear: Date;
  maxYear: Date;
  minInvoiceDate: Date | undefined; // Minimum date for the calendar
  maxInvoiceDate: Date | undefined; // Maximum date for the calendar
  viewDate: Date;
  currentYear = new Date().getFullYear();
  columns = [
    { field: 'companyName', header: 'Company Name' ,sortable:true},
    { field: 'financialYear', header: 'Financial Year' ,sortable:true},
    { field: 'companyAddress', header: 'Company Address',sortable:true },
    { field: 'companyGSTNo', header: 'Company GST No',sortable:true }
  ]
  isEdit = false;
  companyKey: string;
  companyNames: any;
  ExitCompanymsg: string;
  companyFinancalYear: any;
  currentSortField: string | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null; 
  resetFromValue: any;
  currencies = Object.values(Currency);
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private companyService: CompanyService,
    private navigationService: NavigationService,
    private router:Router
  ) {
    this.minYear = new Date(2020, 0, 1); // Year 2000, January 1st
    this.maxYear = new Date(new Date().getFullYear(), 11, 31);
  }

  initCompanyForm() {
    this.companyDetailsForm = this.fb.group({
      companyName: ['', [Validators.required,Validators.minLength(4)]],
      companyAddress: ['', Validators.required],
      companyGSTNo: ['',[Validators.minLength(15)]],
      companyBank: ['', Validators.required],
      companyBankAccount: ['', [Validators.required,Validators.minLength(12)]],
      companyBankIfscCode: ['',[Validators.required,Validators.minLength(11)]],
      companyBankSwiftId: ['', [Validators.required,Validators.minLength(11)]],
      companyWebsite: [''],
      companyEmail: ['', [ Validators.email]],
      financialYear: [null, Validators.required],
      gstInvoicePrefix: ['', Validators.required],
      exportInvoicePrefix: ['', Validators.required],
      lut: ['',],
      // currency:['INR (₹)']
    });

    // Set initial viewDate to current month
    this.viewDate = new Date();
  }

  ngOnInit(): void {
    this.initCompanyForm();
    this.getCompanies();
    this.resetFromValue = {
      companyName: this.companyDetailsForm.get('companyName').value || '',
      companyAddress: this.companyDetailsForm.get('companyAddress').value || '',
      companyGSTNo: this.companyDetailsForm.get('companyGSTNo').value || '',
      companyBank: this.companyDetailsForm.get('companyBank').value || '',
      companyBankAccount: this.companyDetailsForm.get('companyBankAccount').value || '',
      companyBankIfscCode: this.companyDetailsForm.get('companyBankIfscCode').value || '',
      companyBankSwiftId: this.companyDetailsForm.get('companyBankSwiftId').value || '',
      companyWebsite: this.companyDetailsForm.get('companyWebsite').value || '',
      companyEmail: this.companyDetailsForm.get('companyEmail').value || '',
      financialYear: this.companyDetailsForm.get('financialYear').value || '',
      gstInvoicePrefix: this.companyDetailsForm.get('gstInvoicePrefix').value || '',
      exportInvoicePrefix: this.companyDetailsForm.get('exportInvoicePrefix').value || '',
      lut: this.companyDetailsForm.get('lut').value || '',
      // currency:this.companyDetailsForm.get('currency').value || '',
    };
  }


  onSort(field: string) {
    if (this.currentSortField === field) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set to ascending if a new column is sorted
      this.currentSortField = field;
      this.currentSortDirection = 'asc';
    }
    this.companies.sort((a, b) => {
      if (this.currentSortDirection === 'asc') {
        return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      } else {
        return a[field] > b[field] ? -1 : a[field] < b[field] ? 1 : 0;
      }
    });
  }
  getCompanies() {
    this.navigationService.getCompanies().subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if(resp?.length > 0) {
          this.companies = resp;
          // Sort company names  alphabetically
          this.companies = resp.sort((a: any, b: any) => a.companyName.localeCompare(b.companyName));
          this.companyNames = resp.map(company => company.companyName);
          this.companyFinancalYear = resp.map(company => company.financialYear)
  
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log('error', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Update the viewDate of the calendar based on selected financial year
  updateViewDateBasedOnFinancialYear(selectedYear: string): void {
    if (parseInt(selectedYear) === this.currentYear) {
      // If current financial year is selected, open the calendar in the current month
      this.viewDate = new Date();
    } else {
      // For a future financial year, open on 1st April of the selected year
      this.viewDate = new Date(parseInt(selectedYear), 3, 1); // April is month index 3
    }
  }

  // Set the min and max date based on the selected financial year
  setFinancialYearDateRange(): void {
    // Assuming financial year starts from April 1st and ends on March 31st of the next year
    const currentYear = new Date(this.companyDetailsForm.get('financialYear')?.value).getFullYear();
    this.updateViewDateBasedOnFinancialYear(currentYear.toString())
    const startFinancialYear = new Date(currentYear, 3, 1); // April 1st of the current year
    const endFinancialYear = new Date(currentYear + 1, 2, 31); // March 31st of the next year
    this.minInvoiceDate = startFinancialYear;
    this.maxInvoiceDate = endFinancialYear;
   
  }
  watchFormChanges(): void {
    this.companyDetailsForm.valueChanges.subscribe(() => {
      this.checkForDuplicate();
    });
  }
  checkForDuplicate(): void {
    const companyName = this.companyDetailsForm.get('companyName')?.value;
    const financialYear = this.companyDetailsForm.get('financialYear')?.value || null
     if (!financialYear) {
       return; 
       }
       let year = financialYear.getFullYear() 
  
    // Check for duplicates
    const exists = this.companies.some(company =>
      company.companyName?.toLowerCase() === companyName?.toLowerCase() &&
      company.financialYear.startsWith(year)
    );
    
    if (exists) {
      this.toastr.info('This company name already exists for the selected financial year.')
    } else {
         
    }
  }
  onSubmit() {
    this.isLoading = true;

    if (this.companyDetailsForm.invalid || this.ExitCompanymsg) {
      this.isLoading = false;
      this.companyDetailsForm.markAllAsTouched(); // Marks all fields as touched to show validation errors
      return;
    }
  
    // if (!this.companyDetailsForm.contains('lut')) {
    //   this.companyDetailsForm.addControl('lut', new FormControl('')); // Add GST with required validation if needed
    // } else {
    //   this.companyDetailsForm.removeControl('lut');
    // }
  
    let companyData = this.companyDetailsForm.value;
    const selectedFinancialYear = this.companyDetailsForm.get('financialYear')?.value 
    const financialYear = new Date(selectedFinancialYear).getFullYear() + '-' + (new Date(selectedFinancialYear).getFullYear() + 1) ;
              companyData.financialYear = financialYear;
      //    const currentDate =  this.companyDetailsForm.get('financialYear')?.value ; // Current date
      // const currentMonthIndex = currentDate.getMonth(); // 0-indexed (0 = January)
      // // Create a date for the same day next year
      // const nextYearDate = new Date(currentDate.getFullYear() + 1, currentMonthIndex, currentDate.getDate());
      // const monthNames = [
      //     'January', 'February', 'March', 'April', 'May', 'June',
      //     'July', 'August', 'September', 'October', 'November', 'December'
      // ];
      // const currentMonthName = monthNames[currentMonthIndex];
      // const nextYearMonthName = monthNames[nextYearDate.getMonth()];
  
      // const combinedFormattedDates = `${currentDate.getDate()} ${currentMonthName} ${currentDate.getFullYear()} - ${nextYearDate.getDate() - 1} ${nextYearMonthName} ${nextYearDate.getFullYear()}`;
      // // const formattedNextYearDate = `${nextYearDate.getDate()-1} ${nextYearMonthName} ${nextYearDate.getFullYear()}`;
  
      // console.log('Current Date:', combinedFormattedDates)
      
    if(this.isEdit) {
      companyData = {...this.companyDetailsForm.value,key:this.companyKey};
    //  return console.log(companyData,'update company details')
      this.editCompany(companyData);
    }
    else { 
    // return  console.log({...companyData,FinanacialYearRange:combinedFormattedDates})
      this.addCompany(companyData);
    }
  
    // this.navigationService.getCompanies().subscribe({
    //   next: (resp: any) => {
    //     this.isLoading = false;
        
    //     if (resp?.length > 0) {
    //       debugger;
    //       this.companies = resp;
  
    //       // Check if the company already exists with the same name and financial year
    //       const companyExists = this.companies.some(company => 
    //         company.financialYear === financialYear && 
    //         company.companyName.toLowerCase() === companyData.companyName.toLowerCase()
    //       );
  
    //       if (companyExists) {
    //         debugger;
    //         this.toastr.error('Company already exists for the selected financial year');
    //       } else {
    //         // If no match is found, proceed with adding the new company
    //         debugger;
    //         this.addCompany(companyData);
    //       }
    //     } else {
    //       debugger;
          // If no companies are returned, proceed with adding the company
          // this.addCompany(companyData);
    //     }
    //   },
    //   error: (error: any) => {
    //     this.isLoading = false;
    //     console.log('error', error);
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //   }
    // });
  }
  

  addCompany(companyData) {
    // companyData.preventDefault();
    this.companyService.addCompany(companyData).then(() => {
      this.isLoading = false;
      this.toastr.success('Company details saved successfully!');
      this.resetForm();
    }).catch((error) => {
      this.toastr.error(error);
    });
  }

  editCompany(companyData) {
    // return;
    this.companyService.editCompany(companyData.key, companyData).then(() => {
      this.isLoading = false;
      this.toastr.success('Company details updated successfully!');
       this.isEdit = false
      this.resetForm();
    }).catch((error) => {
      this.toastr.error(error);
    });
  }

  setCompanyDetails(companyData) {
    this.isEdit = true;
    this.resetFromValue = companyData
    const financialYear = companyData.financialYear.split('-')[0];
    this.companyKey = companyData.key;
    this.companyDetailsForm.patchValue({
      companyName: companyData.companyName || '',
      companyAddress: companyData.companyAddress || '',
      companyGSTNo: companyData.companyGSTNo || '',
      companyBank: companyData.companyBank || '',
      companyBankAccount: companyData.companyBankAccount || '',
      companyBankIfscCode: companyData.companyBankIfscCode || '',
      companyBankSwiftId: companyData.companyBankSwiftId || '',
      companyWebsite: companyData.companyWebsite || '',
      companyEmail: companyData.companyEmail || '',
      financialYear: new Date(financialYear, 1, 0) || '',
      gstInvoicePrefix: companyData.gstInvoicePrefix || '',
      exportInvoicePrefix: companyData.exportInvoicePrefix || '',
      lut: companyData.lut || '',
      // currency:companyData.currency ||  'INR (₹)',
    })
  }

  resetForm() {
    if(!this.isEdit){
    this.minInvoiceDate = null;
    this.maxInvoiceDate = null;
    this.companyDetailsForm.reset({
      companyName: '',
      companyAddress: '',
      companyGSTNo: '',
      companyBank: '',
      companyBankAccount:'',
      companyBankIfscCode:  '',
      companyBankSwiftId:  '',
      companyWebsite:  '',
      companyEmail:  '',
      financialYear: '',
      gstInvoicePrefix:  '',
      exportInvoicePrefix:  '',
      lut: '',
      // currency:'INR (₹)',
   
    });
    
    // this.companyDetailsForm.reset();
    }else{
       this.resetValue()
    }
  }
resetValue(){
  const financialYear = this.resetFromValue.financialYear.split('-')[0];
  this.companyDetailsForm.patchValue({
    companyName: this.resetFromValue.companyName || '',
    companyAddress: this.resetFromValue.companyAddress || '',
    companyGSTNo: this.resetFromValue.companyGSTNo || '',
    companyBank: this.resetFromValue.companyBank || '',
    companyBankAccount: this.resetFromValue.companyBankAccount || '',
    companyBankIfscCode: this.resetFromValue.companyBankIfscCode || '',
    companyBankSwiftId: this.resetFromValue.companyBankSwiftId || '',
    companyWebsite: this.resetFromValue.companyWebsite || '',
    companyEmail: this.resetFromValue.companyEmail || '',
    financialYear: new Date(financialYear, 1, 0) || '',
    gstInvoicePrefix: this.resetFromValue.gstInvoicePrefix || '',
    exportInvoicePrefix: this.resetFromValue.exportInvoicePrefix || '',
    lut: this.resetFromValue.lut || '',
    // currency: this.resetFromValue.currency ||  'INR (₹)',
  })
  
}
  cancelButton(){
    this.companyDetailsForm.reset();
    this.isEdit = false
    this.router.navigateByUrl('/add-company')
  }
}

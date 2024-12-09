import { NgxLoadingModule } from 'ngx-loading';
import { Currency, GSTCurrency, InvoiceData } from './../models/company-details';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { InvoiceService } from '../services/invoice.service';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { take } from 'rxjs';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete-esb';
import { Address } from 'ngx-google-places-autocomplete-esb/lib/objects/address';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StepperModule, ButtonModule, CalendarModule, FormsModule, GooglePlaceModule, NgxLoadingModule, DropdownModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
})
export class InvoiceFormComponent {
  financialYearForm: FormGroup;
  invoiceForm: FormGroup;
  companyDetailsForm: FormGroup;
  invoiceNumber: string;
  currentYearInvoicesCount = 0;
  date: Date | undefined;
  nextYear = new Date().getFullYear() + 1;
  active: number | undefined = 0;
  minInvoiceDate: Date | undefined; // Minimum date for the calendar
  maxInvoiceDate: Date | undefined; // Maximum date for the calendar
  viewDate: Date;
  currentYear = new Date().getFullYear();
  isNewCompany = false;
  companies: any[] = [];
  address: any;
  isLoading = false;
  minYear: Date;
  maxYear: Date;
  isGstInvoice = true;
  currencies = Object.values(Currency);
  GSTCurrency = Object.values(GSTCurrency);
  invoiceId: string;
  editInvoiceFinancialYear: string;
  selectedInvoiceData: any;
  customers: any[] = [];
  companyData: any;
  invoiceData: InvoiceData;
  isEditForm = false
  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.minYear = new Date(2020, 0, 1); // Year 2000, January 1st
    this.maxYear = new Date(new Date().getFullYear(), 11, 31);

    this.route.params.subscribe(params => {
      this.invoiceId = params['id']; // Assuming 'id' is the parameter name in the route
    });
  }

  isEdit() {
    return this.invoiceId;
  }
  ngOnInit(): void {

    this.initInvoiceForm();
    this.sharedService.currentCompany.subscribe((company) => {
      if (company) {
        this.companyData = company[0];
        this.setFinancialYearDateRange();
      }
    });

    let companyData = JSON.parse(localStorage.getItem('companyData'));
    if (companyData) {
      this.companyData = companyData[0];
      this.setFinancialYearDateRange();
    }

    if (this.isEdit()) {
      this.getInvoiceById();
    }
    else {
      this.addItem();
    }
    this.getCustomers();
    console.log('fgfg',this.invoiceData)
  }
  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      invoiceType: ['2', Validators.required],
      invoiceDate: [null, Validators.required],
      clientId: ['', Validators.required],
      items: this.fb.array([]), // Start with one item by default
      currency: ['', Validators.required],
      gst: [null], // GST percentage between 0 and 100,
    });
    this.updateGstValidation()
  }
  get gst() {
    return this.invoiceForm.get('gst');
  }
  updateGstValidation() {
    debugger
    const gstControl = this.invoiceForm.get('gst');
    const invoiceType = this.invoiceForm.get('invoiceType')?.value;
  console.log(invoiceType,'fgfg',this.invoiceData)
    if (invoiceType === '2') {
      // Add validation rules dynamically for invoiceType 2
      gstControl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(3),
        Validators.pattern(/^(?:\d{1,2}(?:\.\d{1,2})?)?$/), // Up to 2 decimal places
      ]);
    } else {
      // Clear validation rules for other invoice types
      gstControl?.clearValidators();
    }
  
    // Recalculate the control's validity
    gstControl?.updateValueAndValidity();
  }
  
  getCustomers() {
    this.invoiceService.getCustomers().subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (resp?.length > 0) {
          this.customers = resp;
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

  getInvoiceById() {
    this.isLoading = true;
    const financialYear = this.companyData.financialYear;
    this.invoiceService.getInvoiceById(financialYear, this.invoiceId).subscribe((data) => {
      this.isLoading = false;
      this.selectedInvoiceData = data;
      this.setInvoiceDetails(this.selectedInvoiceData);
    })
  }

  setInvoiceDetails(invoice: InvoiceData) {
    this.isEditForm = true;
    this.invoiceData = invoice
    this.invoiceForm.patchValue({
      invoiceType: invoice?.invoiceType || '2',
      invoiceDate: new Date(invoice?.invoiceDate) || null,
      clientId: invoice?.clientId || '',
      currency: invoice?.currency || '',
      gst: invoice?.gst || null,
    });
    this.items.clear();
    const itemsArray = Array.isArray(invoice?.items) ? invoice.items : Object.values(invoice?.items || {});

    if (Array.isArray(itemsArray)) {
      itemsArray.forEach((item: any) => {
        this.items.push(
          this.fb.group({
            description: [item?.description || ''],
            sacCode: [item?.sacCode || ''],
            amount: [item?.amount || '']
          })
        );
      });
    }

    if (invoice.invoiceType !== "2") {
      this.isGstInvoice = false;
    }
    if (this.invoiceForm.get('invoiceType')?.value && this.isEditForm) {
      this.invoiceForm.get('invoiceType')?.disable();
    } else {
      this.invoiceForm.get('invoiceType')?.enable();
    }
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

  // Get the items form array
  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // Create a new item group
  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      sacCode: ['', [Validators.required, Validators.minLength(6)]],
      amount: ['', Validators.required] // Ensure amount is positive
    });
  }

  // Add a new item row
  addItem(): void {
    this.items.push(this.createItem());
  }

  // Remove an item row, but not the first one
  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // Fetch the number of invoices in the current financial year
  getInvoiceCountForCurrentFinancialYear(): void {
    const financialYear = this.invoiceService.getCurrentFinancialYear();

    this.db.list(`/invoices/${financialYear}`).valueChanges().subscribe((invoices) => {
      this.currentYearInvoicesCount = invoices.length || 0;
      this.invoiceNumber = this.generateInvoiceNumber(financialYear, this.currentYearInvoicesCount + 1);
    });
  }

  // Generate the invoice number in the format: "Month-G-001"
  generateInvoiceNumber(financialYear: string, invoiceCount: number): string {
    const month = new Date().toLocaleString('en-US', { month: 'short' });
    const invoiceSeq = String(invoiceCount).padStart(3, '0'); // Add leading zeros
    return `${invoiceSeq}`;
  }


  // Submit form and handle data
  onSubmit(): void {
    debugger
    this.isLoading = true;
    // Check invoiceType and conditionally add or remove GST control
    const invoiceType = this.invoiceForm.get('invoiceType')?.value;
    if (invoiceType === "1") {
      this.invoiceForm.removeControl('gst');
    } else {
      this.invoiceForm.addControl('gst', new FormControl(null, [Validators.required, Validators.min(0), Validators.max(3), Validators.pattern(/^(?:\d{1,2}(?:\.\d{1,2})?)?$/),])); // Add GST with required validation if needed

    }
    if (this.invoiceForm.invalid) {
      this.isLoading = false;
      this.invoiceForm.markAllAsTouched(); // Marks all fields as touched to show validation errors
      return;
    }
    let invoiceData = this.invoiceForm.value;
    invoiceData.totalAmount = this.getTotalAmount();
    const items = this.invoiceForm.get('items').value;
    // return;
    const amountSum = items.reduce((sum, item) => sum + (+item.amount), 0);
    invoiceData.amount = amountSum;

    const financialYear = this.companyData?.financialYear;
    invoiceData.locked = false;
    invoiceData = {
      companyId: this.companyData.key,
      ...invoiceData
    }
    this.db.list(`/invoices/${financialYear}`).snapshotChanges().pipe(take(1)).subscribe((invoices) => {
      this.currentYearInvoicesCount = invoices.length || 0;

      invoiceData.invoiceDate = this.invoiceService.formatDate(invoiceData.invoiceDate);
      if (this.isEdit()) {

        this.updateInvoice(financialYear, this.invoiceId, invoiceData);
      }
      else {

        this.invoiceNumber = this.generateInvoiceNumber(financialYear, this.currentYearInvoicesCount + 1);
        invoiceData.invoiceNumber = this.invoiceNumber;
        this.addInvoice(invoiceData, financialYear);
      }
    });
  }

  addInvoice(invoiceData: InvoiceData, financialYear: string) {
    this.invoiceService.addInvoice(invoiceData, financialYear).then(() => {
      this.isLoading = false;
      this.toastr.success('Invoice saved successfully')
      this.resetForm();
    }).catch((error) => {
      this.isLoading = false;
      this.toastr.error(error);
    });
  }

  updateInvoice(year: string, invoiceId: string, invoiceData: InvoiceData) {
    this.invoiceService.updateInvoice(year, invoiceId, invoiceData).then(() => {
      this.isLoading = false;
      this.isEditForm = false
      this.toastr.success('Invoice Updated Successfully');
      const invoiceType = this.invoiceData.invoiceType
      this.router.navigate(['/invoice'],{ queryParams: { invoiceType: invoiceType }})
    }).catch((error) => {
      this.isLoading = false;
      this.toastr.error(error);
    });
  }

  resetForm() {
    if (!this.invoiceId) {
      this.invoiceForm.reset({
        invoiceType: this.invoiceForm.get('invoiceType')?.value,
        invoiceDate: null,
        clientId: '',
        currency: '',
        gst: null,
        items: this.fb.group({
          description: [''],
          sacCode: [''],
          amount: ['']
        })
      });
    } else {
      this.resetFormValue()
    }
  }
  resetFormValue() {
    this.invoiceForm.patchValue({
      invoiceDate: new Date(this.invoiceData?.invoiceDate) || null,
      clientId: this.invoiceData?.clientId || '',
      gst: this.invoiceData?.gst || null,
    });
    this.items.clear();
    const itemsArray = Array.isArray(this.invoiceData?.items) ? this.invoiceData.items : Object.values(this.invoiceData?.items || {});

    if (Array.isArray(itemsArray)) {
      itemsArray.forEach((item: any) => {
        this.items.push(
          this.fb.group({
            description: [item?.description || ''],
            sacCode: [item?.sacCode || ''],
            amount: [item?.amount || '']
          })
        );
      });
    }

  }
  cancelButton() {
    const invoiceType = this.invoiceData.invoiceType
    this.invoiceForm.reset();
    this.router.navigate(['/invoice'],{ queryParams: { invoiceType: invoiceType }})
  }

  // Set the min and max date based on the selected financial year
  setFinancialYearDateRange(): void {
    this.invoiceForm.get('invoiceDate')?.setValue(null);
    // Assuming financial year starts from April 1st and ends on March 31st of the next year
    const currentYear = this.companyData.financialYear.split('-')[0];
    this.updateViewDateBasedOnFinancialYear(currentYear.toString())
    const startFinancialYear = new Date(currentYear, 3, 1); // April 1st of the current year
    const endFinancialYear = new Date((+currentYear + 1), 2, 31); // March 31st of the next year
    this.minInvoiceDate = startFinancialYear;
    this.maxInvoiceDate = endFinancialYear;
  }

  handleAddressChange(address: Address) {
    // Do some stuff
    this.address = address.formatted_address;
  }

  getTotalAmount() {
    const items = this.invoiceForm.get('items').value;
    const amountSum = items.reduce((sum, item) => sum + (+item.amount), 0);
    let gstAmount = 0;
    if (this.invoiceForm.contains('gst'))
      gstAmount = amountSum * (this.invoiceForm.get('gst')?.value / 100);
    return (+amountSum) + (+gstAmount);
  }

  // Toggle between new company and existing company selection
  toggleNewCompany(event: any): void {
    this.isNewCompany = event.target.checked;
    if (this.isNewCompany) {
      // If adding a new company, clear the selected company from the dropdown
      this.companyDetailsForm.reset();
    }
    else {
      this.companyDetailsForm.get('companyName')?.setValue('');
    }
  }

  toggleInvoiceType(id: string): void {
    this.isGstInvoice = (id !== 'exportInvoice')
    // this.updateGstValidation()
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);

    // Allow numbers (48-57), period (46), space (32)
    if (
      (charCode < 48 || charCode > 57) && // Not a number
      charCode !== 46 && // Not a period (.)
      charCode !== 32 // Not a space
    ) {
      event.preventDefault();
    }

    // Optional: Ensure only one period allowed
    const input = (event.target as HTMLInputElement).value;
    if (char === '.' && input.includes('.')) {
      event.preventDefault();
    }
  }
}
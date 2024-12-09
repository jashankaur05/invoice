import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { CustomerService } from '../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { InvoiceService } from '../../invoice/services/invoice.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ReactiveFormsModule, NgxLoadingModule, CommonModule,FormsModule, TableModule,InputTextModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent implements OnInit {
  customerDetailsForm: FormGroup;
  isLoading = false;
  customers: any;
  columns = [
    { field: 'customerName', header: 'Customer Name',sortable:true },
    { field: 'customerAddress', header: 'Customer Address',sortable:true },
    { field: 'customerGSTNo', header: 'Customer GST No' ,sortable:true}
];
  isEdit: boolean;
  companyKey: any;
  resetFormValue: any;
  filterTableValue: string = '';
  dataTable: any;
  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    private router:Router
  ) {
    this.initCustomerForm();
  }

  initCustomerForm() {
    this.customerDetailsForm = new FormGroup({
      customerName: new FormControl('', [Validators.required,Validators.minLength(3)]),
      customerAddress: new FormControl('', [Validators.required]),
      customerGSTNo: new FormControl('', [Validators.required,Validators.minLength(15)]),
    })
  }

  ngOnInit() {
    this.getCustomers();
  }
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;  // Cast event.target to HTMLInputElement
    this.dataTable.filterGlobal(input.value, 'contains');
  }
  getCustomers() {
    this.isLoading = true;
    this.invoiceService.getCustomers().subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if(resp?.length > 0) {
          this.customers = resp;
          this.customers = resp.sort((a: any, b: any) => a.customerName.localeCompare(b.customerName));
        }
      },
      error: (error: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.customerDetailsForm.invalid) {
      this.isLoading = false;
      this.customerDetailsForm.markAllAsTouched(); // Marks all fields as touched to show validation errors
      return;
    }
    let customerData = this.customerDetailsForm.value;
    if(this.isEdit){
        customerData = {...this.customerDetailsForm.value,key:this.companyKey};
       //  return console.log(customerData,'edit customer')
         this.editCustomer(customerData)

    }else{
        this.customerService.addCustomer(customerData).then(() => {
         this.isLoading = false;
      // return console.log(customerData,'customer data add')
         this.toastr.success('Customer details saved successfully!');
         this.resetForm();
    }).catch((error) => {
      this.toastr.error(error);
      console.log(error)
    });
  }
  }
  editCustomer(customerData){
    this.customerService.editCustomer(customerData.key,customerData).then(()=>{
      this.isLoading = false
      this.isEdit = false
      this.toastr.success('Customer details updated successfully!');
      this.resetForm()

    }).catch((error)=>{
      this.toastr.error(error)
    })
  }
  setCompanyDetails(customerData) {
    this.isEdit = true;
    this.resetFormValue = customerData
    this.companyKey = customerData.key;
    this.customerDetailsForm.patchValue({
      customerName: customerData.customerName || '',
      customerAddress: customerData.customerAddress || '',
      customerGSTNo: customerData.customerGSTNo || '',
    
    })
  }
  resetForm() {
    if(!this.isEdit){
    this.customerDetailsForm.reset();
  }else{
    this.resetValue()
  }
  }
  resetValue(){
    this.customerDetailsForm.patchValue({
      customerName: this.resetFormValue.customerName || '',
      customerAddress: this.resetFormValue.customerAddress || '',
      customerGSTNo: this.resetFormValue.customerGSTNo || '',
    
    })
  }
  cancelButton(){
    this.isEdit  = false
    this.customerDetailsForm.reset();
    this.router.navigateByUrl('/add-customer')
  }
}

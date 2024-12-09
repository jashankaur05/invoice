import { CustomColumnFilterDirective } from './components/custom-column-filter.directive';
import { AfterViewInit, ChangeDetectionStrategy, ElementRef, HostListener, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { Subject, finalize, takeUntil } from 'rxjs';

import { BaseResource, Tables } from 'src/app/core/base/models/base-resource';
import { DelayExecutorService } from 'src/app/core/base/services/delay-executor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from '../models/menu-item.model';
import { TableColumn } from './models/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating'
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FilterCellComponent } from './components/filter-cell/filter-cell.component';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableToolbarComponent } from './components/table-toolbar/table-toolbar.component';
import { MenuComponent } from '../menu/menu/menu.component';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BaseService } from 'src/app/core/base/services/service-base';
import { TruncatePipe } from '../../pipes/truncate/truncate.pipe';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as FileSaver from 'file-saver';
import { InvoiceService } from 'src/app/modules/invoice/services/invoice.service';
import { NgxLoadingModule } from 'ngx-loading';
import { CalendarModule } from 'primeng/calendar';
import { ToastrService } from 'ngx-toastr';
import { InvoiceData } from 'src/app/modules/invoice/models/company-details';
import { SharedService } from '../../shared.service';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [CommonModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        ProgressBarModule,
        ToastModule,
        PaginatorModule,
        TooltipModule,
        ProgressSpinnerModule,
        TableToolbarComponent,
        TableCellComponent,
        TableFilterComponent,
        FilterCellComponent,
        CustomColumnFilterDirective,
        MenuComponent,
        TruncatePipe,
        NgxLoadingModule,
        CalendarModule
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends BaseResource = any> implements OnDestroy, OnInit {

    @ViewChild('paginator', { static: true }) paginator!: Paginator;
    @ViewChild('dataTable', { static: true }) dataTable!: Table;
    /** Displays a loader to indicate data load is in progress.*/
    @Input() tableTitle: string = '';
    @Input() tableName!: Tables;
    @Input() globalFilterFields: string[] = [];
    @Input() stateKey = "statedemo-session"
    @Input() stateStorage: "local" | "session" = "local"
    /** Add label to table name on top.*/
    @Input() isLoading: boolean = false;
    /** option to show a refresh button when a dataService is available */
    @Input() showRefreshButton = true;
    /** is filtering of data for the whole table enabled (column-specific settings available via columns input) */
    @Input() filterable = false;
    @Input() disabled = false;
    @Input() style: { [klass: string]: any } | null | undefined;
    @Input() styleClass: string = '';
    @Input() tableStyle: { [klass: string]: any } = { 'min-width': '50rem' };
    @Input() tableStyleClass: string = '';
    @Input() allowExport = true;
    @Input() exportFilename: string = 'Data';
    @Input() scrollable: boolean = false;
    invoiceData: any[];
    @Input() scrollDirection: 'vertical' | 'horizontal' | 'both' = 'vertical';
    @Input() hidePaginator = false;
    private _pageLinks: number = 10;
    filteredColumns: { field: string; header: string; visible: boolean; }[];
    redioButton: boolean = false;
    @Input() set pageLinks(rc: number) {
        this._pageLinks = rc < 1 ? 10 : rc;
    }
    get pageLinks() {
        return this._pageLinks;
    }
    @Input() set rowsPerPageOptions(op: number[]) {
        this.paginator.rowsPerPageOptions = op;
        this.paginator.changePage(0);
    }
    @Input() sortDirection: 'DESC' | 'ASC' = 'DESC';
    @Input() sortMode: 'single' | 'multiple' = 'multiple';
    @Input() selectionMode: 'single' | 'multiple' = 'multiple';
    @Input() isRowSelectable!: (event: { data: any }) => boolean;
    @Input() tableSelectable: boolean = false;
    @Input() showAction: boolean = false;
    @Input() tableMenuItems!: MenuItem[];
    @Input() selectionCommitable: boolean = false;
    @Input() dataService!: BaseService<T, any, any>
    private _selectedData: any = [];
    @Input() set selection(rows: any) {
        this._selectedData = rows;
        this.onSelectionChange();
    }
    get selection(): any {
        return this._selectedData;
    }
    @Output() selectionChange: EventEmitter<any> = new EventEmitter<any | null>();
    onSelectionChange() {
        this.selectionChange.emit(this._selectedData);
    }
    @Input() reorderableColumns = false;
    @Input() resizableColumns = true;
    @Input() label: string = '';
    @Input() set data(data: any) {
        if (this.dataService) {
            this.dataService.dataItems = data;
        }
    }
    get data() {
        return [];
    }
    @Input() set menuItems(menuItems: MenuItem[] | undefined) {
        this._menuItems = menuItems;
    }
    get menuItems(): MenuItem[] | undefined {
        return this._menuItems;
    }
    private _menuItems: MenuItem[] | undefined;
    private destroy$ = new Subject<boolean>();
    columns = [
        { field: 'invoiceNumber', header: 'Invoice Number',sortable:true },
        { field: 'invoiceDate', header: 'Invoice Date',sortable:true},
        { field: 'amount', header: 'Amount',sortable:true},
        { field: 'gst', header: 'GST (%)',sortable:true },
        { field: 'totalAmount', header: 'Total Amount',sortable:true},
        { field: 'clientName', header: 'Client Name',sortable:true},
        { field: 'clientAddress', header: 'Client Address',sortable:true},
        { field: 'clientGSTNo', header: 'Client GST No',sortable:true},
    ];
    filteredInvoiceData: any[] = [];
    selectedYear = new Date();
    minYear: Date;
    maxYear: Date;
    selectedInvoice: InvoiceData;
    first: number = 0;
    rows: number = 10;
    companyData: any;
    invoiceType = '2';

    constructor(
        public el: ElementRef,
      private toastr:ToastrService,
        private cdr: ChangeDetectorRef,
        public router: Router,
        private route:ActivatedRoute,
        private sharedService:SharedService,
        private invoiceService:InvoiceService
    ) {
        this.minYear = new Date(2020, 0, 1); // Year 2000, January 1st
        this.maxYear = new Date(new Date().getFullYear(), 11, 31);
        this.route.queryParams.subscribe((invoiceValue:InvoiceData) => {
            this.invoiceType = invoiceValue?.invoiceType ?? '2';
            console.log(this.invoiceType,'invoicetype')
          });
      
        }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.sharedService.currentCompany.subscribe((company) => {
            if (company) {
                this.companyData = company[0];
                const financialYear = this.companyData.financialYear;
                this.getInvoicesByFinancialYear(financialYear, this.companyData.key);
         
            }
            else {
                this.isLoading = false;
            }
        });

        let companyData = JSON.parse(localStorage.getItem('companyData'));
        if (companyData) {
            this.companyData = companyData[0];
            const financialYear = this.companyData.financialYear;
            this.getInvoicesByFinancialYear(financialYear, this.companyData.key);
        }
        else {
            this.isLoading = false;
           
        }

    }

    getInvoicesByFinancialYear(year, key) {
        this.invoiceService.getInvoices(year, key).subscribe((data) => {
            this.isLoading = false;
            this.invoiceData = data;
            this.filteredInvoiceData = data;
            this.fetchClientDetailsForInvoices();
              this.onInvoiceTypeChange(this.invoiceType); 
            this.cdr.detectChanges();
        })
    }

    fetchClientDetailsForInvoices(): void {
        this.invoiceData.forEach((invoice, index) => {
            this.invoiceService.getCustomerByKey(invoice?.clientId).subscribe((clientData: any) => {
                // Merge client data into the invoice object
                this.invoiceData[index].clientName = clientData?.customerName;
                this.invoiceData[index].clientAddress = clientData?.customerAddress;
                this.invoiceData[index].clientGSTNo = clientData?.customerGSTNo;
                if (!this.invoiceData[index].invoiceNumber.startsWith('E-') && !this.invoiceData[index].invoiceNumber.startsWith('G-')) {
                    this.invoiceData[index].invoiceNumber = invoice.invoiceType === "1"
                        ? `E-${invoice.invoiceNumber}`
                        : `G-${invoice.invoiceNumber}`;
                }
                      this.filteredInvoiceData = [...this.invoiceData];
                      this.filteredInvoiceData = this.filteredInvoiceData.filter(invoice => invoice.invoiceType === this.invoiceType)  ;
                      this.cdr.detectChanges();
            });
        });
    }


    // Filter invoices by selected year from p-calendar
    filterByFinancialYear(event: any): void {
        const selectedYear = new Date(event).getFullYear(); // Get the year from the selected date
        const financialYear = selectedYear + "-" + (selectedYear + 1);
        if (selectedYear) {
            this.getInvoicesByFinancialYear(financialYear, this.companyData.key)
        } else {
            // If no year is selected, show all invoices
            this.filteredInvoiceData = this.invoiceData;
        }
    }

    // Lock the invoice
lockInvoice(invoice: InvoiceData): void {
    this.invoiceData.forEach(invoice => {
        invoice.locked = false; 
    });
    // Lock the selected invoice
    invoice.locked = true;
    this.toastr.success('Invoice locked');
}

unlockInvoice(invoice: InvoiceData): void {
    this.invoiceData.forEach(invoice => {
        invoice.locked = false; 
    });
    invoice.locked = false;
    this.toastr.success('Invoice unlocked');
}

    // Update the lock status in the database
    updateInvoiceLockStatus(invoice: InvoiceData): void {
        const financialYear = this.companyData.financialYear;
        const invoiceKey = invoice.key; // Assuming each invoice has a unique key in the database
        this.invoiceService.updateInvoiceLockStatus(financialYear, invoiceKey, invoice)
            .then(() => {
                this.toastr.success(invoice.locked ? 'Invoice locked' : 'Invoice unlocked');
                this.fetchClientDetailsForInvoices()
            })
            .catch((error) => {
                this.toastr.error('Error updating invoice status');
            });
    }

    // Edit the invoice (only enabled if the invoice is not locked)
    editInvoice(invoice: InvoiceData): void {
        
        if (!invoice.locked) {
            this.selectedInvoice = invoice;
            // Navigate to the edit form or open the edit modal
            this.router.navigateByUrl(`/edit-invoice/${invoice.key}`)
        }
    }

    viewInvoice(invoice: InvoiceData) {
        const invoiceId = invoice.key; // or any unique identifier
        // window.open(`/invoice-view/${invoiceId}`, '_blank'); 
        this.router.navigateByUrl(`/invoice-view/${invoice.key}`)
  
    }
    setInvoiceType(type: string): void {
        this.invoiceType = type;
        this.onInvoiceTypeChange(this.invoiceType);
    }

    onInvoiceTypeChange(type) {
            this.filteredInvoiceData = this.invoiceData.filter(invoice => invoice.invoiceType === type)
            if(this.invoiceType === '1'){
                this.columns = this.columns.filter(col => col.field !== 'gst')
            }
    
    }
    isActionsColumnVisible() {
        // return this.columns.some(col => col.field === 'actions' && col.visible);
    }
    

}
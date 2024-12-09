import { InvoiceData } from './../models/company-details';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.service';
import { NumberToWords } from 'src/app/shared/utils/utility-functions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, NgxLoadingModule],
  templateUrl: './invoice-view.component.html',
  styleUrl: './invoice-view.component.scss',
  providers: [NumberToWords]
})
export class InvoiceViewComponent {
  invoiceData: InvoiceData;
  invoiceId: string;
  gstAmount = 0;
  totalAmount = 0;
  amountInWords: string;
  financialYear: string;
  isLoading = false;
  companyData:any = null; 
  customers: any;
  emptyRows: any[] = []; // Helper array for rendering empty rows if needed
  
  constructor(
    private db: AngularFireDatabase,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private numberToWords: NumberToWords
  ) {
    this.route.params.subscribe(params => {
      this.invoiceId = params['id']; // Assuming 'id' is the parameter name in the route
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.sharedService.currentCompany.subscribe((company) => {
      if (company) {
        this.companyData = company[0];
        this.financialYear = this.companyData.financialYear;
        this.getInvoiceById(this.financialYear, this.invoiceId);
      }
    });

    let companyData = JSON.parse(localStorage.getItem('companyData'));
    if(companyData) {
      this.companyData = companyData[0];
      this.financialYear = this.companyData.financialYear;
      this.getInvoiceById(this.financialYear, this.invoiceId);
    
    }
    
  }

  getInvoiceById(financialYear, invoiceId) {
    this.invoiceService.getInvoiceById(financialYear, invoiceId).subscribe((data) => {
      this.isLoading = false;
      this.invoiceData = data;
      this.getCustomers(this.invoiceData.clientId)
      // Ensure items is an array
      if (this.invoiceData?.items && !Array.isArray(this.invoiceData.items)) {
        this.invoiceData.items = Object.values(this.invoiceData.items); // Convert object to array
        this.calculateAmounts();
        // Generate an array to always render at least 10 rows
        this.emptyRows = new Array(Math.max(10, this.invoiceData.items.length));
      }
    })
  }

  getCustomers(key: string) {
    this.invoiceService.getCustomerByKey(key).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if(resp) {
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

  // Function to calculate total item amount and GST
  calculateAmounts(): void {
    // Calculate the total amount of all items
    this.totalAmount = this.invoiceData.items.reduce((sum: number, item: any) => sum + (+item.amount), 0);
    // Calculate GST based on total amount and the GST percentage
    if(this.invoiceData.gst) {
      this.gstAmount = (+this.totalAmount * +this.invoiceData.gst) / 100;
    }
    this.amountInWords = this.numberToWords.convertAmountToWords(this.totalAmount + this.gstAmount);
  }

  generatePDF() {
    this.isLoading = true;
    const invoiceElement = document.getElementById('invoice'); // Use the ID of your invoice container

    html2canvas(invoiceElement, {
      scale: 2, // Increase the scale for better resolution
      useCORS: true, // Helps in loading external assets like images and fonts
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait', // Set the orientation
        unit: 'pt', // Use points for better precision
        format: 'a4' // Standard A4 size
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = pageHeight;
      // const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if the content overflows
      // while (heightLeft >= 0) {
      //   position = heightLeft - imgHeight;
      //   pdf.addPage();
      //   pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      //   heightLeft -= pageHeight;
      // }

      pdf.save(this.invoiceData.invoiceType === "2" ? 'gstInvoice.pdf' : 'exportInvoice.pdf');
      this.isLoading = false;
    });

  }


}

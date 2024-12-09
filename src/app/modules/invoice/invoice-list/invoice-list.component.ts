import { Component } from '@angular/core';
import { TableComponent } from 'src/app/shared/modules/table/table.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {

}

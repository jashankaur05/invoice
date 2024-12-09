import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FilterMatchMode } from 'primeng/api';
import { TableColumn } from '../../models/table';
import { FilterCellComponent } from '../filter-cell/filter-cell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-filter',
  standalone: true,
  imports: [FilterCellComponent, CommonModule],
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterComponent {
  customFilterName = FilterMatchMode.EQUALS;

  matchModeOptions = [
    { label: 'Equals', value: this.customFilterName },
    { label: 'Starts With', value: FilterMatchMode.STARTS_WITH },
    { label: 'Contains', value: FilterMatchMode.CONTAINS }
  ];

  private _columns: TableColumn[] = [];

  @Input()
  set columns(columns: TableColumn[]) {
    this._columns = columns ?? [];
  }
  get columns(): TableColumn[] {
    return this._columns;
  }
}

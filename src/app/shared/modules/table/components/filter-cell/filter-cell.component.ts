import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColumnType, TableColumn } from '../../models/table';
import { FilterMatchMode, SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-cell',
  standalone: true,
  imports: [TableModule, MultiSelectModule, DropdownModule, TagModule, FormsModule, CommonModule],
  templateUrl: './filter-cell.component.html',
  styleUrl: './filter-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class FilterCellComponent {
  public columnType: typeof ColumnType = ColumnType;
  public selectedFilterValue!: SelectItem;

  private _filterOptions!: SelectItem[];
  private _column!: TableColumn;

  public matchModeOptions = [
    { label: 'Contains', value: FilterMatchMode.CONTAINS }
  ];

  customFilterName = FilterMatchMode.CONTAINS;
  filterDropdown = false;
  showMatchModes = false;
  showAddRuleButton = false;
  showFilterOperator = false;
  showClearButton = true;

  @Input() set column(column: TableColumn) {

    if (!column) return;
    this._column = column;
    this._filterOptions = this.getColumnType() === 'boolean'
      ? [
        { label: 'True', value: true },
        { label: 'False', value: false }
      ]
      : this.column.filterOptions ?? [<SelectItem>{}];
  }

  get column(): TableColumn {
    return this._column;
  }

  get filterOptions(): SelectItem[] {
    return this._filterOptions
  }

  filterChanged(event: any, filterCallback: any) {
    filterCallback(event.value)
  }

  clearFilter(event: any, filterCallback: any) {
    filterCallback(event.value)
  }

  getColumnType(): string | undefined {

    let type = this.column.type?.toLocaleLowerCase()

    if (type?.includes("date")) {
      type = "date"
    }

    return type;
  }
}

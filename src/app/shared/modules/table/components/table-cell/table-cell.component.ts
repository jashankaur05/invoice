import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableColumn, ColumnType } from '../../models/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from 'src/app/shared/pipes/truncate/truncate.pipe';

@Component({
  selector: 'app-table-cell',
  standalone: true,
  imports: [CommonModule, TagModule, TruncatePipe],
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent<T> {
  @Input() set column (c: TableColumn | undefined)
  {
      this._tableColumn = c

      this.extractValue(this._row);
  }

  get column(): TableColumn | undefined{
      return this._tableColumn
  }

  @Input() set row(value: T |  undefined | any) {

      this._row = value;
      this.extractValue(this._row);
  }

  private extractValue(value: any) {

      if(!value) return;

      let name = this.column?.name.split('.')??[];
      let vv = { ...value };
      name.forEach((el) => vv = vv[el]);
      this.value = vv;
  }

  get row(): T | undefined{
    return this._row;
  }

  public value: any;
  private _row: T | undefined;
  private _tableColumn: TableColumn | undefined;
  columnType: typeof ColumnType = ColumnType;

  content:any
}

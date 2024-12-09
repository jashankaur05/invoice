import { TableColumn } from './../../models/table';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItemType, MenuItem } from '../../../models/menu-item.model';
import { MENU_ITEM_TEMPLATES } from '../../../models/menu-templates.config';
import { MenuComponent } from '../../../menu/menu/menu.component';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableToolbarComponent {
  @Input() label: string | undefined | null = 'Data';
  @Input() filterable = false;
  @Input() showRefreshButton = true;
  @Input() isSelectable = false;
  @Input() selectionCommitable = false;
  @Input() columns: TableColumn[] = [];

  @Output() refreshData: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetTableState: EventEmitter<void> = new EventEmitter<void>();

  @Output() onGlobalFilter: EventEmitter<string> = new EventEmitter<string>();

  @Output() onNFFFilter: EventEmitter<any> = new EventEmitter<any>();

  @Output() onBlockFilter: EventEmitter<string> = new EventEmitter<string>();

  @Input() parentTable: Table | undefined;

  menuItems: MenuItem[] = [
    {
      ...MENU_ITEM_TEMPLATES.RESET,
      click: () => this.resetTableStateMeta(),
      order: 1,
      raised: true,
      label: '',
      tooltip: 'menuButton.reset',
      type: MenuItemType.DEFAULT
    },
    {
      ...MENU_ITEM_TEMPLATES.REFRESH,
      click: () => this.refreshTableData(),
      order: 1,
      raised: true,
      label: '',
      tooltip: 'menuButton.refresh',
      type: MenuItemType.DEFAULT
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  resetTableStateMeta() {
    this.resetTableState.emit();
  }

  refreshTableData() {
    this.refreshData.emit();
  }
}

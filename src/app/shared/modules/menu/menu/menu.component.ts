import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuItem, MenuItemType } from '../../models/menu-item.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    MenuItemComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MenuComponent {
  @Input() type: MenuItemType | undefined;

  /**
   * Menu items
   */
  @Input('items')
  set _items(items: MenuItem[]) {
    this.items = items;
  }

  /** context to be passed to callbacks */
  @Input() context: any;

  /**
   * layout 'row' | 'column'
   */
  @Input()
  layout: 'row' | 'column' | null = 'row';



  /**
   * layout align 'start' | 'center' | 'end'
   */
  @Input() layoutAlign: 'start' | 'center' | 'end' = 'start';

  items: MenuItem[] | undefined;

  constructor() { }
}

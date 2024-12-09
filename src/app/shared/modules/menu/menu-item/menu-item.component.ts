import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ICON_GROUPS_CONFIG } from 'src/config/icons.config';
import { MenuItem, MenuItemType } from '../../models/menu-item.model';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MenuItemComponent {
  /** item */
  @Input()
  set item(item: MenuItem | undefined) {
    this._item = item;
  }

  get item(): MenuItem | undefined {
    return this._item;
  }

  /** type */
  @Input()
  set type(type: MenuItemType | undefined) {
    this._type = type;
  }
  get type(): MenuItemType | undefined {
    return this._type;
  }

  /** context to be passed to callbacks */
  @Input() context: any;
  iconGroupsConfig: typeof ICON_GROUPS_CONFIG = ICON_GROUPS_CONFIG;
  children: MenuItem[] | undefined;
  menuItemType: typeof MenuItemType = MenuItemType;
  private _item: MenuItem | undefined;
  private _type: MenuItemType | undefined;

  constructor() { }

  /**
   * click handler
   *
   * @param event mouse event
   */
  onClick(event: MouseEvent, context: any): void {
    event.stopPropagation();
    if (this.item?.click && !this.item.loading) { // Prevent click if loading
      this.item.click(event, context);
    }
  }


  /**
   * gets the value from callback or value itself
   *
   * @param cb callback
   */
  getCallback(cb: any | (() => any)): any {
    if (typeof cb === 'function') {
      return cb(this.context);
    } else {
      return cb;
    }
  }

  /** find icon for a given key */
  getIcon(
    iconKey: string | ((...args: any[]) => string) | undefined
  ): string {
    let icon = this.iconGroupsConfig.find((i) => i.key === iconKey)?.name;
    return icon ? icon : '';
  }

  getLabel(l: string | undefined): string {
    return l ? l : '';
  }
}

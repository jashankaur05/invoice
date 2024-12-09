import { Params, QueryParamsHandling } from '@angular/router';

export type MenuItems = MenuItem[] | Record<string, MenuItem>;

export interface MenuItem {
    //	(optional) Identifier of the menu item
    id?: string;

    //	text label of the item.
    label?: string;

    // optional tooltip
    tooltip?: string;

    //	Icon of the item.
    icon?: string | ((...args: any[]) => string);

    //	Callback to execute when item is clicked.
    click?: (...args: any[]) => void;

    //	RouterLink definition for internal navigation.
    routerLink?: string

    // allows ordering menu items
    order?: number;

    //	Query parameters for internal navigation via routerLink.
    queryParams?: Params;

    //	Sets the hash fragment for the URL.
    fragment?: string;

    queryParamsHandling?: QueryParamsHandling; //	How to handle query parameters in the router link for the next navigation. One of: merge : Merge new with current parameters. / preserve : Preserve current parameters.k.

    preserveFragment?: boolean; // default: false //	When true, preserves the URL fragment for the next navigation.

    //	An array of children menuitems.
    children?: MenuItem[] | Record<string, MenuItem>;

    /**
     * Visibility of submenu.
     *
     * @default false
     */
    expanded?: boolean;

    /**
     * When set as true, disables the menuitem.
     *
     * @default false
     */
    disabled?: boolean | ((...args: any[]) => boolean);

    /**
     * When set as true, a spinner will be shown with item disabled.
     *
     * @default false
     */
    spinner?: boolean | ((...args: any[]) => boolean);
    loading?: boolean ;
    /**
     * Whether the dom element of menuitem is created or not.
     *
     * @default true
     */
    visible?: boolean | ((...args: any[]) => boolean);

    target?: string; // Specifies where to open the linked document.

    /**
     * Whether to escape the label or not. Set to false to display html content.
     *
     * @default true
     */
    escapeLabel?: boolean;

    //	Style class of the menuitem.
    styleClass?: string;

    //	Value of the badge.
    badge?: string;

    //	Style class of the badge.
    badgeStyleClass?: string;

    /**
     * Specifies tab order of the item.
     *
     * @default 0
     */
    tabIndex?: number;

    /** the color of the menu item
     *
     * @default null ('basic')
     */
    color?: 'primary' | 'danger' | 'warn' | null;

    type?: MenuItemType;
    raised?: boolean;
}

export enum MenuItemType {
    DEFAULT = 'DEFAULT',
    ROUNDED = 'ROUNDED',
    OUTLINED = 'OUTLINED',
    ICON = 'ICON',
    MENU = 'MENU',
}

export interface DividerMenuItem {
    /**
     * Defines the item as a separator.
     *
     * @default false
     */
    separator: boolean;
}

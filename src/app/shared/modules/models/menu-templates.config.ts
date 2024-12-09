import { ApplicationIcons } from 'src/config/icons.config';
import { MenuItemType, MenuItem } from './menu-item.model';

export enum MenuItemTemplates {
  VIEW = 'VIEW',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  SAVE = 'SAVE',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  COPY = 'COPY',
  REFRESH = 'REFRESH',
  RETURN = 'RETURN',
  DOWNLOAD = 'DOWNLOAD',
  CANCEL = 'CANCEL',
  CLOSE = 'CLOSE',
  MENU = 'MENU',
  SEND = 'SEND',
  RESET = 'RESET',
  RE_ORDER = 'RE_ORDER',
  NFF = "NFF",
  HANDOVER="HANDOVER"
}

export const MENU_ITEM_TEMPLATES: Record<MenuItemTemplates, MenuItem> = {
  [MenuItemTemplates.DOWNLOAD]: {
    label: 'Download',
    tooltip: 'Download',
    icon: ApplicationIcons.DOWNLOAD,
    type: MenuItemType.ICON,
  },
  [MenuItemTemplates.VIEW]: {
    label: 'menuButton.view',
    tooltip: 'menuButton.view',
    icon: ApplicationIcons.VIEW,
    type: MenuItemType.ICON,
  },
  [MenuItemTemplates.DELETE]: {
    label: 'Delete',
    tooltip: 'Delete',
    icon: ApplicationIcons.DELETE,
    type: MenuItemType.ICON,
  },
  [MenuItemTemplates.CREATE]: {
    label: 'Create',
    tooltip: 'Create',
    icon: ApplicationIcons.CREATE,
    type: MenuItemType.DEFAULT,
    color: 'primary',
  },
  [MenuItemTemplates.EDIT]: {
    label: 'menuButton.edit',
    tooltip: 'menuButton.edit',
    icon: ApplicationIcons.EDIT,
    type: MenuItemType.DEFAULT
  },
  [MenuItemTemplates.SAVE]: {
    label: 'menuButton.save',
    tooltip: 'menuButton.save',
    icon: ApplicationIcons.SAVE,
    type: MenuItemType.DEFAULT
  },  
  [MenuItemTemplates.NFF]: {
    label: 'menuButton.nff',
    tooltip: 'menuButton.nff',
    icon: ApplicationIcons.NFF,
    type: MenuItemType.DEFAULT
  },
  [MenuItemTemplates.HANDOVER]: {
    label: 'menuButton.handover',
    tooltip: 'menuButton.handover',
    icon: ApplicationIcons.HANDOVER,
    type: MenuItemType.DEFAULT
  },
  [MenuItemTemplates.BLOCK]: {
    label: 'Block',
    tooltip: 'Block',
    icon: ApplicationIcons.BLOCK,
    type: MenuItemType.DEFAULT
  },
  [MenuItemTemplates.UNBLOCK]: {
    label: 'UnBlock',
    tooltip: 'UnBlock',
    icon: ApplicationIcons.UNBLOCK,
    type: MenuItemType.DEFAULT
  },
  [MenuItemTemplates.SEND]: {
    label: 'Send',
    tooltip: 'Send',
    icon: ApplicationIcons.SEND,
    type: MenuItemType.DEFAULT
  },
  [MenuItemTemplates.IMPORT]: {
    label: 'Import',
    tooltip: 'Import',
    icon: ApplicationIcons.IMPORT,
    type: MenuItemType.DEFAULT,
    color: 'primary',
  },
  [MenuItemTemplates.COPY]: {
    label: 'Copy',
    tooltip: 'Copy',
    icon: ApplicationIcons.COPY,
    type: MenuItemType.DEFAULT,
  },
  [MenuItemTemplates.EXPORT]: {
    label: 'Export',
    tooltip: 'Export',
    icon: ApplicationIcons.EXPORT,
    type: MenuItemType.DEFAULT,
    color: 'primary',
  },
  [MenuItemTemplates.RETURN]: {
    label: 'Return',
    tooltip: 'Return',
    icon: 'keyboard_return',
    type: MenuItemType.ICON,
    color: undefined,
  },
  [MenuItemTemplates.REFRESH]: {
    label: 'Refresh',
    tooltip: 'Refresh',
    icon: ApplicationIcons.REFRESH,
    type: MenuItemType.ICON,
  },
  [MenuItemTemplates.CANCEL]: {
    label: 'Cancel',
    tooltip: 'Cancel',
    icon: ApplicationIcons.CANCEL,
    type: MenuItemType.DEFAULT,
  },
  [MenuItemTemplates.CLOSE]: {
    label: 'Close',
    tooltip: 'Close',
    icon: ApplicationIcons.CANCEL,
    type: MenuItemType.DEFAULT,
  },
  [MenuItemTemplates.MENU]: {
    label: 'More',
    tooltip: 'More',
    icon: ApplicationIcons.MENU,
    type: MenuItemType.ICON,
  },
  [MenuItemTemplates.RESET]: {
    label: 'reset',
    tooltip: 'reset',
    icon: ApplicationIcons.RESET,
    type: MenuItemType.DEFAULT,
  },
  [MenuItemTemplates.RE_ORDER]: {
    label: 're-order',
    tooltip: 're-order',
    icon: ApplicationIcons.RE_ORDER,
    type: MenuItemType.DEFAULT,
  }
};

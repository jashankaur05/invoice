
export enum ApplicationIcons {
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
    MENU = 'MENU',
    HOME = 'HOME',
    CHECKLIST = 'CHECKLIST',
    LIST = 'LIST',
    INFORMATION = 'INFORMATION',
    REMINDERS = 'REMINDERS',
    MEETINGS = 'MEETINGS',
    SEND = 'SEND',
    CHECK = 'CHECK',
    RESET = 'RESET',
    RE_ORDER="RE_ORDER",
    NFF = "NFF",
    HANDOVER = "HANDOVER"
  }
  export const ICON_GROUPS_CONFIG: IconGroup[] = [
    {
      key: ApplicationIcons.VIEW,
      name: 'pi pi-eye',
    },
    {
      key: ApplicationIcons.DELETE,
      name: 'pi pi-trash',
    },
    {
      key: ApplicationIcons.CREATE,
      name: 'pi pi-plus',
    },
    {
      key: ApplicationIcons.EDIT,
      name: 'pi pi-pencil',
    },  
    {
      key: ApplicationIcons.NFF,
      name: 'pi pi-save',
    },
    {
      key: ApplicationIcons.SAVE,
      name: 'pi pi-save',
    },
    {
      key: ApplicationIcons.BLOCK,
      name: 'pi pi-ban',
    },
    {
      key: ApplicationIcons.UNBLOCK,
      name: 'pi pi-ban',
    },
    {
      key: ApplicationIcons.SEND,
      name: 'pi pi-send',
    },
    {
      key: ApplicationIcons.IMPORT,
      name: 'pi pi-file-import',
    },
    {
      key: ApplicationIcons.EXPORT,
      name: 'pi pi-file-export',
    },
    {
      key: ApplicationIcons.COPY,
      name: 'pi pi-copy',
    },
    {
      key: ApplicationIcons.REFRESH,
      name: 'pi pi-refresh',
    },
    {
      key: ApplicationIcons.RETURN,
      name: 'pi pi-arrow-circle-left',
    },
    {
      key: ApplicationIcons.DOWNLOAD,
      name: 'pi pi-download',
    },
    {
      key: ApplicationIcons.CANCEL,
      name: 'pi pi-times-circle',
    },
    {
      key: ApplicationIcons.MENU,
      name: 'pi pi-ellipsis-v',
    },
    {
      key: ApplicationIcons.HOME,
      name: 'pi pi-fw pi-home',
    },
    {
      key: ApplicationIcons.LIST,
      name: 'pi pi-list',
    },
    {
      key: ApplicationIcons.CHECKLIST,
      name: 'pi pi-check-square',
    },
    {
      key: ApplicationIcons.INFORMATION,
      name: 'pi pi-info-circle',
    },
    {
      key: ApplicationIcons.MEETINGS,
      name: 'pi pi-calendar',
    },
    {
      key: ApplicationIcons.REMINDERS,
      name: 'pi pi-exclamation-triangle',
    },
    {
      key: ApplicationIcons.RE_ORDER,
      name: 'pi pi-sort-alt',
    },
    {
      key: ApplicationIcons.RESET,
      name: 'pi pi-backward',
    }
  ];
  
  
  export class IconGroup {
    key: string | undefined;
    name: string | undefined;
    new?: boolean;
  }
  
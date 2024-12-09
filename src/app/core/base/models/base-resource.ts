export interface BaseResource {
    id: number;
    name: string;
    status: string;
    date: string;
    amount: number;
}


export enum Tables {
    WORK_LOAD = 'TableIssues',
    REMINDER = 'TableReminder',
    SCHEDULES = 'TableSchedules',
    NOTIFICATION = 'TableNotification',
    IMPORT = 'TableImport'
}

export enum Language {

    EN = 'en',
    DE = 'de'
}


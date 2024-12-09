export interface ImportResult {
    importResult: ImportIssueResponse
}
export interface ImportIssueResponse {
    analizedLines: number,
    errorLines: number,
    data: string[],
    csvLineErrors: CsvLineErrors[]
}

export interface CsvLineErrors {
    row: number,
    column: {
        name: string,
        value: string
    },
    message: string
}

export enum ReportStatus {
    Imported = "Imported",
    Pending = "Pending",
    Completed = "Completed",
    QualificationLight = "QualificationLight",
    Qualification = "Qualification",
    NFF = "NFF",
    Error = "Error"
}

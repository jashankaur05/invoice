import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { FormControl } from "@angular/forms";
import { UploadFile } from 'src/app/shared/modules/file-picker/models/file.model';
import { ImportResult, ImportIssueResponse, CsvLineErrors } from '../import-issues.model';
import { HttpEventHandler } from './http-event.handler';
import { ImportComponent } from '../import.component';

interface ICSVError{
    row: number;
    errorAttributeInColumn: string;
    message: string;
}

export class ResponseHandler implements HttpEventHandler {


    constructor( private uploadComponent: ImportComponent ) { }


    handle(httpEvent: HttpEvent<ImportResult>, uploadFile: UploadFile): void {

        let event = <HttpResponse<ImportResult>>httpEvent;

        uploadFile.inProgress = false;
        uploadFile.isUploadComplete = true;

        if (event.body?.importResult.errorLines != undefined && event.body?.importResult.errorLines > 0) {
            this.handleErrorOnImportResponse(event.body?.importResult);
        }

        this.uploadComponent.notificationService.showSuccess("modules.importIssues.notificationMessage.success");
        this.uploadComponent.file.progress = uploadFile.progress;
        this.onAfterFileUpload();
    }


    private onAfterFileUpload() {

        this.uploadComponent.delayExecutionService.executeWithDelay(() => {
            this.uploadComponent.importFC = new FormControl([]);
            this.uploadComponent.file = new UploadFile();
            this.uploadComponent.fileUpload.removeFiles();
        },2000);
    }


    private handleErrorOnImportResponse(importResult: ImportIssueResponse){

        this.uploadComponent.csvErrors = this.parseCsvErrorsForTable(importResult.csvLineErrors);
        this.uploadComponent.displayErrorDialog = true;
        throw new HttpErrorResponse({error:'Error lines is different from 0', status:203});
    }


    private parseCsvErrorsForTable(csvLineErrors: CsvLineErrors[]) {

        const groupedErrors = csvLineErrors.reduce(this.errorReducer(), [] as ICSVError[]);

        return groupedErrors;
    }


    private errorReducer(): (previousValue: ICSVError[], currentValue: CsvLineErrors) => ICSVError[] {

        return (data, error) => {

            const { row, column, message } = error;
            const existingError = data.find(item => item.row === row);

            if (existingError) {

                existingError.errorAttributeInColumn += `, ${column.name}`;
                existingError.message += `, ${message.split('\n')[0].trim()}`;

            } else {

                data.push({
                    row,
                    errorAttributeInColumn: column.name,
                    message: message.split('\n')[0].trim()
                });
            }

            return data;
        };
    }
}

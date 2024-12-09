import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, tap, catchError, throwError, takeUntil } from 'rxjs';
import { Tables } from 'src/app/core/base/models/base-resource';
import { DelayExecutorService } from 'src/app/core/base/services/delay-executor.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { FileUploadComponent } from 'src/app/shared/modules/file-picker/components/file-upload/file-upload.component';
import { UploadFile, FileUploadConfig, FILE_UPLOAD_CONFIG_DEFAULT } from 'src/app/shared/modules/file-picker/models/file.model';
import { FileService } from 'src/app/shared/modules/file-picker/services/file.service';
import { TableColumn } from 'src/app/shared/modules/table/models/table';
import { ImportResult } from './import-issues.model';
import { HttpEventHandler } from './model/http-event.handler';
import { UploadProgressHandler } from './model/upload-progress-handler';
import { ResponseHandler } from './model/upload-response-handler';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from 'src/app/shared/pipes/translate/translate.pipe';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, ButtonModule, RippleModule, FileUploadComponent, ProgressBarModule],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
  providers: [FileService]
})
export class ImportComponent implements OnDestroy {
  @ViewChild(FileUploadComponent) fileUpload!: FileUploadComponent;

  private destroy$ = new Subject<boolean>();

  importFC: FormControl = new FormControl([]);
  file: UploadFile = new UploadFile();
  tableName: Tables = Tables.IMPORT;

  displayErrorDialog: boolean = false;
  csvErrors: any;

  filePickerConfig: FileUploadConfig = {
    ...FILE_UPLOAD_CONFIG_DEFAULT,
    ...{
      enableBrowse: false,
      allowedExtensions: ['csv', 'xls', 'xlsx'],
      multiple: false,
    },
  };

  columns: TableColumn[] = [
    { name: 'row', label: 'modules.importIssues.errorTable.row' },
    { name: 'message', label: 'modules.importIssues.errorTable.detail' },
    { name: 'errorAttributeInColumn', label: 'modules.importIssues.errorTable.columnsWithErrors' },
  ];

  handlers!: { [key: number]: HttpEventHandler };

  constructor(
    public fileService: FileService,
    private cdr: ChangeDetectorRef,
    public notificationService: NotificationService,
    public delayExecutionService: DelayExecutorService
  ) {

    this.handlers = {
      [HttpEventType.Response]: new ResponseHandler(this),
      [HttpEventType.UploadProgress]: new UploadProgressHandler(this),
    };
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onUploadingFiles(): void {
    const allowedExtensions = <string[]>this.filePickerConfig.allowedExtensions;
    const fileToUpload: File = this.importFC.value[0] as File;
    if (!this.isFileExtensionSupported(allowedExtensions, fileToUpload)) {
      const translatedMsg = 'modules.importIssues.notificationMessage.errorFileTypeNotSupported';
      const error = (this.filePickerConfig.allowedExtensions ?? []).join(', ').toString();

      this.notificationService.showError(translatedMsg, { error })

      return;
    }

    const uploadFileProgressObj = new UploadFile();

    uploadFileProgressObj.filename = this.importFC.value[0]?.name;
    uploadFileProgressObj.size = this.importFC.value[0]?.size;
    this.file = uploadFileProgressObj;

    this.uploadFiles(fileToUpload);
  }


  private uploadFiles(fileToUpload: File): void {

    let uploadFile: UploadFile = this.file;

    uploadFile.inProgress = true;

    let $ = this.fileService.upload(fileToUpload);

    $ = $.pipe(tap((event: HttpEvent<ImportResult>) => {

      const handler = this.handlers[event.type];
      handler && (handler.handle(event, uploadFile));

      this.cdr.markForCheck();
    }));

    $ = $.pipe(catchError((error: HttpErrorResponse) => {

      uploadFile.progress = 0;
      uploadFile.inProgress = false;
      uploadFile.isUploadComplete = false;

      const translatedError = 'modules.importIssues.notificationMessage.errorUpload';
      this.notificationService.showError(translatedError, error.error.message);

      const newError = `Error Code: ${error.status}\nMessage: ${error.message}`;

      return throwError(() => new Error(newError));
    }));

    $ = $.pipe(takeUntil(this.destroy$));

    $.subscribe(() => { });
  }

  private isFileExtensionSupported(allowedExtensions: string[], file: File): boolean {

    if (!allowedExtensions?.length) {
      return true;
    }

    return allowedExtensions.includes(file?.name.split('.').pop() as string);
  }

  handleFileSizeOrLimitError(hasMoreFileCountOrSize: boolean): void {

    if (!hasMoreFileCountOrSize) return;

    const notification = 'modules.importIssues.notificationMessage.errorLimitReached';
    this.notificationService.showError(notification);
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, NgControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TranslatePipe } from 'src/app/shared/pipes/translate/translate.pipe';
import { FileUploadModule } from "primeng/fileupload";
import { FilesListComponent } from '../files-list/files-list.component';
import { AbstractFormControlComponent } from '../../../abstracts/form-control/abstract-form-control';
import { FileSizeFormatterPipe } from 'src/app/shared/pipes/file-size/file-size.pipe';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FileUploadModule, ButtonModule, FormsModule, ToastModule, FilesListComponent, FileSizeFormatterPipe],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent extends AbstractFormControlComponent<FormControl, string> {

  @Input() label = 'Drop your files here';
  @Input() maxFileSize = 20971520;
  @Input() maxFileSizeTitle = '';
  /** maximum number of files to upload (null == unlimited) */
  @Input() maxFileCount: number | null = null;
  @Input() multiple = true;
  @Input('allowedExtensions')
  set allowedExtensions(fileTypes: string[] | undefined) {
      if (fileTypes) {
          this.acceptedTypes = fileTypes.map((x) => '.' + x).join(', ');
      }
  }

  @Output() uploadFiles: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output()
  hasMoreFileCountOrSize: EventEmitter<boolean> = new EventEmitter<boolean>();

  acceptedTypes: string = '';
  uploadedFiles: File[] = [];

  constructor(
      @Optional() @Self() ngControl: NgControl,
      cdr: ChangeDetectorRef
  ) {
      super(ngControl, cdr);
  }

  /**
   * Handle file upload  Onchange event
   * @param event
   */
  handleFileUpload(event: any): void {
      let files = [];
      files.push(...(event.files as File[]));
      if (this.hasLargeFile(files) || this.hasTooManyFiles(files)) {
          this.hasMoreFileCountOrSize.emit(true);
          return;
      }
      this.uploadedFiles.push(...files);
      this.uploadFiles.emit(this.uploadedFiles);
      this.updateControl();
  }

  public removeFiles() {
      this.uploadedFiles.forEach(file => {
          this.removeFile(file)
      })
  }

  removeFile(file: any) {
      this.uploadedFiles = this.uploadedFiles.filter((i) => i !== file);
      this.uploadFiles.emit(this.uploadedFiles);
      this.updateControl();
  }

  updateControl() {
      if (this.ngControl !== null) {
          this.control.setValue([...this.uploadedFiles]);
          // mark form control dirty and trigger change detection
          this.control.markAsDirty();
          this.cdr.markForCheck();
      }
  }

  hasTooManyFiles(files: File[]) : boolean
  {
    return  (!this.multiple && files.length > 1) ||
      (this.multiple &&
          this.maxFileCount !== null &&
          files.length > this.maxFileCount);
  }

  hasLargeFile(files: File[]):boolean{
      let largeSize = files.find((file) => file.size > this.maxFileSize) ;
      return largeSize ? true : false;
  }

}

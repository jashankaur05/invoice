import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'src/app/core/base/services/service-base';
import { FileUpdate, File as FileUpload } from '../models/file.model';
import { HttpEvent } from '@angular/common/http';
import { SortMeta } from 'primeng/api';
import { Observable, from } from 'rxjs';
import { ImportResult } from 'src/app/modules/import/import-issues.model';

@Injectable({
  providedIn: 'root',
})
export class FileService extends BaseService<
  FileUpload,
  FileUpdate,
  FileUpdate
> {
  constructor(injector: Injector) {
      super(injector, {
          name: 'files',
          path: '/File',
          labels: {
              none: 'File',
              singular: 'File',
              plural: 'Files',
          },
          messages: {
              deleteSuccess: (file: FileUpload) =>
                  `Successfully deleted the file '${file.filename} (#${file.id})'`,
              deleteError: (file: FileUpload) =>
                  `An error occurred when deleting file '${file.filename}  (#${file.id}):'\n\t`,
              updateSuccess: (file: FileUpload) =>
                  `Successfully edited file '${file.filename}  (${file.id})'`,
              updateError: (file: FileUpload) =>
                  `An error occurred when editing file '${file.filename}  (#${file.id}):'\n\t`,
              createSuccess: (file: FileUpload) =>
                  `Successfully created file '${file.filename}  (#${file.id})'`,
              createError: (file: FileUpdate) =>
                  `An error occurred when creating file '${file.filename} '\n\t`,
              deleteConfirm: (file: FileUpload[]) => {
                  let msg = `Are you sure you want to delete the following file${
                      file.length > 1 ? 's' : ''
                  }:`;
                  file.forEach((u) => (msg += `\n - ${u.filename}`));
                  return msg;
              },
              unassignConfirm: (file: FileUpload[]) => {
                  let msg = `Are you sure you want to unassign the following file${
                      file.length > 1 ? 's' : ''
                  }:`;
                  file.forEach((u) => (msg += `\n - ${u.filename}`));
                  return msg;
              },
          },
      });
  }


  override getFilteredCollection(pageNumber: number | undefined, recordsPerPage: number | undefined, filter: any | undefined, sortMeta: SortMeta | SortMeta[] | undefined): Observable<{totalRecords:number,results:FileUpload[]}> {

      return from([]);
  }


  upload( file: File, endpoint?: string ): Observable<HttpEvent<ImportResult>> {

      const formData: FormData = new FormData();

      formData.append('File', file);

      return this.http.post<ImportResult>(
          endpoint ? endpoint : this.endpointUrl,
          formData,
          {
              reportProgress: true,
              observe: 'events',
          }
      );
  }
}

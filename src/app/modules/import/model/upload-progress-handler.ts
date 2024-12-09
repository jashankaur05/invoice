import { HttpEvent, HttpProgressEvent } from "@angular/common/http";
import { UploadFile } from "src/app/shared/modules/file-picker/models/file.model";
import { ImportResult } from "../import-issues.model";
import { HttpEventHandler } from "./http-event.handler";
import { ImportComponent } from "../import.component";

export class UploadProgressHandler implements HttpEventHandler {


    constructor( private readonly uploadComponent: ImportComponent ) {}


    handle(httpEvent: HttpEvent<ImportResult>, uploadFile: UploadFile): void {

        let event = <HttpProgressEvent>httpEvent;

        uploadFile.progress = Math.round(
            (event.loaded * 100) / (event.total ?? 1)
        );

        this.uploadComponent.file.progress = uploadFile.progress;
    }
}

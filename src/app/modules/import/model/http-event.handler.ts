import { HttpEvent } from "@angular/common/http";
import { UploadFile } from "src/app/shared/modules/file-picker/models/file.model";
import { ImportResult } from "../import-issues.model";

export interface HttpEventHandler {
    handle(event: HttpEvent<ImportResult>, uploadFile: UploadFile): void;
}

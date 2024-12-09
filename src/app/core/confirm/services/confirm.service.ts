import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmOptions } from '../models/confirm-options.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    ref: DynamicDialogRef | undefined;
    constructor(private dialog: DialogService) {}
    confirm(options?: ConfirmOptions): Observable<any> {
        this.ref = this.dialog.open(ConfirmationDialogComponent, {
            header: 'confirm!',
            data: options,
            width: '30%',
        });
        return this.ref.onClose;
    }

    close(){
        this.ref?.close()
    }
}

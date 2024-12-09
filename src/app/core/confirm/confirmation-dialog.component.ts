import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmService } from './services/confirm.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmOptions } from './models/confirm-options.model';
import { defaultsDeep } from 'lodash-es';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss',
    providers: [DialogService],
})
export class ConfirmationDialogComponent {
    options: ConfirmOptions = {
        message: 'Are you sure?',
        icon: 'warning',
        acceptLabel: 'Confirm',
        rejectLabel: 'Cancel',
        acceptIcon: 'done',
        rejectIcon: 'close',
        acceptVisible: true,
        rejectVisible: true,
        acceptColor: 'accent',
        rejectColor: undefined,
    };
    constructor(
        protected dialogRef: DynamicDialogRef,
        protected config: DynamicDialogConfig,
        // private confirmService: ConfirmService
    ) {

        this.options = defaultsDeep(config.data, this.options);
        if (config.data) this.options = config.data;
    }

    /**
     * click reject handler
     *
     * @param event mouse event
     */
    onRejectClick(event: MouseEvent) {
        this.dialogRef.close();
        if (this.options.rejectClick) {
            this.options.rejectClick(event);
        }
    }

    /**
     * click accept handler
     *
     * @param event mouse event
     */
    onAcceptClick(event: MouseEvent): void {
        event.stopPropagation();
        this.close();
        if (this.options?.acceptClick) {
            this.options.acceptClick(event);
        }
    }

    /**
     * close
     */
    close() {
        this.dialogRef.close();
    }
}

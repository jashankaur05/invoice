import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ConfirmService } from 'src/app/core/confirm/services/confirm.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from '../menu/menu/menu.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, DividerModule, MenuComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
//   providers: [ConfirmService]
})
export class DialogComponent {
  @Input() confirmClose = false;
  @Input() title: string | null = null;
  @Input() menuItems: MenuItem[] = [];
  @Input() showFooter = true;


  @Output() onDialogClose: EventEmitter<void> = new EventEmitter<void>();


  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
      protected dialogRef: DynamicDialogRef,
      protected config: DynamicDialogConfig,
    //   private confirmService: ConfirmService
  ) {}

  onClose() {
    //   if (this.confirmClose) {
    //       this.confirmService.confirm({
    //           message:
    //               'Are you sure to close the dialog? Changes might not be saved.',
    //           acceptClick:() => this.close(),
    //           rejectClick: () => this.confirmService.close()
    //       });
    //   } else {
    //           this.close()
    //   }
  }

  close(){
      this.dialogRef.close();
      this.onDialogClose.emit()
  }
}

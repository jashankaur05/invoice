import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { NotificationService } from '../../notification.service';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MessagesModule],
  styleUrls: ['./notification.component.scss'],
  template: `<p-messages [(value)]="notifications" [closable]="true"></p-messages>`,
  providers: [MessageService]
})
export class NotificationComponent {

  protected notifications: Message[] = [];

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService) {}

  ngOnInit(): void {

    // this.notificationService.notifications$.subscribe((notification) => {
    //   this.messageService.add(notification);
    //   this.notifications.push(notification);
    // });
    this.notifications = [{ severity: 'error', detail: 'Message Content' }];
  }
}

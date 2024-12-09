import { Injectable } from '@angular/core';
import { HashMap } from '@ngneat/transloco';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new Subject<Message>();
  public notifications$ = this.notificationsSubject.asObservable();

  constructor( ) { }

  public showSuccess(message: string, args?: HashMap, life?: number): void {
    this.showNotification('success', message, args, life);
  }

  public showInfo(message: string, args?: HashMap, life?: number): void {
    this.showNotification('info', message, args, life);
  }

  public showWarning(message: string, args?: HashMap, life?: number): void {
    this.showNotification('warn', message, args, life);
  }

  public showError(message: string, args?: HashMap, life?: number): void {
    this.showNotification('error', message, args, life);
  }

  private showNotification(severity: string, message: string, options?:HashMap, life: number = 3000): void {

    const notification: Message = {
      severity,
      summary: '',
      detail: '',
      life
    };

    this.notificationsSubject.next(notification);
  }
}

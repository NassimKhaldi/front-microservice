import { Component, OnInit } from '@angular/core';
import {
  NotificationService,
  Notification,
} from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification-dashboard',
  templateUrl: './notification-dashboard.component.html',
})
export class NotificationDashboardComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  error = '';
  showForm = false;
  filter = 'all'; // all, unread, read

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getAllNotifications().subscribe({
      next: (response) => {
        this.notifications = response.data || [];
        this.notificationService.updateNotifications(this.notifications);
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load notifications';
        this.loading = false;
      },
    });
  }

  get filteredNotifications(): Notification[] {
    switch (this.filter) {
      case 'unread':
        return this.notifications.filter((n) => !n.read);
      case 'read':
        return this.notifications.filter((n) => n.read);
      default:
        return this.notifications;
    }
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAsRead(notification: Notification): void {
    if (!notification._id || notification.read) return;

    this.notificationService.markAsRead(notification._id).subscribe({
      next: (response) => {
        notification.read = true;
        this.notificationService.updateNotifications(this.notifications);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to mark as read';
      },
    });
  }

  markAsUnread(notification: Notification): void {
    if (!notification._id || !notification.read) return;

    this.notificationService.markAsUnread(notification._id).subscribe({
      next: (response) => {
        notification.read = false;
        this.notificationService.updateNotifications(this.notifications);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to mark as unread';
      },
    });
  }

  deleteNotification(notification: Notification): void {
    if (!notification._id) return;

    if (!confirm('Are you sure you want to delete this notification?')) return;

    this.notificationService.deleteNotification(notification._id).subscribe({
      next: (response) => {
        this.notifications = this.notifications.filter(
          (n) => n._id !== notification._id
        );
        this.notificationService.updateNotifications(this.notifications);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to delete notification';
      },
    });
  }

  createNotification(notificationData: Omit<Notification, '_id'>): void {
    this.notificationService.createNotification(notificationData).subscribe({
      next: (response) => {
        this.notifications.unshift(response.data);
        this.notificationService.updateNotifications(this.notifications);
        this.showForm = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to create notification';
      },
    });
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'warning':
        return '#ffc107';
      case 'error':
        return '#dc3545';
      default:
        return '#17a2b8';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }

  trackByFn(index: number, item: Notification): string | number {
    return item._id || index;
  }

  onSubmitForm(form: any): void {
    if (form.valid) {
      const notificationData = {
        title: form.value.title,
        message: form.value.message,
        type: form.value.type || 'info',
        userId: this.authService.getCurrentUser()?.id || 'anonymous',
        read: false,
        createdAt: new Date(),
      };
      this.createNotification(notificationData);
      form.reset();
    }
  }
}

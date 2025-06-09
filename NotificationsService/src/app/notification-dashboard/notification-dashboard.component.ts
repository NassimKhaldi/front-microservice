import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth.service';

interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
  userId: string;
}

@Component({
  selector: 'app-notification-dashboard',
  templateUrl: './notification-dashboard.component.html',
  styleUrls: ['./notification-dashboard.component.css'],
})
export class NotificationDashboardComponent implements OnInit {
  notifications: Notification[] = [];
  notificationForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  editingNotification: Notification | null = null;
  filterType = 'all';
  filterRead = 'all';

  stats = {
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
  };

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      type: ['info', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  async loadNotifications(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      this.notifications = await this.notificationService.getAllNotifications();
      this.updateStats();
    } catch (error: any) {
      this.error = error.message || 'Failed to load notifications';
      console.error('Error loading notifications:', error);
    } finally {
      this.loading = false;
    }
  }

  updateStats(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.stats = {
      total: this.notifications.length,
      unread: this.notifications.filter((n) => !n.isRead).length,
      today: this.notifications.filter((n) => new Date(n.createdAt) >= today)
        .length,
      thisWeek: this.notifications.filter(
        (n) => new Date(n.createdAt) >= weekAgo
      ).length,
    };
  }

  async onSubmit(): Promise<void> {
    if (this.notificationForm.valid) {
      try {
        this.loading = true;
        this.error = '';
        this.success = '';

        const formValue = this.notificationForm.value;
        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
          this.error = 'User not authenticated';
          return;
        }

        const notificationData: Notification = {
          ...formValue,
          userId: currentUser.id,
          isRead: false,
          createdAt: new Date(),
        };

        if (this.editingNotification) {
          notificationData.id = this.editingNotification.id;
          await this.notificationService.updateNotification(
            this.editingNotification.id!,
            notificationData
          );
          this.success = 'Notification updated successfully!';
          this.editingNotification = null;
        } else {
          await this.notificationService.createNotification(notificationData);
          this.success = 'Notification created successfully!';
        }

        this.notificationForm.reset({ type: 'info' });
        await this.loadNotifications();
      } catch (error: any) {
        this.error = error.message || 'Failed to save notification';
        console.error('Error saving notification:', error);
      } finally {
        this.loading = false;
      }
    } else {
      this.error = 'Please fill in all required fields correctly';
    }
  }

  editNotification(notification: Notification): void {
    this.editingNotification = notification;
    this.notificationForm.patchValue({
      title: notification.title,
      message: notification.message,
      type: notification.type,
    });
    this.error = '';
    this.success = '';
  }

  cancelEdit(): void {
    this.editingNotification = null;
    this.notificationForm.reset({ type: 'info' });
    this.error = '';
    this.success = '';
  }

  async deleteNotification(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this notification?')) {
      try {
        this.loading = true;
        this.error = '';
        await this.notificationService.deleteNotification(id);
        this.success = 'Notification deleted successfully!';
        await this.loadNotifications();
      } catch (error: any) {
        this.error = error.message || 'Failed to delete notification';
        console.error('Error deleting notification:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.isRead = true;
        await this.notificationService.updateNotification(id, notification);
        this.updateStats();
        this.success = 'Notification marked as read!';
      }
    } catch (error: any) {
      this.error = error.message || 'Failed to mark notification as read';
      console.error('Error marking notification as read:', error);
    }
  }

  async markAsUnread(id: string): Promise<void> {
    try {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.isRead = false;
        await this.notificationService.updateNotification(id, notification);
        this.updateStats();
        this.success = 'Notification marked as unread!';
      }
    } catch (error: any) {
      this.error = error.message || 'Failed to mark notification as unread';
      console.error('Error marking notification as unread:', error);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      this.loading = true;
      const unreadNotifications = this.notifications.filter((n) => !n.isRead);

      for (const notification of unreadNotifications) {
        notification.isRead = true;
        await this.notificationService.updateNotification(
          notification.id!,
          notification
        );
      }

      this.updateStats();
      this.success = 'All notifications marked as read!';
    } catch (error: any) {
      this.error = error.message || 'Failed to mark all notifications as read';
      console.error('Error marking all notifications as read:', error);
    } finally {
      this.loading = false;
    }
  }

  get filteredNotifications(): Notification[] {
    return this.notifications.filter((notification) => {
      const typeMatch =
        this.filterType === 'all' || notification.type === this.filterType;
      const readMatch =
        this.filterRead === 'all' ||
        (this.filterRead === 'read' && notification.isRead) ||
        (this.filterRead === 'unread' && !notification.isRead);

      return typeMatch && readMatch;
    });
  }

  clearMessages(): void {
    this.error = '';
    this.success = '';
  }

  logout(): void {
    this.authService.logout();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}

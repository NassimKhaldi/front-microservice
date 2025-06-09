import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Notification {
  _id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notifications';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getAllNotifications(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  createNotification(notification: Omit<Notification, '_id'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, notification, {
      headers: this.getHeaders(),
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/read`,
      {},
      { headers: this.getHeaders() }
    );
  }

  markAsUnread(id: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/unread`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getUnreadCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unread-count`, {
      headers: this.getHeaders(),
    });
  }

  updateNotifications(notifications: Notification[]) {
    this.notificationsSubject.next(notifications);
  }
}

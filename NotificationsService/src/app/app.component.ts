import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'NotificationsService';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is authenticated via URL params (from shell)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Listen for authentication messages from parent window (MicroserviceShell)
    window.addEventListener('message', (event) => {
      if (event.data.type === 'AUTH_TOKEN') {
        // Store the authentication data received from parent
        localStorage.setItem('token', event.data.token);
        localStorage.setItem('user', JSON.stringify(event.data.user));
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}

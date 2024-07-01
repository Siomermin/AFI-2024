import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'https://push-notification-server-yucx.onrender.com';

  constructor(private http: HttpClient) { }

  sendNotification(token: string, title: string, body: string): Observable<any> {
    const payload = { token, title, body };
    return this.http.post(`${this.apiUrl}/notify`, payload);
  }

  sendNotificationToRole(title: string, body: string, role: string): Observable<any> {
    const payload = { title, body, role };
    return this.http.post(`${this.apiUrl}/notify-role`, payload, { responseType: 'text' });
  }

  sendMail(aceptacion: boolean, nombreUsuario: string, mail: string): Observable<any> {
    const payload = { aceptacion, nombreUsuario, mail };
    return this.http.post(`${this.apiUrl}/send-mail`, payload);
  }
}

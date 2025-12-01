import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HelpRequest } from '../../shared/models/help-request.model';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
	private base = environment.apiUrl;

	constructor(private http: HttpClient) {}

	// Requests
	getRequests(): Observable<HelpRequest[]> {
		return this.http.get<HelpRequest[]>(`${this.base}/requests`);
	}

	getRequest(id: number): Observable<HelpRequest> {
		return this.http.get<HelpRequest>(`${this.base}/requests/${id}`);
	}

	createRequest(payload: Partial<HelpRequest>): Observable<HelpRequest> {
		return this.http.post<HelpRequest>(`${this.base}/requests`, payload);
	}

	reactToRequest(id: number): Observable<any> {
		return this.http.post(`${this.base}/requests/${id}/react`, {});
	}

	// Users
	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.base}/users`);
	}

	getUser(id: number): Observable<User> {
		return this.http.get<User>(`${this.base}/users/${id}`);
	}

	// Messages
	getMessages(): Observable<Message[]> {
		return this.http.get<Message[]>(`${this.base}/messages`);
	}

	getConversations(): Observable<any[]> {
		return this.http.get<any[]>(`${this.base}/conversations`);
	}

	getConversation(userId: number): Observable<Message[]> {
		return this.http.get<Message[]>(`${this.base}/conversations/${userId}`);
	}

	sendMessage(recipientId: number, message: string): Observable<any> {
		return this.http.post(`${this.base}/messages`, { recipient_id: recipientId, message });
	}
}


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
}


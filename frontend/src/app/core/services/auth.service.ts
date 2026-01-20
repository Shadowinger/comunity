import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

interface LoginResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
	private base = environment.apiUrl;
	private tokenKey = 'auth_token';
	private userKey = 'current_user';

	constructor(private http: HttpClient) {}

	login(email: string, password: string): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password }).pipe(
			tap(res => {
				localStorage.setItem(this.tokenKey, res.token);
				localStorage.setItem(this.userKey, JSON.stringify(res.user));
			})
		);
	}

	register(payload: { name: string; email: string; password: string }): Observable<any> {
		return this.http.post(`${this.base}/auth/register`, payload);
	}

	logout(): void {
		localStorage.removeItem(this.tokenKey);
		localStorage.removeItem(this.userKey);
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	isLoggedIn(): boolean {
		return !!this.getToken();
	}

	getCurrentUser(): User | null {
		const userStr = localStorage.getItem(this.userKey);
		if (userStr) {
			return JSON.parse(userStr);
		}
		return null;
	}

	getCurrentUserId(): number | null {
		const token = this.getToken();
		if (!token) return null;
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.id || null;
		} catch {
			return null;
		}
	}

	getUserRole(): string | null {
		const token = this.getToken();
		if (!token) return null;
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.role || null;
		} catch {
			return null;
		}
	}

	isAdmin(): boolean {
		return this.getUserRole() === 'admin';
	}
}


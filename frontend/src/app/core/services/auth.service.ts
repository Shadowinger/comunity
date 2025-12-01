import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
	private base = environment.apiUrl;
	private tokenKey = 'auth_token';

	constructor(private http: HttpClient) {}

	login(email: string, password: string): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password }).pipe(
			tap(res => localStorage.setItem(this.tokenKey, res.token))
		);
	}

	register(payload: { name: string; email: string; password: string }): Observable<any> {
		return this.http.post(`${this.base}/auth/register`, payload);
	}

	logout(): void {
		localStorage.removeItem(this.tokenKey);
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	isLoggedIn(): boolean {
		return !!this.getToken();
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


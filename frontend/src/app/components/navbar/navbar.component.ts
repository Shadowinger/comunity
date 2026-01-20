import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
	mobileMenuOpen = false;

	constructor(public auth: AuthService, private router: Router) {}

	get currentUserName(): string {
		const user = this.auth.getCurrentUser();
		return user?.name || '';
	}

	toggleMobileMenu(): void {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}

	closeMobileMenu(): void {
		this.mobileMenuOpen = false;
	}

	logout(): void {
		this.auth.logout();
		this.router.navigate(['/login']);
	}
}


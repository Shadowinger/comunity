import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	form: FormGroup;
	loading = false;

	constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}

	submit(): void {
		if (this.form.invalid) return;
		this.loading = true;
		const { email, password } = this.form.value;
		this.auth.login(email, password).subscribe({
			next: () => this.router.navigate(['/home']),
			error: () => (this.loading = false)
		});
	}
}


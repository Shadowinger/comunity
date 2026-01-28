import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { HelpRequest } from '../../shared/models/help-request.model';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	recentRequests: HelpRequest[] = [];
	loading = false;

	constructor(private apiService: ApiService) {}

	ngOnInit(): void {
		this.loadRecentRequests();
	}

	loadRecentRequests(): void {
		this.loading = true;
		this.apiService.getRequests().subscribe({
			next: (data) => {
				this.recentRequests = data.slice(0, 6);
				this.loading = false;
			},
			error: () => {
				this.loading = false;
			}
		});
	}

	onDelete(id: number): void {
		this.apiService.deleteRequest(id).subscribe({
			next: () => {
				this.recentRequests = this.recentRequests.filter(r => r.id !== id);
			},
			error: (err) => console.error('Delete failed:', err)
		});
	}
}


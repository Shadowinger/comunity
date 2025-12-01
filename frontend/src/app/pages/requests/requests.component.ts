import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { HelpRequest } from '../../shared/models/help-request.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: HelpRequest[] = [];
  loading = false;
  filterCategory = '';
  filterStatus = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.apiService.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  get filteredRequests(): HelpRequest[] {
    return this.requests.filter(r => {
      const matchCategory = !this.filterCategory || r.category === this.filterCategory;
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      return matchCategory && matchStatus;
    });
  }

  onReact(id: number): void {
    this.apiService.reactToRequest(id).subscribe({
      next: () => {
        const req = this.requests.find(r => r.id === id);
        if (req) {
          req.reaction_count = (req.reaction_count || 0) + 1;
        }
      },
      error: (err) => console.error('Reaction failed:', err)
    });
  }
}

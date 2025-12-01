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
}

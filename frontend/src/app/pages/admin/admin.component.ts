import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';
import { HelpRequest } from '../../shared/models/help-request.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  requests: HelpRequest[] = [];
  loading = false;
  activeTab: 'stats' | 'users' | 'requests' = 'stats';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.apiService.getUsers().subscribe(users => this.users = users);
    this.apiService.getRequests().subscribe(requests => {
      this.requests = requests;
      this.loading = false;
    });
  }

  get openRequestsCount(): number {
    return this.requests.filter(r => r.status === 'open').length;
  }

  get closedRequestsCount(): number {
    return this.requests.filter(r => r.status === 'closed').length;
  }

  deleteRequest(id: number): void {
    if (confirm('Opravdu chcete smazat tuto žádost?')) {
      this.apiService.deleteRequest(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Opravdu chcete smazat tohoto uživatele?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error:', err)
      });
    }
  }
}

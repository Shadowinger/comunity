import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  requests: any[] = [];
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
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
}

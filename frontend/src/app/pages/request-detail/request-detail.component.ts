import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest } from '../../shared/models/help-request.model';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  request: HelpRequest | null = null;
  loading = false;
  showMessageDialog = false;
  messageText = '';
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.sub;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadRequest(id);
  }

  loadRequest(id: number): void {
    this.loading = true;
    this.apiService.getRequest(id).subscribe({
      next: (data) => {
        this.request = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  openMessageDialog(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.showMessageDialog = true;
  }

  sendMessage(): void {
    if (!this.messageText.trim() || !this.request?.user_id) return;
    this.apiService.sendMessage(this.request.user_id, this.messageText).subscribe({
      next: () => {
        this.messageText = '';
        this.showMessageDialog = false;
        alert('Zpráva odeslána!');
      },
      error: (err) => console.error('Error:', err)
    });
  }
}

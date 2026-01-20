import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Message } from '../../shared/models/message.model';

interface Conversation {
  other_user_id: number;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedUserId: number | null = null;
  messages: Message[] = [];
  newMessage = '';
  loading = false;
  currentUserId: number | null = null;
  showMobileSidebar = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.loading = true;
    this.apiService.getConversations().subscribe({
      next: (data) => {
        this.conversations = data;
        this.loading = false;
        if (this.conversations.length > 0 && !this.selectedUserId) {
          this.selectConversation(this.conversations[0].other_user_id);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  selectConversation(userId: number): void {
    this.selectedUserId = userId;
    this.apiService.getConversation(userId).subscribe({
      next: (data) => {
        this.messages = data;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUserId) return;
    this.apiService.sendMessage(this.selectedUserId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.selectConversation(this.selectedUserId!);
        this.loadConversations();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  scrollToBottom(): void {
    const el = document.querySelector('.messages-thread');
    if (el) el.scrollTop = el.scrollHeight;
  }

  get selectedConversation(): Conversation | undefined {
    return this.conversations.find(c => c.other_user_id === this.selectedUserId);
  }
}

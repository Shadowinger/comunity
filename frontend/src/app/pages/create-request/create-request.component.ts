import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent {
  requestForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['other', Validators.required]
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.requestForm.invalid) return;

    this.loading = true;
    this.apiService.createRequest(this.requestForm.value).subscribe({
      next: () => {
        this.router.navigate(['/requests']);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }
}

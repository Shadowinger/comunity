import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HelpRequest } from '../../shared/models/help-request.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
	selector: 'app-request-card',
	templateUrl: './request-card.component.html',
	styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent {
	@Input() request!: HelpRequest;
	@Output() react = new EventEmitter<number>();
	@Output() delete = new EventEmitter<number>();

	constructor(public auth: AuthService) {}

	onReact(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.react.emit(this.request.id);
	}

	onDelete(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		if (confirm('Opravdu chcete smazat tento požadavek?')) {
			this.delete.emit(this.request.id);
		}
	}
}

// Add CommonModule import for ngSwitch/ngClass


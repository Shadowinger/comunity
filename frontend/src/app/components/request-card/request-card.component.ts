import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HelpRequest } from '../../shared/models/help-request.model';

@Component({
	selector: 'app-request-card',
	templateUrl: './request-card.component.html',
	styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent {
	@Input() request!: HelpRequest;
	@Output() react = new EventEmitter<number>();

	onReact(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.react.emit(this.request.id);
	}
}

// Add CommonModule import for ngSwitch/ngClass


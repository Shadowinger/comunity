import { Component, Input } from '@angular/core';
import { HelpRequest } from '../../shared/models/help-request.model';

@Component({
	selector: 'app-request-card',
	templateUrl: './request-card.component.html',
	styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent {
	@Input() request!: HelpRequest;
}


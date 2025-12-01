export interface Message {
	id: number;
	sender_id: number;
	recipient_id: number;
	sender_name?: string;
	recipient_name?: string;
	message: string;
	created_at: string;
}

export interface Conversation {
	other_user_id: number;
	other_user_name: string;
	last_message: string;
	last_message_time: string;
}


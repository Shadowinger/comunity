export interface Message {
	id: number;
	sender_id: number;
	sender_name?: string;
	message: string;
	created_at: string;
}


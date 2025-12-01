export interface HelpRequest {
	id: number;
	title: string;
	description: string;
	category: string;
	status: string;
	user_id?: number;
	user_name?: string;
	created_at?: string;
	reaction_count?: number;
}


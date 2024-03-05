export interface HubToken {
    token_type?: string;
    refresh_token: string;
    access_token: string;
    expires_in: number;
    updated_at?: Date | null;
    message?: string;
}

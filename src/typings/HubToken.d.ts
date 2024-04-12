export interface HubToken {
    id: number;
    portal_id: number | null;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    created_at: Date;
    updated_at: Date | null;
    message?: string;
}

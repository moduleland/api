
export type OAuthAccessToken = {
    access_token: string;
    token_type: string;
    scope: string;
    valid_scopes: boolean;

    error?: string;
    error_description?: string;
}

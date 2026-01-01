const AUTHORIZATION_ENDPOINT = 'https://start.gg/oauth/authorize';
const ACCESS_TOKEN_ENDPOINT = 'https://api.start.gg/oauth/access_token';

export type OAuth2Token = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
};

/**
 * @see https://developer.start.gg/docs/oauth/scopes#what-scopes-do-i-have-access-to
 */
export type StartggScope =
  | 'user.identity'
  | 'user.email'
  | 'tournament.manager'
  | 'tournament.reporter';

export class Startgg {
  constructor(
    private clientId: string,
    private clientSecret: string,
    private redirectUri: string
  ) {}

  public createAuthorizationURL(scopes: StartggScope[]) {
    const url = new URL(AUTHORIZATION_ENDPOINT);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('scope', scopes.join(' '));
    url.searchParams.set('redirect_uri', this.redirectUri);
    return url;
  }

  public async validateAuthorizationCode(code: string, scopes: StartggScope[]) {
    const res = await fetch(ACCESS_TOKEN_ENDPOINT, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_secret: this.clientSecret,
        code,
        scopes: encodeURIComponent(scopes.join(' ')),
        client_id: this.clientId,
        redirect_uri: this.redirectUri
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }

    return data as OAuth2Token;
  }
}

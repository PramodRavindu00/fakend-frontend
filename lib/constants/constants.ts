export enum AuthStatus{
  Authenticated = 'Authenticated',
  Guest = 'Guest',
  Loading= 'Loading'
}
export interface CurrentUser {
  id: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: CurrentUser;
}

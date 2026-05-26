export interface CurrentUser {
  id: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: CurrentUser;
}

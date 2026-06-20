export enum AuthStatus {
  Authenticated = "Authenticated",
  Guest = "Guest",
  Loading = "Loading",
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: CurrentUser;
}

export interface LinkItem {
  title: string;
  href: string;
}

export const marketingLinks: LinkItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Docs",
    href: "/docs",
  },
];

export const authenticatedLinks: LinkItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

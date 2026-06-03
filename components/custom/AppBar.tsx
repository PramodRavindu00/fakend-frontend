"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { AuthStatus } from "@/lib/constants/constants";
import { Skeleton } from "../ui/skeleton";

interface AppBarProps {
  showMarketingLinks?: boolean;
}

interface AuthActionsProps {
  authStatus: AuthStatus;
}

interface LinkItem {
  title: string;
  href: string;
}
const marketingLinks: LinkItem[] = [
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
const AppBar = ({ showMarketingLinks = false }: AppBarProps) => {
  const authStatus = useAuthStore((state) => state.status);
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between  p-5 border-b bg-background/95 backdrop-blur">
      {/* logo */}
      <div className="hidden sm:block">Logo</div>

      {/* marketing links */}
      {showMarketingLinks && <MarketingNavigation />}

      {/* auth actions */}
      <AuthActions authStatus={authStatus} />
    </header>
  );
};

export default AppBar;

const MarketingNavigation = () => (
  <NavigationMenu>
    <NavigationMenuList className="flex space-x-5">
      {marketingLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <NavigationMenuLink asChild>
            <Link href={link.href}>{link.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

const AuthActions = ({ authStatus }: AuthActionsProps) => (
  <div>
    {authStatus === AuthStatus.Loading ? (
      <Skeleton />
    ) : authStatus === AuthStatus.Authenticated ? (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>AU</AvatarFallback>
      </Avatar>
    ) : (
      <Link href="/login">
        <Button size="lg" variant="outline">
          Login
        </Button>
      </Link>
    )}
  </div>
);

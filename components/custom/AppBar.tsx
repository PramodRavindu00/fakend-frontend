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
import {
  authenticatedLinks,
  AuthStatus,
  CurrentUser,
  LinkItem,
  marketingLinks,
} from "@/lib/constants/constants";
import { Skeleton } from "../ui/skeleton";
import { Menu, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import GoogleIcon from "../icons/GoogleIcon";
import GithubIcon from "../icons/GithubIcon";

interface AuthStatusProps {
  authStatus: AuthStatus;
  user: CurrentUser | null;
}

interface MobileNavigationProps {
  links: LinkItem[];
}

const AppBar = () => {
  const authStatus = useAuthStore((state) => state.status);
  const currentUser = useAuthStore((s) => s.user);
  const mobileLinks: LinkItem[] =
    authStatus === AuthStatus.Authenticated
      ? [...authenticatedLinks]
      : [...marketingLinks];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-5 border-b bg-background/95 backdrop-blur">
      {/* logo */}
      <div className="hidden sm:block">Logo</div>

      <MobileNavigation links={mobileLinks} />
      {/* marketing links */}

      {authStatus !== AuthStatus.Authenticated && <MarketingNavigation />}
      {/* auth actions */}

      <div className="flex gap-2">
        <ThemeToggleButton />
        <AuthActions authStatus={authStatus} user={currentUser} />
      </div>
    </header>
  );
};

const MarketingNavigation = () => (
  <NavigationMenu className="hidden sm:flex">
    <NavigationMenuList className="flex space-x-5">
      {marketingLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <NavigationMenuLink asChild className="text-md">
            <Link href={link.href}>{link.title}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

const AuthActions = ({ authStatus, user }: AuthStatusProps) => {
  const fallbackName = user?.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  if (authStatus === AuthStatus.Loading) {
    return <Skeleton className="w-16 rounded-lg" />;
  }

  if (authStatus === AuthStatus.Authenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={user?.avatarUrl ?? undefined}
              referrerPolicy="no-referrer"
              alt={user?.name}
            />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-31"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuItem asChild></DropdownMenuItem>
          <Button variant="ghost" size="sm">Logout</Button>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-16">
          Login
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-31"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuItem asChild>
          <a href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/oauth/google`}>
            <GoogleIcon /> Google Login
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/oauth/github`}>
            <GithubIcon /> GitHub Login
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MobileNavigation = ({ links }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="sm:hidden p-0">
          <Menu className="size-5 p-0" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col items-center gap-5 p-5"
      >
        <SheetHeader>
          <div>Logo</div>
          <SheetTitle className="sr-only">Main Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate to main sections of the application
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-md"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ThemeToggleButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      className="size-8 rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun color="yellow" /> : <Moon color="blue" />}
    </Button>
  );
};

export default AppBar;

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
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface AuthStatusProps {
  authStatus: AuthStatus;
}

interface MobileNavigationProps {
  links: LinkItem[];
}

const AppBar = () => {
  const authStatus = useAuthStore((state) => state.status);
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

      <div className="flex  gap-5 ml-auto">
        <ThemeToggleButton />
        <AuthActions authStatus={authStatus} />
      </div>
    </header>
  );
};

const MarketingNavigation = () => (
  <NavigationMenu className="hidden sm:flex">
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

const AuthActions = ({ authStatus }: AuthStatusProps) => (
  <>
    {authStatus === AuthStatus.Loading ? (
      <Skeleton />
    ) : authStatus === AuthStatus.Authenticated ? (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>AU</AvatarFallback>
      </Avatar>
    ) : (
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
    )}
  </>
);

const MobileNavigation = ({ links }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="sm:hidden p-0">
          <Menu />
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
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={23} /> : <Moon size={23} />}
    </Button>
  );
};

export default AppBar;

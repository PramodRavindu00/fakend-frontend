"use client";
import { cn } from "@/util/cn";
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
];
const AppBar = ({ showMarketingLinks = false }: AppBarProps) => {
  const authStatus = useAuthStore((state) => state.status);
  return (
    <header className={cn("w-full flex items-center py-5")}>
      {/* logo */}
      <div className="hidden md:block absolute left-5">Logo</div>
      {showMarketingLinks && (
        <NavigationMenu className="flex mx-auto">
          <NavigationMenuList>
            {marketingLinks.map((link: LinkItem) => (
              <NavigationMenuItem key={link.href} className="px-2">
                <NavigationMenuLink asChild>
                  <Link href={link.href}>{link.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}

      {/* login,profile and other actions */}
      <div className="absolute right-5 flex justify-center items-center gap-5">
        {authStatus === AuthStatus.Loading ? (
          <Skeleton className="rounded-full">
            <Avatar/>
          </Skeleton>
        ) : authStatus === AuthStatus.Authenticated ? (
          <>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </header>
  );
};

export default AppBar;

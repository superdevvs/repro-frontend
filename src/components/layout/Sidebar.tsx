import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  BarChart,
  CalendarIcon,
  CameraIcon,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  ReceiptIcon,
  Settings,
  Users,
  UsersRoundIcon,
  UserRoundCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to="/"
          ref={ref}
          className="block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm capitalize text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const adminItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Shoots",
    href: "/shoots",
    icon: CameraIcon,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: CalendarIcon,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Photographers",
    href: "/photographers",
    icon: UsersRoundIcon,
  },
  {
    title: "Service Management",
    href: "/services",
    icon: ListChecks,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: ReceiptIcon,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: UserRoundCog,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const guestItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Availability",
    href: "/availability",
    icon: CalendarIcon,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: UserRoundCog,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const { role } = useAuth();

  const isAdmin = role === "admin" || role === "superadmin";
  const isGuest = role === "photographer";

  const items = isAdmin ? adminItems : isGuest ? guestItems : [];

  return (
    <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 h-screen w-60 flex-col space-y-1 text-sm font-medium md:flex">
      <div className="flex flex-col gap-y-4 px-3 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            {items.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link to={item.href} className="relative">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {item.badge && (
                        <div className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {item.badge}
                        </div>
                      )}
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const { role } = useAuth();

  const isAdmin = role === "admin" || role === "superadmin";
  const isGuest = role === "photographer";

  const items = isAdmin ? adminItems : isGuest ? guestItems : [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <AlignJustify className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <div className="flex flex-col gap-y-4 px-3 py-2">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link to={item.href} className="relative">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                        {item.badge && (
                          <div className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                            {item.badge}
                          </div>
                        )}
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
}

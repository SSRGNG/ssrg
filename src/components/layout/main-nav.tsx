"use client";

import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

type Props = React.ComponentProps<typeof NavigationMenu> & {
  items: NavItem[];
  blur?: boolean;
};

function MainNav({ items, blur = false, className, ...props }: Props) {
  return (
    <NavigationMenu className={cn("hidden md:block", className)} {...props}>
      <NavigationMenuList className="gap-0 lg:gap-1">
        {items.map((item, index) => {
          const Icon = Icons[item.icon];

          return item.items.length === 0 ? (
            <NavigationMenuItem key={item.title}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    blur && "bg-transparent hover:bg-accent/10",
                    "font-semibold lg:text-base capitalize h-auto px-2 lg:px-4"
                  )}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger
                className={cn(
                  blur && "bg-transparent hover:bg-accent/10",
                  "font-semibold lg:text-base capitalize h-auto px-2 lg:px-4"
                )}
              >
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 lg:p-5 md:w-[500px] lg:w-[700px] lg:grid-cols-[.70fr_1fr]">
                  <li className="row-span-4">
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex size-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-muted/50 to-muted p-4 lg:p-5 no-underline outline-none focus:shadow-sm"
                        )}
                      >
                        <Icon className="size-7" aria-hidden="true" />
                        <div className="mb-2 text-lg font-medium">
                          {item.title}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <span className="sr-only">{item.title}</span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {item.items.map((item) => (
                    <MenuItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                    >
                      {item.description}
                    </MenuItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type MenuItemProps = React.ComponentPropsWithRef<typeof Link> & {
  title: string;
};

function MenuItem({
  className,
  title,
  children,
  href,
  ...props
}: MenuItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={String(href)} className={cn(className)} {...props}>
          <p className="text-base font-medium leading-none">{title}</p>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
export { MainNav };

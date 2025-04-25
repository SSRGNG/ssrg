"use client";

import { ChevronDownIcon } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userNav } from "@/config/constants";
import { cn, isRoleAllowed } from "@/lib/utils";
import type { NavItem, UserNavItem } from "@/types";

type NavProps = React.ComponentProps<"nav"> & {
  items: NavItem[];
  pathname: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function MainNav({
  items,
  pathname,
  setIsOpen,
  className,
  ...props
}: NavProps) {
  const initialOpenItems = items.reduce((acc, item, index) => {
    if (item.items.length > 0) {
      acc[`${index}`] = true;
    }
    return acc;
  }, {} as { [key: string]: boolean });

  const [openItems, setOpenItems] = React.useState<{ [key: string]: boolean }>(
    initialOpenItems
  );

  const toggleSubMenu = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNavItems = (items: NavItem[], parentKey = "") => {
    return items.map((item, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;

      return (
        <React.Fragment key={key}>
          {item.items.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex w-full">
                {/* Left side of button navigates to page */}
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: pathname.includes(item.href)
                        ? "secondary"
                        : "ghost",
                      className:
                        "flex-1 rounded-r-none justify-start gap-1 has-[>svg]:px-2",
                    })
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <NavIcon icon={item.icon} />
                  {item.title}
                </Link>

                {/* Right side of button toggles submenu */}
                <Button
                  variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                  className="rounded-l-none px-2 border-l border-border/50"
                  onClick={() => toggleSubMenu(key)}
                >
                  <ChevronDownIcon
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      openItems[key] ? "rotate-180" : ""
                    )}
                  />
                </Button>
              </div>

              <Collapsible
                open={openItems[key]}
                onOpenChange={() => toggleSubMenu(key)}
              >
                <CollapsibleContent
                  className={cn(
                    "flex flex-col gap-0.5 pl-0.5 ml-4 pt-0.5 border-l border-border"
                  )}
                >
                  {renderNavItems(item.items, key)}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <NavLink
              key={parentKey}
              href={item.href}
              pathname={pathname}
              setIsOpen={setIsOpen}
            >
              <NavIcon icon={item.icon} />
              {item.title}
            </NavLink>
          )}
          {/* {item.items.length === 0 ? (
            <NavLink
              key={parentKey}
              href={item.href}
              pathname={pathname}
              setIsOpen={setIsOpen}
            >
              <NavIcon icon={item.icon} />
              {item.title}
            </NavLink>
          ) : (
            <Collapsible
              open={openItems[key]}
              onOpenChange={() => toggleSubMenu(key)}
            >
              <CollapsibleTrigger asChild className="transition-all">
                <Button
                  variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                  className="w-full items-center gap-1 has-[>svg]:px-2"
                >
                  <NavIcon icon={item.icon} />
                  {item.title}
                  <ChevronDownIcon
                    className={cn(
                      "size-4 ml-auto text-muted-foreground transition-transform",
                      openItems[key] ? "rotate-180" : ""
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  "flex flex-col gap-0.5 pl-0.5 ml-4 pt-0.5 border-l border-border"
                )}
              >
                {renderNavItems(item.items, key)}
              </CollapsibleContent>
            </Collapsible>
          )} */}
        </React.Fragment>
      );
    });
  };

  return (
    <nav className={cn("space-y-0.5", className)} {...props}>
      {renderNavItems(items)}
    </nav>
  );
}

type UserNavProps = React.ComponentProps<"nav"> & {
  items: UserNavItem[];
  user?: User;
  pathname: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function UserNav({
  items,
  user,
  pathname,
  setIsOpen,
  className,
  ...props
}: UserNavProps) {
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key) && (e.metaKey || e.ctrlKey)) {
        const key = e.key.toLowerCase();
        const item = userNav[key];
        if (item) {
          e.preventDefault();
          router.push(item.href);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <nav className={cn("")} {...props}>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn("w-full px-2 has-[>svg]:px-2", className)}
              size={"lg"}
            >
              <UserAvatar user={user} inline />
              <Icons.updown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-52">
            <DropdownMenuGroup>
              {items.map((item) => {
                if (isRoleAllowed(item.roles, user.role)) {
                  const baseKey = `${item.title}-${item.href}`;
                  const { href, title, icon, cmd } = item;
                  const Icon = Icons[icon];
                  return (
                    <DropdownMenuItem
                      key={baseKey}
                      asChild
                      className="hover:cursor-pointer"
                    >
                      <Link
                        href={href}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            className: `px-2 gap-1.5 w-full has-[>svg]:px-2 ${
                              href === pathname && "text-primary"
                            }`,
                            size: "sm",
                          })
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {icon ? <Icon /> : null}
                        {title}
                        <DropdownMenuShortcut>{cmd}</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  );
                }
                return null;
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Logo
          href={"/"}
          className="w-full py-1.5 px-2 rounded-md"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}

type NavLinkProps = React.ComponentProps<typeof Link> & {
  pathname: string;
  disabled?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavLink({
  pathname,
  setIsOpen,
  href,
  disabled,
  ...props
}: NavLinkProps) {
  const isActive = href === pathname;

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
          className: `px-2 has-[>svg]:px-2 justify-start gap-1 w-full ${
            disabled && "pointer-events-none opacity-60"
          }`,
        })
      )}
      onClick={() => setIsOpen(false)}
      {...props}
    >
      {props.children}
    </Link>
  );
}

function NavIcon({ icon }: { icon: Icons }) {
  const Icon = Icons[icon];
  return <Icon className="size-4 text-muted-foreground" />;
}
export { MainNav, UserNav };

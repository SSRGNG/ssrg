import Link from "next/link";

import { CopyToClipboard } from "@/components/shared/copy-to-clipboard";
import { Icons } from "@/components/shared/icons";
import { ModeToggle } from "@/components/shared/theme";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"footer">;

function Footer({ className, ...props }: Props) {
  const year = new Date().getFullYear();
  const nav = appConfig.footerNav;
  return (
    <footer
      className={cn(
        "w-full border-t border-border/50 bg-background text-base leading-tight",
        className
      )}
      {...props}
    >
      <section className="container py-4 space-y-6">
        <section className="grid xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {nav.slice(0, -1).map((item) => {
            return (
              <div key={item.title} className="space-y-4">
                <h4 className="text-base font-medium">{item.title}</h4>
                <ul className="space-y-2.5 text-sm">
                  {item.items.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="space-y-4">
            <h4 className="text-base font-medium">
              {nav[nav.length - 1].title}
            </h4>
            <ul className="space-y-2.5 text-muted-foreground text-sm">
              <li>{appConfig.address}</li>
              <li>
                <a
                  href={`tel:${appConfig.phone}`}
                  className="transition-colors hover:text-foreground"
                >
                  {appConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`mailto:${appConfig.email}`}
                        className="transition-colors hover:text-foreground truncate pb-1 leading-none"
                      >
                        {appConfig.displayEmail}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{appConfig.email}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <CopyToClipboard
                  textToCopy={appConfig.email}
                  icon
                  className="size-5"
                  aria-label="Copy email address to clipboard"
                />
                <span className="sr-only">Email: {appConfig.email}</span>
              </li>
            </ul>
          </div>
        </section>
        <section className="flex flex-col items-center xs:flex-row xs:justify-between text-muted-foreground">
          <div className="flex items-center gap-1.5 text-xs font-heading">
            <Link
              href={"/"}
              className="transition-colors hover:text-foreground inline-flex items-center gap-1"
            >
              <span>&copy; {year}</span>
              <span>{appConfig.name}</span>
              <span className="sr-only">Home</span>
            </Link>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-1">
            {appConfig.navSecondary.slice(1).map((item) => {
              const { href, title, icon, external } = item;
              const Icon = Icons[icon];
              return (
                <Link
                  href={href}
                  key={title}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className={cn(
                    buttonVariants({
                      size: "icon",
                      variant: "ghost",
                    })
                  )}
                >
                  <Icon className="size-3" aria-hidden="true" />
                  <span className="sr-only">{title}</span>
                </Link>
              );
            })}
            <ModeToggle />
          </div>
        </section>
      </section>
    </footer>
  );
}

export { Footer };

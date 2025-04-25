import { AuthUser } from "@/components/layout/auth-user";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/shared/logo";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";
import { User } from "next-auth";

type Props = React.ComponentProps<"header"> & {
  blur?: boolean;
  user?: User;
};

function Header({ blur, user, className, ...props }: Props) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background",
        className
      )}
      {...props}
    >
      <section className="container py-3 flex items-center gap-6">
        <Logo href={"/"} />
        <MainNav items={appConfig.mainNav} blur={blur} />
        <section className="ml-auto flex items-center gap-2.5">
          <AuthUser user={user} />
          <MobileNav user={user} />
        </section>
      </section>
    </header>
  );
}

export { Header };

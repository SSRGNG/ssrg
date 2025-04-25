import { User } from "next-auth";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

type Props = React.ComponentProps<typeof Avatar> & {
  user: Pick<User, "name" | "email" | "image">;
  initials?: boolean;
  inline?: boolean;
  imageClassName?: string;
  fallbackClassName?: string;
  iconClassName?: string;
};

function UserAvatar({
  user: { name, email, image },
  initials = false,
  inline = false,
  fallbackClassName,
  iconClassName,
  imageClassName,
  className,
  ...props
}: Props) {
  return (
    <React.Fragment>
      <Avatar
        className={cn("rounded-md items-center justify-center", className)}
        {...props}
      >
        {image ? (
          <AvatarImage
            src={image}
            alt={name || ""}
            className={cn("rounded-md", imageClassName)}
          />
        ) : (
          <AvatarFallback
            className={cn("text-sm text-primary rounded-md", fallbackClassName)}
          >
            <span className="sr-only">{name}</span>
            {initials ? (
              getInitials(name).toUpperCase()
            ) : (
              <Icons.user className={cn("size-4", iconClassName)} />
            )}
          </AvatarFallback>
        )}
      </Avatar>
      {inline && (
        <div className="grid flex-1 text-left text-sm leading-tight gap-0.5">
          <span className="truncate font-semibold">{name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </div>
      )}
    </React.Fragment>
  );
}

export { UserAvatar };

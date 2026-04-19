"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChangePassword } from "@/components/views/portal/change-password";
import { UserProfiles } from "@/lib/actions/queries";
import { cn, getInitials } from "@/lib/utils";

type Props = React.ComponentProps<typeof Card> & { profiles: UserProfiles };

function Profile({ profiles, className, ...props }: Props) {
  const profileTypes = [];
  if (profiles.researcher) profileTypes.push("Researcher");
  if (profiles.author) profileTypes.push("Author");

  const displayRole = !profileTypes.some(
    (t) => t.toLowerCase() === profiles.user.role.toLowerCase(),
  );

  return (
    <Card className={cn("sm:py-4", className)} {...props}>
      <CardContent className="flex flex-col xsm:flex-row gap-4 sm:px-4">
        <Avatar className="h-44 w-full xsm:w-32 xsm:h-auto xsm:self-stretch shrink-0 rounded-lg">
          <AvatarImage
            className="object-cover object-center"
            src={profiles.user.image || ""}
            alt={profiles.user.name}
          />
          <AvatarFallback className="text-lg h-full w-full">
            {getInitials(profiles.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 gap-2.5">
          <div className="space-y-0.5">
            <h1 className="text-xl leading-tight font-bold">
              {profiles.user.name}
            </h1>
            <p className="text-muted-foreground">{profiles.user.email}</p>
            {profiles.user.affiliation && (
              <p className="text-sm text-muted-foreground">
                {profiles.user.affiliation}
              </p>
            )}
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {displayRole && (
                <Badge className="capitalize">{profiles.user.role}</Badge>
              )}
              {profileTypes.map((type) => (
                <Badge key={type} variant="brand">
                  {type}
                </Badge>
              ))}
            </div>

            <ChangePassword>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 w-full xs:w-fit text-xs"
              >
                Change password
              </Button>
            </ChangePassword>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { Profile };

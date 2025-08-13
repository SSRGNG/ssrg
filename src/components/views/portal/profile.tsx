import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfiles } from "@/lib/actions/queries";
import { cn, getInitials } from "@/lib/utils";

type Props = React.ComponentProps<typeof Card> & { profiles: UserProfiles };

function Profile({ profiles, className, ...props }: Props) {
  const profileTypes = [];
  if (profiles.researcher) profileTypes.push("Researcher");
  if (profiles.author) profileTypes.push("Author");

  return (
    <Card className={cn(className)} {...props}>
      <CardContent className="flex flex-col xsm:flex-row xsm:items-center gap-4">
        <Avatar className="h-32 w-full xsm:w-24 xs:w-32 rounded-lg">
          <AvatarImage
            className="object-cover"
            src={profiles.user.image || ""}
            alt={profiles.user.name}
          />
          <AvatarFallback className="text-lg">
            {getInitials(profiles.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2.5">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold">{profiles.user.name}</h1>
            <p className="text-muted-foreground">{profiles.user.email}</p>
            {profiles.user.affiliation && (
              <p className="text-sm text-muted-foreground">
                {profiles.user.affiliation}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Badge className="capitalize">{profiles.user.role}</Badge>
            {profileTypes.map((type) => (
              <Badge key={type} variant="brand">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { Profile };

import { Building2, Calendar, Tag } from "lucide-react";
import React from "react";

import { Section } from "@/components/shell/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllMembers } from "@/lib/queries/members";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function MemberCards({ className, ...props }: Props) {
  // const members = exampleMembers;
  const members = await getAllMembers();

  if (members.length === 0) return null;

  const getStatusColor = (status: string | null) => {
    const colors: Record<string, string> = {
      approved: "bg-emerald-500/15 text-emerald-500",
      pending: "bg-yellow-100 text-yellow-500",
      rejected: "bg-rose-500/15 text-rose-500",
    };
    return colors[status || ""] || "bg-muted text-muted-foreground";
  };

  const getTypeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      individual: "bg-blue-500/15 text-blue-500",
      organization: "bg-purple-500/15 text-purple-500",
    };
    return colors[type || ""] || "bg-gray-500/15 text-gray-500";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(new Date(date));
  };

  // Filter to show only approved members first, then others
  const approvedMembers = members.filter((m) => m.status === "approved");
  const otherMembers = members.filter((m) => m.status !== "approved");
  const sortedMembers = [...approvedMembers, ...otherMembers];

  return (
    <Section
      className={cn("grid xs:grid-cols-2 lg:grid-cols-3 gap-4", className)}
      {...props}
    >
      {sortedMembers.map((member) => (
        <Card key={member.id} className="gap-3.5 h-full shadow-none">
          <CardHeader>
            <div className="space-0.5">
              <CardTitle className=" line-clamp-2">{member.name}</CardTitle>
              <CardDescription className="break-all leading-tight">
                {member.email}
              </CardDescription>
            </div>
            <CardAction>
              <Avatar className="size-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </CardAction>
          </CardHeader>

          <CardContent className="space-y-2.5">
            {/* Status and Type Badges */}
            <div className="flex flex-wrap gap-1.5">
              {member.status && (
                <Badge
                  variant="secondary"
                  className={cn("text-xs", getStatusColor(member.status))}
                >
                  {member.status.charAt(0).toUpperCase() +
                    member.status.slice(1)}
                </Badge>
              )}
              {member.type && (
                <Badge
                  variant="secondary"
                  className={cn("text-xs", getTypeColor(member.type))}
                >
                  {member.type === "individual" ? "Individual" : "Organization"}
                </Badge>
              )}
            </div>

            {/* Affiliation */}
            {member.affiliation && (
              <CardDescription className="text-sm flex items-start gap-2">
                <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{member.affiliation}</span>
              </CardDescription>
            )}
            {/* Interests */}
            {member.interests && member.interests.length > 0 && (
              <React.Fragment>
                <h4 className="flex items-center gap-2 text-sm ">
                  <Tag className="w-4 h-4" />
                  <span>Research Interests</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {member.interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="muted">
                      {interest}
                    </Badge>
                  ))}
                  {member.interests.length > 3 && (
                    <Badge variant="muted">
                      +{member.interests.length - 3}
                    </Badge>
                  )}
                </div>
              </React.Fragment>
            )}
          </CardContent>
          {/* Join Date */}
          <CardFooter className="mt-auto gap-2 text-xs text-muted-foreground border-t">
            <Calendar className="w-3 h-3" />
            <span>Joined {formatDate(member.joinedAt)}</span>
          </CardFooter>
        </Card>
      ))}
    </Section>
  );
}

// async function MemberCards({ className, ...props }: Props) {
//   const members = await getAllMembers();
//   if (members.length === 0) return null;
//   return (
//     <Section
//       className={cn("grid xs:grid-cols-2 md:grid-cols-4 gap-4", className)}
//       {...props}
//     >
//       {members.map((member) => (
//         <Card key={member.id} className="gap-2.5">
//           <CardHeader>
//             <CardTitle className="font-semibold">{member.name}</CardTitle>
//             <CardDescription>{member.email}</CardDescription>
//           </CardHeader>
//           {member.affiliation && (
//             <CardContent>
//               <p className="text-sm">{member.affiliation}</p>
//             </CardContent>
//           )}
//         </Card>
//       ))}
//     </Section>
//   );
// }

export { MemberCards };

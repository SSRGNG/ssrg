"use client";

import {
  Calendar,
  Edit,
  ExternalLink,
  Mail,
  UserMinus,
  UserPlus,
} from "lucide-react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AdminTeams } from "@/lib/actions/queries";
import { formatDate } from "@/lib/utils";

type TeamMember = {
  id: string;
  researcherId: string;
  name: string;
  title: string;
  image?: string;
  email: string;
  role: string;
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
  expertise: string[];
};

type TeamDetailsProps = {
  team: AdminTeams[number];
  members: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
};

function TeamDetailsModal({
  team,
  members,
  isOpen,
  onClose,
}: TeamDetailsProps) {
  const activeMembers = members.filter((m) => m.isActive);
  const formerMembers = members.filter((m) => !m.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {team.title}
            {team.featured && <Badge variant="outline">Featured</Badge>}
          </DialogTitle>
          <DialogDescription>
            {team.description ||
              "Research project team details and member management"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <Badge
                    variant={
                      team.status === "active"
                        ? "default"
                        : team.status === "completed"
                        ? "brand"
                        : team.status === "on_hold"
                        ? "outline"
                        : team.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {team.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Priority
                  </div>
                  <Badge
                    variant={
                      team.priority === "critical"
                        ? "destructive"
                        : team.priority === "high"
                        ? "default"
                        : team.priority === "medium"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {team.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Progress
                </div>
                <Progress value={team.progressPercentage} className="h-2" />
                <div className="text-sm text-muted-foreground mt-1">
                  {team.progressPercentage}% complete
                </div>
              </div>

              {team.budgetTotal && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Budget
                  </div>
                  <div className="text-lg font-semibold">
                    ${Number(team.budgetTotal).toLocaleString()}
                  </div>
                  {team.budgetUsed && (
                    <div className="text-sm text-muted-foreground">
                      ${Number(team.budgetUsed).toLocaleString()} used (
                      {(
                        (Number(team.budgetUsed) / Number(team.budgetTotal)) *
                        100
                      ).toFixed(0)}
                      %)
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {team.startDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(team.startDate)}
                    </div>
                  </div>
                )}
                {team.endDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      End Date
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(team.endDate)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lead Researcher */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Researcher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <UserAvatar
                  user={{
                    name: team.leadResearcherName,
                    image: team.leadResearcherImage,
                  }}
                  className="size-12"
                />
                <div className="flex-1">
                  <div className="font-medium">{team.leadResearcherName}</div>
                  <div className="text-sm text-muted-foreground">
                    {team.leadResearcherTitle}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Team Members</CardTitle>
              <CardDescription>
                {activeMembers.length} active member
                {activeMembers.length !== 1 ? "s" : ""}
                {formerMembers.length > 0 && `, ${formerMembers.length} former`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Active Members */}
              {activeMembers.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">
                    Active Members
                  </h4>
                  <div className="space-y-3">
                    {activeMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <UserAvatar
                          user={{ name: member.name, image: member.image }}
                          className="size-10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.title}
                          </div>
                          {member.expertise.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {member.expertise.slice(0, 3).map((expertise) => (
                                <Badge
                                  key={expertise}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {expertise}
                                </Badge>
                              ))}
                              {member.expertise.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{member.expertise.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Joined{" "}
                            {formatDate(member.joinedAt, {
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Former Members */}
              {formerMembers.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">
                      Former Members
                    </h4>
                    <div className="space-y-3">
                      {formerMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 border rounded-lg opacity-60"
                        >
                          <UserAvatar
                            user={{ name: member.name, image: member.image }}
                            className="size-10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {member.role}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.title}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {member.leftAt && (
                              <div>
                                Left{" "}
                                {formatDate(member.leftAt, {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export { TeamDetailsModal };

"use client";

import { formatDate } from "date-fns";
import {
  BookOpen,
  Briefcase,
  Eye,
  GraduationCap,
  KeyRound,
  Link2,
  Mail,
  MapPin,
  Video,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { AdminChangePassword } from "@/components/forms/admin-change-password";
import { Icons } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { roles } from "@/config/enums";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AdminUsers, UserProfileById } from "@/lib/actions/queries";
import { getUserProfileById } from "@/lib/actions/user";
import { cn, getInitials } from "@/lib/utils";

type UserType = AdminUsers[number];
type Props = React.ComponentProps<typeof Drawer> & { user: UserType };

// ─── Loading skeleton ────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="px-4 space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-14 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </h4>
  );
}

// ─── Tag list ────────────────────────────────────────────────────────────────

function TagList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="text-xs font-normal">
          {item}
        </Badge>
      ))}
    </div>
  );
}

// ─── Bordered list ───────────────────────────────────────────────────────────

function BordedList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-1 list-none">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-xs text-muted-foreground border-l-2 pl-2 border-brand"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Rich profile body ───────────────────────────────────────────────────────

type ProfileData = UserProfileById;
// type ProfileData = NonNullable<Awaited<ReturnType<typeof getUserProfileById>>>;

function ProfileBody({
  profile,
  user,
  onPasswordChanged,
}: {
  profile: ProfileData;
  user: UserType;
  onPasswordChanged?: () => void;
}) {
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const { researcher, author } = profile;

  return (
    <div className="px-4 space-y-5 pb-4 overflow-auto">
      {/* ── Identity ── */}
      <div className="flex items-start gap-3">
        <Avatar className="size-14 rounded-md shrink-0">
          <AvatarImage
            src={profile.user.image ?? ""}
            alt={profile.user.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-md text-base font-medium">
            {getInitials(profile.user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <p className="font-semibold leading-tight truncate">
            {profile.user.name}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <Mail className="size-3 shrink-0" />
            {profile.user.email}
          </p>
          {profile.user.affiliation && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
              <MapPin className="size-3 shrink-0" />
              {profile.user.affiliation}
            </p>
          )}
          <div className="flex flex-wrap gap-1 pt-0.5">
            <Badge
              variant={
                profile.user.role === "admin"
                  ? "default"
                  : profile.user.role === "researcher"
                    ? "brand"
                    : "secondary"
              }
              className="text-xs capitalize"
            >
              {roles.getLabel(profile.user.role)}
            </Badge>
            {researcher && profile.user.role !== "researcher" && (
              <Badge variant="brand" className="text-xs">
                <GraduationCap className="size-3" />
                Researcher
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Research output summary ── */}
      {(user.publicationCount > 0 ||
        user.videoCount > 0 ||
        user.projectCount > 0) && (
        <>
          <Separator />
          <div className="flex gap-4 text-center">
            {user.publicationCount > 0 && (
              <div className="flex-1 space-y-0.5">
                <p className="text-lg font-semibold">{user.publicationCount}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <BookOpen className="size-3" />
                  {user.publicationCount === 1 ? "Publication" : "Publications"}
                </p>
              </div>
            )}
            {user.videoCount > 0 && (
              <div className="flex-1 space-y-0.5">
                <p className="text-lg font-semibold">{user.videoCount}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Video className="size-3" />
                  {user.videoCount === 1 ? "Video" : "Videos"}
                </p>
              </div>
            )}
            {user.projectCount > 0 && (
              <div className="flex-1 space-y-0.5">
                <p className="text-lg font-semibold">{user.projectCount}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Briefcase className="size-3" />
                  {user.projectCount === 1 ? "Project" : "Projects"}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Researcher profile ── */}
      {researcher && (
        <>
          <Separator />
          <div className="space-y-4">
            {researcher.title && (
              <div className="space-y-1">
                <SectionHeading icon={GraduationCap}>Title</SectionHeading>
                <p className="text-sm">{researcher.title}</p>
              </div>
            )}

            {researcher.bio && (
              <div className="space-y-1">
                <SectionHeading icon={Icons.user}>Bio</SectionHeading>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {researcher.bio}
                </p>
              </div>
            )}

            {researcher.expertise.length > 0 && (
              <div className="space-y-1.5">
                <SectionHeading icon={Icons.sparkles}>Expertise</SectionHeading>
                <TagList items={researcher.expertise} />
              </div>
            )}

            {researcher.education.length > 0 && (
              <div className="space-y-1.5">
                <SectionHeading icon={Icons.graduationCap}>
                  Education
                </SectionHeading>
                <BordedList items={researcher.education} />
              </div>
            )}

            {researcher.areas.length > 0 && (
              <div className="space-y-1.5">
                <SectionHeading icon={Icons.research}>
                  Research Areas
                </SectionHeading>
                <div className="flex flex-wrap gap-1.5">
                  {researcher.areas.map((area) => (
                    <Badge
                      key={area.id}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {area.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(researcher.orcid || researcher.x) && (
              <div className="space-y-1.5">
                <SectionHeading icon={Link2}>Links</SectionHeading>
                <div className="space-y-1">
                  {researcher.orcid && (
                    <a
                      href={`https://orcid.org/${researcher.orcid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-brand hover:underline"
                    >
                      <Icons.orcid className="size-3" />
                      {researcher.orcid}
                    </a>
                  )}
                  {researcher.x && (
                    <a
                      href={`https://x.com/${researcher.x.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-brand hover:underline"
                    >
                      <Icons.x className="size-3" />@
                      {researcher.x.replace("@", "")}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Account metadata ── */}
      <Separator />
      <div className="space-y-1">
        <SectionHeading icon={Icons.calendar}>Member since</SectionHeading>
        <p className="text-xs text-muted-foreground">
          {formatDate(profile.user.createdAt, "PPP")}
        </p>
      </div>

      {/* ── Admin: change password ── */}
      <Separator />
      <Collapsible open={passwordOpen} onOpenChange={setPasswordOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between text-xs"
          >
            <span className="flex items-center gap-1.5">
              <KeyRound className="size-3.5" />
              Change password
            </span>
            <Icons.chevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                passwordOpen && "rotate-180",
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <AdminChangePassword
            targetUserId={user.id}
            targetUserName={user.name}
            onSuccess={() => {
              setPasswordOpen(false);
              onPasswordChanged?.();
            }}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ─── Main drawer component ───────────────────────────────────────────────────

function UserDetails({ user, ...props }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch rich profile on first open
  React.useEffect(() => {
    if (!open || profile) return;

    setLoading(true);
    setError(null);

    getUserProfileById(user.id)
      .then((data) => {
        if (!data) setError("User profile not found.");
        else setProfile(data);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [open, user.id, profile]);

  // Reset when a different user is opened
  React.useEffect(() => {
    setProfile(null);
    setError(null);
  }, [user.id]);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
      {...props}
    >
      <DrawerTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-xs px-2 font-normal"
        >
          <Eye className="size-4" />
          View Profile
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          !isMobile &&
            "top-0 right-0 left-auto mt-0 h-screen w-[360px] rounded-none",
        )}
      >
        <DrawerHeader className="text-left pb-2">
          {/* Banner image if available */}
          {user.image && (
            <div className="relative w-full h-24 -mx-0 mb-2 overflow-hidden rounded-md">
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
            </div>
          )}
          <DrawerTitle className="truncate">{user.name}</DrawerTitle>
          <DrawerDescription className="text-xs truncate">
            {user.email} · Joined {formatDate(user.createdAt, "MMM yyyy")}
          </DrawerDescription>
        </DrawerHeader>

        {loading && <ProfileSkeleton />}

        {error && !loading && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        )}

        {profile && !loading && (
          <ProfileBody
            profile={profile}
            user={user}
            onPasswordChanged={() => setOpen(false)}
          />
        )}

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export { UserDetails };

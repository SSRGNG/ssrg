"use client";

import { formatDate } from "date-fns";
import { KeyRound } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { AdminChangePassword } from "@/components/forms/admin-change-password";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import type { AdminUsers } from "@/lib/actions/queries";

type UserType = AdminUsers[number];
type Props = React.ComponentProps<typeof Drawer> & { user: UserType };

// ─── Main drawer component ───────────────────────────────────────────────────

function ChangePassword({ user, ...props }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

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
          <KeyRound className="size-4" />
          Change Password
        </Button>
      </DrawerTrigger>

      <DrawerContent
      // className={cn(
      //   !isMobile &&
      //     "top-0 right-0 left-auto mt-0 h-screen w-[360px] rounded-none",
      // )}
      >
        <DrawerHeader className="text-left">
          {/* Banner image if available */}
          {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              height={800}
              width={450}
              className="h-full w-full rounded-lg object-cover object-center aspect-[24/9]"
              loading="lazy"
            />
          )}
          <DrawerTitle className="flex items-center gap-2.5 truncate">
            {user.name}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            {user.email} · Joined {formatDate(user.createdAt, "MMM yyyy")}
          </DrawerDescription>
        </DrawerHeader>

        <AdminChangePassword
          className="px-4"
          targetUserId={user.id}
          // targetUserName={user.name}
          onSuccess={() => {
            setOpen(false);
          }}
        />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export { ChangePassword };

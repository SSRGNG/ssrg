import type { Metadata } from "next";

import { UpdateAuthorProfile } from "@/components/forms/update-author-profile";
import { UpdateResearcherProfile } from "@/components/forms/update-researcher-profile";
import { UpdateUser } from "@/components/forms/update-user";
import { Icons } from "@/components/shared/icons";
import { Page } from "@/components/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@/components/views/portal/profile";
import { getUserProfiles } from "@/lib/queries/user";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `User Profile`,
};

type IconType = keyof typeof Icons;

export default async function ProfilePage() {
  const userProfiles = await getUserProfiles();
  const userRole = userProfiles.user.role;
  const user = {
    userId: userProfiles.user.id,
    name: userProfiles.user.name,
    image: userProfiles.user.image,
    affiliation: userProfiles.user.affiliation,
  };
  const author = userProfiles.author;
  const researcher = userProfiles.researcher;

  console.log({ researcher });

  const availableTabs = [
    {
      id: "User",
      label: "User Profile",
      icon: "user" as IconType,
      available: true,
    },
    {
      id: "Researcher",
      label: "Researcher Profile",
      icon: "graduationCap" as IconType,
      available: !!userProfiles.researcher,
    },
    {
      id: "Author",
      label: "Author Profile",
      icon: "award" as IconType,
      available: !!userProfiles.author,
    },
    {
      id: "Partner",
      label: "Partner Profile",
      icon: "partners" as IconType,
      available: userRole === "partner",
    },
  ].filter((tab) => tab.available);

  return (
    <Page variant={"portal"} className={cn("space-y-4")}>
      <Profile profiles={userProfiles} />
      <Tabs defaultValue={availableTabs[0].id}>
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          {availableTabs.map((tab) => {
            const Icon = Icons[tab.icon];
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="group">
                <Icon strokeWidth={1.5} />
                <span className="hidden group-data-[state=active]:inline md:inline">
                  {tab.id}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value={availableTabs[0].id} className="space-y-4">
          <UpdateUser user={user} />
        </TabsContent>
        {availableTabs.some((tab) => tab.id === "Researcher") && (
          <TabsContent value="Researcher" className="space-y-4">
            <UpdateResearcherProfile researcher={researcher} />
          </TabsContent>
        )}

        {availableTabs.some((tab) => tab.id === "Author") && (
          <TabsContent value="Author" className="space-y-4">
            <UpdateAuthorProfile author={author} />
          </TabsContent>
        )}
      </Tabs>
    </Page>
  );
}

import type { Metadata } from "next";

import { Icons } from "@/components/shared/icons";
import { Shell } from "@/components/shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AwardMedia } from "@/components/views/admin/scholarshops/award-media";
import { Recipients } from "@/components/views/admin/scholarshops/recipients";
import { ScholarAwards } from "@/components/views/admin/scholarshops/scholar-awards";
import {
  getAwardMedia,
  getEvents,
  getRecipients,
  getScholarships,
} from "@/lib/queries/scholarships";

export const metadata: Metadata = {
  title: `Scholarships & Awards`,
  description: "Manage scholarships, recipients, and award ceremonies",
};

const available_tabs = [
  { id: "scholarship", label: "Scholarship", icon: "award" as Icons },
  { id: "recipients", label: "Recipients", icon: "people" as Icons },
  { id: "media", label: "Media", icon: "media" as Icons },
];

export default async function ScholarshipsAwards() {
  const scholarships = await getScholarships();
  const recipients = await getRecipients();
  const media = await getAwardMedia();
  const events = await getEvents();

  const table_data = {
    scholarships: scholarships.map((scholarship) => ({
      id: scholarship.id,
      title: scholarship.title,
    })),
    recipients: recipients.map((recipient) => ({
      id: recipient.id,
      name: recipient.name,
    })),
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
    })),
  };

  // console.log({ table_data });
  // console.log({ scholarships });
  // console.log({ recipients });
  // console.log({ media });
  // console.log({ events });

  return (
    <Shell variant={"portal"}>
      <Tabs defaultValue={available_tabs[0].id}>
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          {available_tabs.map((tab) => {
            const Icon = Icons[tab.icon];
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="group">
                <Icon strokeWidth={1.5} />
                <span className="hidden group-data-[state=active]:inline md:inline">
                  {tab.label}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScholarAwards
          scholarships={scholarships}
          value={available_tabs[0].id}
        />
        <Recipients
          recipients={recipients}
          t_data={table_data}
          value={available_tabs[1].id}
        />
        <AwardMedia
          media={media}
          t_data={table_data}
          value={available_tabs[2].id}
        />
      </Tabs>
    </Shell>
  );
}

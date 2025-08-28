import {
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Globe,
  Users,
} from "lucide-react";

import { Section } from "@/components/shell/section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { scholarships as scholarshipTypes } from "@/config/enums";
import { AllScholarships } from "@/lib/actions/queries";
import { getScholarships } from "@/lib/queries/scholarships";
import { cn, formatDate } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

const typeIcons = {
  tuition: BookOpen,
  research_grant: Globe,
  other: Globe,
  presentation_award: Award,
  conference_fee_waiver: BookOpen,
};

// const scholarships = [
//   {
//     id: "f1680a64-9915-4a72-8319-3e06b7eb3c9b",
//     title: "2026 SSRG Tuition Scholarship",
//     description:
//       "Full Tuition for outstanding students at SSRG partner universities.",
//     type: "tuition" as const,
//     category: "student" as const,
//     eligibility: "Must have completed at least one session with a GPA ≥ 4.5",
//     amount: "Full Tuition",
//     deadline: new Date("2025-12-30T23:00:00.000Z"),
//     applicationLink: "https://docs.google.com",
//     active: true,
//     recurring: false,
//     maxRecipients: 5,
//     created_at: new Date("2025-08-27T12:52:50.317Z"),
//     updated_at: new Date("2025-08-27T12:52:50.317Z"),
//     recipients: [
//       {
//         id: "e716a0fe-e4c2-4f82-a443-a50035dfe8ba",
//         scholarshipId: "f1680a64-9915-4a72-8319-3e06b7eb3c9b",
//         name: "Richard Dallington",
//         affiliation: "Department of SW, UNN",
//         year: 2026,
//         amount: "₦550,000",
//         notes:
//           "The recipient received money instead because of tuition waiver.",
//         created_at: new Date("2025-08-27T20:07:32.467Z"),
//         updated_at: new Date("2025-08-27T20:07:32.467Z"),
//         media: [
//           {
//             id: "a57035d0-b87d-4fed-8860-a22bc29b8319",
//             scholarshipId: "f1680a64-9915-4a72-8319-3e06b7eb3c9b",
//             recipientId: "e716a0fe-e4c2-4f82-a443-a50035dfe8ba",
//             eventId: null,
//             fileId: "5ee9066f-5e8a-4d68-9f24-a2a998a306ca",
//             caption: "Congratulations to Richard on his award!",
//             isPublic: true,
//             sortOrder: 0,
//             created_at: new Date("2025-08-27T20:11:14.174Z"),
//             updated_at: new Date("2025-08-27T20:11:14.174Z"),
//           },
//         ],
//       },
//       {
//         id: "e716a0fe-e4c2-4f82-a443-a50035df44ba",
//         scholarshipId: "f1680a64-9915-4a72-8319-3e06b7eb3c9b",
//         name: "Dell Latitude",
//         affiliation: "Department of SW, UNN",
//         year: 2026,
//         amount: "₦550,000",
//         notes:
//           "The recipient received money instead because of tuition waiver.",
//         created_at: new Date("2025-08-27T20:07:32.467Z"),
//         updated_at: new Date("2025-08-27T20:07:32.467Z"),
//         media: [
//           {
//             id: "a57035d0-b87d-4fed-8860-a22bc29b8319",
//             scholarshipId: "f1680a64-9915-4a72-8319-3e06b7eb3c9b",
//             recipientId: "e716a0fe-e4c2-4f82-a443-a50035df44ba",
//             eventId: null,
//             fileId: "5ee9066f-5e8a-4d68-9f24-a2a998a306ca",
//             caption: "Congratulations to Richard on his award!",
//             isPublic: true,
//             sortOrder: 0,
//             created_at: new Date("2025-08-27T20:11:14.174Z"),
//             updated_at: new Date("2025-08-27T20:11:14.174Z"),
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "sch2",
//     title: "2026 SSRG Research Grant",
//     description: "Funding support for student-led research projects.",
//     type: "research_grant" as const,
//     category: "researcher" as const,
//     eligibility: "Open to postgraduate students with an approved proposal.",
//     amount: "₦300,000",
//     deadline: new Date("2025-11-15T23:00:00.000Z"),
//     applicationLink: "https://docs.google.com/forms/research-grant",
//     active: true,
//     recurring: true,
//     maxRecipients: 10,
//     created_at: new Date("2025-08-25T10:20:00.000Z"),
//     updated_at: new Date("2025-08-25T10:20:00.000Z"),
//     recipients: [
//       {
//         id: "rec2",
//         scholarshipId: "sch2",
//         name: "Chiamaka Okoro",
//         affiliation: "Dept. of Public Health, UNILAG",
//         year: 2026,
//         amount: "₦300,000",
//         notes: "Awarded for outstanding community health project.",
//         created_at: new Date("2025-08-26T10:00:00.000Z"),
//         updated_at: new Date("2025-08-26T10:00:00.000Z"),
//         media: [],
//       },
//     ],
//   },
//   {
//     id: "sch3",
//     title: "Women in STEM Scholarship",
//     description: "Partial tuition support for female students in STEM fields.",
//     type: "tuition" as const,
//     category: "student" as const,
//     eligibility: "Open to female undergraduates in STEM with GPA ≥ 4.0.",
//     amount: "₦250,000",
//     deadline: new Date("2025-10-01T23:00:00.000Z"),
//     applicationLink: "https://docs.google.com/forms/women-stem",
//     active: true,
//     recurring: true,
//     maxRecipients: 15,
//     created_at: new Date("2025-07-10T12:00:00.000Z"),
//     updated_at: new Date("2025-07-10T12:00:00.000Z"),
//     recipients: [],
//   },
//   {
//     id: "sch4",
//     title: "Community Leadership Award",
//     description:
//       "Cash award recognizing student leadership in local communities.",
//     type: "presentation_award" as const,
//     category: "student" as const,
//     eligibility: "Students demonstrating leadership in community initiatives.",
//     amount: "₦150,000",
//     deadline: new Date("2025-09-20T23:00:00.000Z"),
//     applicationLink: "https://docs.google.com/forms/community-leadership",
//     active: false,
//     recurring: false,
//     maxRecipients: 3,
//     created_at: new Date("2025-06-15T09:30:00.000Z"),
//     updated_at: new Date("2025-06-15T09:30:00.000Z"),
//     recipients: [
//       {
//         id: "rec3",
//         scholarshipId: "sch4",
//         name: "Ifeanyi Nwosu",
//         affiliation: "Dept. of Political Science, UNIBEN",
//         year: 2025,
//         amount: "₦150,000",
//         notes: "Recognized for outstanding grassroots work.",
//         created_at: new Date("2025-08-01T10:00:00.000Z"),
//         updated_at: new Date("2025-08-01T10:00:00.000Z"),
//         media: [],
//       },
//     ],
//   },
//   {
//     id: "sch5",
//     title: "International Conference Travel Grant",
//     description:
//       "Support for students presenting research at international conferences.",
//     type: "research_grant" as const,
//     category: "researcher" as const,
//     eligibility: "Applicants must have accepted conference papers abroad.",
//     amount: "₦400,000",
//     deadline: new Date("2025-12-01T23:00:00.000Z"),
//     applicationLink: "https://docs.google.com/forms/conference-travel",
//     active: true,
//     recurring: false,
//     maxRecipients: 7,
//     created_at: new Date("2025-08-18T11:00:00.000Z"),
//     updated_at: new Date("2025-08-18T11:00:00.000Z"),
//     recipients: [],
//   },
// ];
async function Opportunities({ className, ...props }: Props) {
  const scholarships = await getScholarships();

  // console.log({ scholarships });
  if (scholarships.length === 0) return null;
  return (
    <Section
      spacing={"snug"}
      header={{ title: "Opportunities" }}
      className={cn(className)}
      {...props}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.map((scholarship, i) => (
          <ScholarshipCard key={i} scholarship={scholarship} />
        ))}
      </div>
    </Section>
  );
}

function ScholarshipCard({
  scholarship,
}: {
  scholarship: AllScholarships[number];
}) {
  const deadline =
    scholarship.deadline !== null ? scholarship.deadline : new Date();
  const isClosed = !scholarship.active || new Date() > deadline;

  const IconComponent = typeIcons[scholarship.type] || Award;

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-medium line-clamp-2">
          {scholarship.title}
        </CardTitle>
        <CardDescription className="flex items-center flex-wrap gap-2">
          <Badge
            variant={
              ["tuition", "research_grant", "conference_fee_waiver"].includes(
                scholarship.type
              )
                ? "brand"
                : scholarship.type === "presentation_award"
                ? "default"
                : "secondary"
            }
          >
            {scholarshipTypes.getLabel(scholarship.type)}
          </Badge>
          <span className="text-muted-foreground/50" aria-hidden="true">
            •
          </span>
          {isClosed ? (
            <Badge variant={"destructive"}>Inactive</Badge>
          ) : (
            <Badge>Active</Badge>
          )}
        </CardDescription>
        <CardAction>
          <IconComponent />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <CardDescription>{scholarship.description}</CardDescription>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Award className="size-4 text-muted-foreground" />
            <span>{scholarship.amount}</span>
          </div>
          {scholarship.deadline !== null && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Deadline: {formatDate(scholarship.deadline)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="size-4 text-muted-foreground" />
            <span>
              {scholarship.recipients.length} / {scholarship.maxRecipients}{" "}
              recipients
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-background text-foreground text-sm p-4 space-2.5">
          <p className="font-medium">Eligibility:</p>
          <p className="text-muted-foreground">{scholarship.eligibility}</p>
        </div>

        {scholarship.recipients.length > 0 && (
          <div className="space-y-2.5">
            <p className="font-medium">Recent Recipients:</p>
            <div className="rounded-xl bg-background text-foreground text-sm p-4 space-y-1.5">
              {scholarship.recipients.slice(0, 2).map((recipient, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{recipient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {recipient.affiliation}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {recipient.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {scholarship.applicationLink && (
        <CardFooter className="mt-auto">
          <a
            href={isClosed ? undefined : scholarship.applicationLink}
            target={isClosed ? undefined : "_blank"}
            rel={isClosed ? undefined : "noopener noreferrer"}
            className={cn(
              buttonVariants({
                className: "w-full",
                variant: isClosed ? "secondary" : "default",
              }),
              isClosed && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            aria-disabled={isClosed}
          >
            {isClosed ? "Application Closed" : "Apply Now"}
            {!isClosed && <ExternalLink className="size-4" />}
          </a>
        </CardFooter>
      )}
    </Card>
  );
}

export { Opportunities };

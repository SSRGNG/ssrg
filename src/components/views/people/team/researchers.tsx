import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResearchersWithRelations } from "@/lib/actions/queries";
import { getCachedResearchers } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function Researchers({ className, ...props }: Props) {
  const researchers = await getCachedResearchers();
  if (!researchers.length) return null;
  return (
    <Section
      spacing={"snug"}
      className={cn("grid md:grid-cols-2 gap-4", className)}
      {...props}
    >
      {researchers.map((researcher, idx) => (
        <ResearcherCard key={idx} researcher={researcher} idx={idx} />
      ))}
    </Section>
  );
}

function ResearcherCard({
  researcher,
  idx,
}: {
  researcher: ResearchersWithRelations[number];
  idx: number;
}) {
  return (
    <Card
      className={cn(
        "group gap-0 py-0 sm:py-0 overflow-hidden shadow-none h-full",
        idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
        {researcher.user.image ? (
          <Image
            src={researcher.user.image}
            alt={`Image of ${researcher.user.name}`}
            height={800}
            width={450}
            className="h-full w-full object-cover aspect-[24/9] transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full aspect-[24/9] md:aspect-auto md:h-full relative bg-muted">
            <Icons.placeholder
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full text-light/20 transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5 py-4 sm:py-6 md:w-2/3 leading-none">
        <div className="space-y-0.5">
          <CardTitle>{researcher.user.name}</CardTitle>
          <CardDescription>{researcher.title}</CardDescription>
        </div>
        <p className="line-clamp-3">{researcher.bio}</p>

        <div className="flex flex-wrap gap-1.5 items-center">
          {researcher.expertise.slice(0, 3).map((skill) => (
            <span
              key={skill.expertise}
              className="bg-brand/20 text-brand text-xs px-2 py-0.5 rounded"
            >
              {skill.expertise}
            </span>
          ))}
        </div>

        <div className="flex mt-auto justify-between items-center gap-2">
          <div className="flex gap-2">
            <a
              href={`mailto:${researcher.user.email}`}
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "outline",
                  className: "rounded-sm size-8",
                })
              )}
              aria-label={`Email ${researcher.user.name}`}
            >
              <Icons.connect className="size-3" strokeWidth={1.5} />
            </a>
            <a
              href={`/publications?researcher=${researcher.user.slug}`}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "secondary",
                  className: "rounded-sm text-xs",
                })
              )}
              aria-label="Researcher's publications"
            >
              <Icons.caseStudy className="size-3" strokeWidth={1.5} />{" "}
              Publications
            </a>
          </div>
          <Link
            href={`/people/team/${researcher.user.slug}`}
            className={cn(
              buttonVariants({
                variant: "link",
                className: "flex w-fit h-fit text-brand p-0 text-xs",
              })
            )}
          >
            Profile →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
export { Researchers };

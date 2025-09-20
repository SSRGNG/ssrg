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
import { researchers } from "@/config/constants";
import { cn } from "@/lib/utils";
import type { Researcher } from "@/types";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Featured({ className, ...props }: Props) {
  const featured = researchers.filter(
    (researcher) => researcher.featured === true
  );

  if (!featured.length) return null;
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{ title: "Featured Researchers" }}
      {...props}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {featured.map((researcher, idx) => (
          <FeaturedResearcherCard key={idx} researcher={researcher} idx={idx} />
        ))}
      </div>
    </Section>
  );
}

function FeaturedResearcherCard({
  researcher,
  idx,
}: {
  researcher: Researcher;
  idx: number;
}) {
  return (
    <Card
      className={cn(
        "group not-last-of-type:gap-0 py-0 sm:py-0 overflow-hidden",
        idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
        <Image
          src={researcher.image}
          alt={`Image of ${researcher.name}`}
          height={800}
          width={450}
          className="h-full w-full object-cover aspect-[24/9] transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </CardHeader>

      <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-2/3 leading-none">
        <div className="space-y-0.5">
          <CardTitle>{researcher.name}</CardTitle>
          <CardDescription>{researcher.title}</CardDescription>
        </div>
        <p className="line-clamp-3">{researcher.bio}</p>

        <div className="flex flex-wrap gap-1.5 items-center">
          {researcher.expertise.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="bg-brand/20 text-brand text-xs px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <a
              href={`mailto:${researcher.contact.email}`}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "secondary",
                  className: "rounded-sm",
                })
              )}
              aria-label={`Email ${researcher.name}`}
            >
              <Icons.connect className="size-3" strokeWidth={1.5} /> Contact
            </a>
            <a
              href={`/publications?researcher=${researcher.id}`}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "secondary",
                  className: "rounded-sm",
                })
              )}
              aria-label={`${researcher.name}'s Twitter`}
            >
              <Icons.caseStudy className="size-3" strokeWidth={1.5} />{" "}
              Publications
            </a>
          </div>
          <Link
            href={`/people/team/${researcher.id}`}
            className={cn(
              buttonVariants({
                variant: "link",
                className: "flex w-fit h-fit text-brand p-0",
              })
            )}
          >
            Full Profile →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
export { Featured };

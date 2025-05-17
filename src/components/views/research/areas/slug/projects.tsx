import Image from "next/image";
import Link from "next/link";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects } from "@/config/constants";
import { ResearchAreasData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type RAreaType = ResearchAreasData[number];
type Props = React.ComponentPropsWithoutRef<typeof Section> & {
  area: RAreaType | undefined;
};

function Projects({ area, className, ...props }: Props) {
  if (!area) return null;
  return (
    <Section
      spacing={"snug"}
      header={{ title: "Current Projects" }}
      className={cn(className)}
      {...props}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {projects
          .filter((project) => project.category.includes(area.title))
          .slice(0, 2) // show 2 projects per area
          .map((project, i) => (
            <ProjectCard key={i} article={project} i={i} />
          ))}
      </div>
      <Link
        arial-label="View all projects in community development"
        href={"/research/projects?area=community-development"}
        className={cn(
          buttonVariants({
            variant: "link",
            className: "flex w-fit h-fit mx-auto text-brand",
          })
        )}
      >
        View all projects in this area →
      </Link>
    </Section>
  );
}

type ProjectArticle = (typeof projects)[number];

function ProjectCard({ article, i }: { article: ProjectArticle; i: number }) {
  return (
    <Card
      className={cn(
        "gap-0 py-0 sm:py-0 overflow-hidden",
        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
        <Image
          src={article.image}
          alt={`Project image for ${article.title}`}
          height={800}
          width={450}
          className="h-full w-full object-cover aspect-[24/9]"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-2/3 leading-none">
        <div className="flex flex-wrap gap-1.5 items-center">
          {article.category.map((cat, i) => (
            <span
              key={i}
              className="bg-brand/20 text-brand text-xs px-2 py-0.5 rounded"
            >
              {cat}
            </span>
          ))}
          <span className="text-muted-foreground text-sm">
            {article.period}
          </span>
        </div>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {article.description}
        </CardDescription>
        <div className="inline-flex items-center gap-3">
          <UserAvatar
            inline
            className="size-12 rounded-full"
            user={{ email: article.location, ...article.lead }}
          />
        </div>
        <Link
          href={article.href}
          className={cn(
            buttonVariants({
              variant: "link",
              className: "flex w-fit h-fit text-brand p-0",
            })
          )}
        >
          View project details →
        </Link>
      </CardContent>
    </Card>
  );
}

export { Projects };

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects, research_areas } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function ResearchAreasWithProjects({ className, ...props }: Props) {
  return (
    <Section
      spacing="snug"
      className={cn(className)}
      header={{ title: "Primary Research Areas" }}
      {...props}
    >
      <Tabs defaultValue={research_areas[0].title}>
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          {research_areas.map((area) => (
            <TabsTrigger key={area.title} value={area.title} className="group">
              <area.icon strokeWidth={1.5} />
              <span className="hidden group-data-[state=active]:inline md:inline">
                {area.title}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {research_areas.map((area) => (
          <TabsContent
            key={area.title}
            value={area.title}
            className="space-y-4"
          >
            <Card
              className={cn(
                "gap-0 py-0 overflow-hidden md:flex-row"
                // index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              <CardHeader className="px-0 md:w-2/5 grid-rows-[auto]">
                <Image
                  src={area.image}
                  alt={`Image for ${area.title}`}
                  height={800}
                  width={450}
                  className="h-full w-full object-cover aspect-[24/9]"
                  loading="lazy"
                />
              </CardHeader>
              <CardContent className="space-y-2.5 pt-4 md:pt-6 pb-6 md:w-3/5">
                <CardTitle className="flex items-center gap-2.5">
                  <area.icon className="text-brand" strokeWidth={1.5} />
                  {area.title}
                </CardTitle>
                <p>{area.detail}</p>
                <h4>Key Research Questions:</h4>
                <ul className="space-y-1 pl-[1.125rem] pb-2.5 list-disc">
                  {area.questions.map((q, i) => (
                    <li className="text-sm text-muted-foreground" key={i}>
                      {q}
                    </li>
                  ))}
                </ul>
                <Link
                  href={area.href}
                  className={buttonVariants({
                    variant: "brand",
                    className: "whitespace-normal h-fit",
                  })}
                >
                  {area.linkText}
                </Link>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {projects
                .filter((project) => project.category.includes(area.title))
                .slice(0, 2) // show 2 projects per area
                .map((project, i) => (
                  <ProjectCard key={i} article={project} i={i} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}

type ProjectArticle = (typeof projects)[number];

function ProjectCard({ article, i }: { article: ProjectArticle; i: number }) {
  return (
    <Card
      className={cn(
        "gap-0 py-0 overflow-hidden",
        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <CardHeader className="px-0 md:w-2/5 grid-rows-[auto]">
        <Image
          src={article.image}
          alt={`Project image for ${article.title}`}
          height={800}
          width={450}
          className="h-full w-full object-cover aspect-[24/9]"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4 md:pt-6 pb-6 md:w-2/3 leading-none">
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
        {/* <div className="flex flex-wrap gap-1.5 items-center text-sm">
          {article.category.map((cat, i) => (
            <span
              key={i}
              className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs font-medium"
            >
              {cat}
            </span>
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {article.period}
          </span>
        </div> */}
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

export { ResearchAreasWithProjects };

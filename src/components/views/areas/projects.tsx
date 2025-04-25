import { ListTree } from "lucide-react";
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

function Projects({ className, ...props }: Props) {
  const tabs = [
    { value: "all", label: "All Projects", icon: ListTree },
    ...research_areas.map((area) => ({
      value: area.title,
      label: area.title,
      icon: area.icon,
    })),
  ];

  return (
    <Section
      padding={"medium"}
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Current Projects",
        description:
          "Our ongoing research initiatives address critical social challenges through collaborative, methodologically rigorous approaches.",
      }}
      {...props}
    >
      <Tabs defaultValue="all">
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          {tabs.map((area) => (
            <TabsTrigger key={area.value} value={area.value} className="group">
              <area.icon strokeWidth={1.5} />
              <span className="hidden group-data-[state=active]:inline md:inline">
                {area.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {["all", ...research_areas.map((a) => a.title)].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid md:grid-cols-2 gap-4">
              {projects
                .filter(
                  (project) => tab === "all" || project.category.includes(tab)
                )
                .map((project, i) => (
                  <ProjectArticleCard key={i} article={project} i={i} />
                ))}
            </div>
          </TabsContent>
        ))}
        {/* <TabsContent value="all">All Projects</TabsContent>
        {research_areas.map((area) => (
          <TabsContent key={area.title} value={area.title}>
            {area.title}
          </TabsContent>
        ))} */}
      </Tabs>
      <Link
        href="/projects"
        className={cn(
          buttonVariants({
            // variant: "brand",
            className: "flex w-fit mx-auto",
          })
        )}
      >
        View All Projects
      </Link>
    </Section>
  );
}

type ProjectArticle = (typeof projects)[number];

function ProjectArticleCard({
  article,
  i,
}: {
  article: ProjectArticle;
  i: number;
}) {
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
          className="h-full w-full object-cover aspect-[24/9] "
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4 md:pt-6 pb-6 md:w-2/3 leading-none">
        <div className="flex flex-wrap gap-1.5 items-center">
          {article.category.map((cat, i) => (
            <span
              key={i}
              className="inline-block bg-brand/20 text-brand text-xs px-2 py-1 rounded"
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

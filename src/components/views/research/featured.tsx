import { LinkIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;
type FeaturedArticle = (typeof projects)[number];

function Featured({ className, ...props }: Props) {
  const featured = projects.slice(0, 2);

  if (!featured.length) return null;
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{ title: "Featured Projects" }}
      {...props}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {featured.map((article, i) => (
          <FeaturedArticleCard key={i} article={article} i={i} />
        ))}
      </div>
      <Link
        arial-label="View all projects"
        href={"/research/projects"}
        className={cn(
          buttonVariants({
            variant: "link",
            className: "flex w-fit h-fit mx-auto text-brand",
          })
        )}
      >
        View all projects →
      </Link>
    </Section>
  );
}

function FeaturedArticleCard({
  article,
  i,
}: {
  article: FeaturedArticle;
  i: number;
}) {
  return (
    <Link
      href={article.href}
      target="_blank"
      rel="noreferrer"
      className={cn("grid")}
    >
      <Card
        className={cn(
          "group gap-0 py-0 sm:py-0 overflow-hidden relative",
          i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        )}
      >
        <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
          <Image
            src={article.image}
            alt={`Featured image for ${article.title}`}
            height={800}
            width={450}
            className="h-full w-full object-cover aspect-[24/9] transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </CardHeader>
        <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-2/3 leading-none">
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
            <LinkIcon
              className={cn(
                "size-3 text-brand absolute top-4",
                i % 2 === 0 ? "left-4" : "right-4"
              )}
            />
          </div>

          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {article.description}
          </CardDescription>
          <div className="inline-flex items-center gap-3">
            <UserAvatar
              inline
              className="size-12 rounded-full"
              user={{ email: "Lead Researcher", ...article.lead }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
export { Featured };

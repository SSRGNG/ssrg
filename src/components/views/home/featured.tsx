import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Section } from "@/components/shell/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;
type FeaturedArticle = {
  image?: string;
  area: string;
  title: string;
  abstract: string;
  href: string;
  lead: { image: string; name: string };
};

const featuredArticles: FeaturedArticle[] = [
  {
    image: "/images/research/communities.webp",
    area: "Policy Research",
    title:
      "Building Resilient Communities: A Framework for Participatory Development",
    abstract:
      "This comprehensive study examines how community-led development initiatives can create sustainable social change through participatory methods that empower local stakeholders.",
    href: "/publications/resilient-communities",
    lead: { image: "/images/researcher/kwame.webp", name: "Dr. Kwame Adisa" },
  },
  {
    image: "/images/research/collaborating.webp",
    area: "Climate Science",
    title: "Climate Adaptation Strategies in Coastal Communities",
    abstract:
      "A groundbreaking analysis of how vulnerable coastal regions are implementing innovative adaptation measures to address rising sea levels and extreme weather events.",
    href: "/publications/climate-adaptation",
    lead: { image: "/images/researcher/emily.webp", name: "Dr. Emily Chen" },
  },
  {
    // image: "/images/research/collaborating.webp",
    area: "Education",
    title: "Digital Literacy and Educational Outcomes in Rural Areas",
    abstract:
      "This study investigates the impact of digital literacy programs on educational outcomes and career readiness in underserved rural communities.",
    href: "/publications/digital-literacy",
    lead: {
      image: "/images/researcher/james.webp",
      name: "Dr. James Rodriguez",
    },
  },
];

function Featured({ className, ...props }: Props) {
  const featured = featuredArticles
    .filter((article): article is FeaturedArticle & { image: string } =>
      Boolean(article.image)
    )
    .slice(0, 2);

  if (!featured.length) return null;
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{ title: "Featured Research" }}
      {...props}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {featured.map((article, index) => (
          <FeaturedArticleCard key={index} article={article} i={index} />
        ))}
      </div>
    </Section>
  );
}

function FeaturedArticleCard({
  article,
  i,
}: {
  article: FeaturedArticle & { image: string };
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
          "gap-0 py-0 sm:py-0 overflow-hidden relative",
          i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        )}
      >
        <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
          <Image
            src={article.image}
            alt={`Featured image for ${article.title}`}
            height={800}
            width={450}
            className="h-full w-full object-cover aspect-[24/9] "
            loading="lazy"
          />
        </CardHeader>
        <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-2/3 leading-none">
          <div className="uppercase text-brand text-sm font-semibold tracking-wide flex gap-1.5 items-center justify-between">
            {article.area}
            <LinkIcon
              className={cn(
                "size-3 absolute top-4",
                i % 2 === 0 ? "left-4" : "right-4"
              )}
            />
          </div>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {article.abstract}
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

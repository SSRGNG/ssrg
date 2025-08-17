import { ExternalLink, Search, Star } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { Page } from "@/components/shell";
import { Section } from "@/components/shell/section";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getResearcherWithSlug } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const researcher = await getResearcherWithSlug(slug);

  return {
    title: researcher.name || (await parent).title,
    description: researcher.researcher.bio || (await parent).description,
  };
}

export default async function ResearcherDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const researcher = await getResearcherWithSlug(slug);

  return (
    <Page variant={"public"}>
      {/* Hero Section */}
      <Section
        // padding="hero"
        // spacing="tight"
        // alignment="center"
        size="small"
        className="flex flex-col xs:flex-row xs:items-center xs:justify-center gap-4"
      >
        {researcher.image ? (
          <Avatar className="h-56 w-full xs:w-44 md:w-52 rounded-lg">
            <AvatarImage
              className="object-cover"
              src={researcher.image}
              alt={researcher.name}
            />
          </Avatar>
        ) : (
          <div className="h-56 w-full xs:w-44 md:w-52 relative bg-muted rounded-lg overflow-hidden">
            <Icons.placeholder
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full text-muted-foreground/30"
            />
          </div>
        )}

        {/* Main Info */}
        <div className="space-y-4">
          <header className="space-y-1.5">
            <div className="flex flex-wrap gap-1">
              <h1 className="text-2xl font-bold">{researcher.name}</h1>
              {researcher.researcher.featured && (
                <Badge variant="secondary" className="w-fit">
                  <Star className="w-3 h-3" />
                  Featured Researcher
                </Badge>
              )}
            </div>

            {researcher.researcher.title && (
              <p className="text-muted-foreground">
                {researcher.researcher.title}
              </p>
            )}

            {/* Contact & Links */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <a
                href={`mailto:${researcher.email}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                <Icons.connect className="w-4 h-4" />
                Contact
              </a>

              {researcher.researcher.orcid && (
                <a
                  href={`https://orcid.org/${researcher.researcher.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  ORCID
                </a>
              )}

              {researcher.researcher.x && (
                <a
                  href={`https://x.com/${researcher.researcher.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <Icons.x className="w-4 h-4" />
                </a>
              )}

              {researcher.researcher.author?.publications?.length > 0 && (
                <Link
                  href={`/publications?researcher=${researcher.slug}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "gap-2"
                  )}
                >
                  <Icons.caseStudy className="w-4 h-4" />
                  Publications (
                  {researcher.researcher.author.publications.length})
                </Link>
              )}
            </div>
          </header>

          {/* Expertise Tags */}
          {researcher.researcher.expertise.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {researcher.researcher.expertise
                  .sort((a, b) => a.order - b.order)
                  .map((skill) => (
                    <Badge key={skill.id} variant="brand" className="pb-1.5">
                      {skill.expertise}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Bio Section */}
      {researcher.researcher.bio && (
        <Section>
          <Card className="gap-2.5">
            <CardHeader className="gap-0">
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="w-5 h-5" />
                Biography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {researcher.researcher.bio}
              </p>
            </CardContent>
          </Card>
        </Section>
      )}

      <Section className="grid md:grid-cols-2 gap-4">
        {/* Education Section */}
        {researcher.researcher.education.length > 0 && (
          <Card className="gap-2.5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.graduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {researcher.researcher.education
                .sort((a, b) => a.order - b.order)
                .map((edu, index) => (
                  <div key={edu.id} className="space-y-1">
                    <p className="font-medium">{edu.education}</p>
                    {index < researcher.researcher.education.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Publications */}
        {researcher.researcher.author?.publications?.length > 0 && (
          <Card className="gap-2.5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.caseStudy className="w-5 h-5" />
                Recent Publications
              </CardTitle>
              <CardDescription>
                Showing{" "}
                {Math.min(3, researcher.researcher.author.publications.length)}{" "}
                most recent publications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {researcher.researcher.author.publications
                .slice(0, 3)
                .map((pub, index) => (
                  <div key={pub.publicationId} className="space-y-2">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm leading-snug">
                        {pub.publication.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {pub.publication.publicationDate}
                        {pub.isCorresponding && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Corresponding Author
                          </Badge>
                        )}
                      </p>
                    </div>
                    {index <
                      Math.min(
                        3,
                        researcher.researcher.author.publications.length
                      ) -
                        1 && <Separator />}
                  </div>
                ))}

              {researcher.researcher.author.publications.length > 3 && (
                <div className="pt-2">
                  <Link
                    href={`/publications?researcher=${researcher.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full"
                    )}
                  >
                    View All Publications →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Section>

      {/* Lead Projects Section */}
      {researcher.researcher.leadProjects?.length > 0 && (
        <Section>
          <Card className="gap-2.5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.briefcase className="w-5 h-5" />
                Lead Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {researcher.researcher.leadProjects.map((project, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* Research Areas */}
      {researcher.researcher.areas?.length > 0 && (
        <Section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Research Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {researcher.researcher.areas.map((area) => (
                  <Badge key={area.area.id} variant="outline">
                    {area.area.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* Footer Info */}
      <Section>
        <Card className="">
          <CardContent className="">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Profile ID: {researcher.id.split("-")[0]}...</span>
                {researcher.researcher.orcid && (
                  <span>ORCID: {researcher.researcher.orcid}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span>
                  Last updated:{" "}
                  {new Date(
                    researcher.researcher.updated_at
                  ).toLocaleDateString()}
                </span>
                <span>
                  Member since:{" "}
                  {new Date(
                    researcher.researcher.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </Page>
  );
}

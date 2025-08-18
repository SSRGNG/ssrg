import { ExternalLink, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Section } from "@/components/shell/section";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPartners } from "@/lib/queries/members";
import { cn } from "@/lib/utils";
import { Partner } from "@/types";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function PartnerCards({ className, ...props }: Props) {
  // const partners = examplePartners;
  const partners = await getAllPartners();
  if (partners.length === 0)
    return (
      <small className="text-muted-foreground text-center flex justify-center">
        There are no partners to display yet
      </small>
    );

  const getPartnerTypeLabel = (type: Partner) => {
    const typeLabels: Record<Partner, string> = {
      academic: "Academic",
      government: "Government",
      ngo: "NGO",
      nonprofit: "Not For Profit Org",
      corporate: "Corporate",
      international: "International Org",
    };
    return typeLabels[type] || type;
  };

  const getPartnerTypeColor = (type: Partner) => {
    const colors: Record<Partner, string> = {
      academic: "bg-brand/15 text-brand [a&]:hover:bg-brand/10",
      government: "bg-chart-2/15 text-chart-2 [a&]:hover:bg-chart-2/10",
      ngo: "bg-chart-3/15 text-chart-3 [a&]:hover:bg-chart-3/10",
      nonprofit: "bg-chart-4/15 text-chart-4 [a&]:hover:bg-chart-4/10",
      corporate: "bg-chart-5/15 text-chart-5 [a&]:hover:bg-chart-5/10",
      international: "bg-chart-1/15 text-chart-1 [a&]:hover:bg-chart-1/10",
    };
    return (
      colors[type] ||
      "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"
    );
  };

  return (
    <Section
      className={cn("grid xs:grid-cols-2 lg:grid-cols-3 gap-4", className)}
      {...props}
    >
      {partners.map((partner) => (
        <Card key={partner.id} className="gap-3.5 h-full shadow-none">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-medium line-clamp-2">
              {partner.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  getPartnerTypeColor(partner.partnerType)
                )}
              >
                {getPartnerTypeLabel(partner.partnerType)}
              </Badge>
              {partner.featured && <Badge variant="default">Featured</Badge>}
            </div>
            {partner.logo && (
              <CardAction className="w-12 h-12 rounded-lg overflow-hidden">
                {/* <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-contain"
                /> */}
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  unoptimized={true}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </CardAction>
            )}
          </CardHeader>

          <CardContent className="space-y-2.5">
            {partner.description && (
              <CardDescription className="line-clamp-3">
                {partner.description}
              </CardDescription>
            )}
            {/* Projects Summary */}
            {partner.projects.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground/70">
                <Users className="w-4 h-4" />
                <span>
                  {partner.projects.length} active project
                  {partner.projects.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {/* Show featured projects */}
            {partner.projects.length > 0 && (
              <ul className="space-y-1 pl-[1.125rem] pb-2.5 list-disc">
                {partner.projects.slice(0, 2).map((project) => (
                  <li
                    key={project.id}
                    className="text-xs text-muted-foreground"
                  >
                    {project.title}
                  </li>
                ))}
                {partner.projects.length > 2 && (
                  <li className="text-xs text-muted-foreground/90">
                    +{partner.projects.length - 2} more project
                    {partner.projects.length - 2 !== 1 ? "s" : ""}
                  </li>
                )}
              </ul>
            )}
          </CardContent>
          {/* Website Link */}
          {partner.website && (
            <CardFooter className="mt-auto">
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors group font-medium"
              >
                <span>Visit website</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </CardFooter>
          )}
        </Card>
      ))}
    </Section>
  );
}

export { PartnerCards };

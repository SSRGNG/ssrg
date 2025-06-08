import { LinkIcon } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResearchAreasData } from "@/types";

type RAreaType = ResearchAreasData[number];
type Props = React.ComponentPropsWithoutRef<typeof Section> & {
  area: RAreaType | undefined;
};

function Publications({ area, className, ...props }: Props) {
  if (!area?.publications.length) return null;
  return (
    <Section
      spacing={"snug"}
      header={{ title: "Publications" }}
      className={cn(className)}
      {...props}
    >
      <ul className="space-y-2.5 list-none">
        {area.publications.map((publication, idx) => (
          <li
            key={idx}
            className={cn(
              "text-sm text-muted-foreground border-l-2 pl-[1.125rem]"
            )}
            style={{ textIndent: "-2rem", paddingLeft: "3rem" }}
          >
            {publication.authors} ({publication.year}).{" "}
            {`"${publication.title}."`}{" "}
            <span className="italic">{publication.journal},</span>{" "}
            {publication.volume}, {publication.pages}.
            <Link
              href={publication.link}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "size-6",
                })
              )}
            >
              <LinkIcon className="text-brand" />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { Publications };

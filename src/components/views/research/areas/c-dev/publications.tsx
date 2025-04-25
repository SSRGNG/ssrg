import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { research_areas } from "@/config/constants";
import { cn } from "@/lib/utils";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Publications({ className, ...props }: Props) {
  const area = research_areas.find((a) => a.title == "Community Development");
  if (!area) return null;
  return (
    <Section
      padding={"medium"}
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

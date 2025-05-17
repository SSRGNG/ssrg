import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Researcher } from "@/types";

type Props = React.ComponentPropsWithoutRef<typeof Card> & {
  researcher: Researcher;
  idx: number;
};

function ResearcherCard({ researcher, idx, className, ...props }: Props) {
  return (
    <Card
      className={cn(
        "gap-0 py-0 sm:py-0 overflow-hidden",
        idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
        className
      )}
      {...props}
    >
      <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
        <Image
          src={researcher.image}
          alt={`Image of ${researcher.name}`}
          height={800}
          width={450}
          className="h-full w-full object-cover aspect-[24/9]"
          loading="lazy"
        />
      </CardHeader>

      <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-2/3 leading-none">
        <div className="space-y-0.5">
          <CardTitle>{researcher.name}</CardTitle>
          <CardDescription>{researcher.title}</CardDescription>
        </div>
        <p className="line-clamp-3">{researcher.bio}</p>

        <div className="space-y-1.5">
          <h4>Research Focus:</h4>
          <p className="flex flex-wrap gap-1.5 items-center">
            {researcher.areas.map((area) => (
              <span
                key={area}
                className="bg-brand/20 text-brand text-xs px-2 py-0.5 rounded"
              >
                {area}
              </span>
            ))}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {researcher.contact.twitter && (
              <a
                href={`https://x.com/${researcher.contact.twitter.replace(
                  "@",
                  ""
                )}`}
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: "secondary",
                    className: "size-6 rounded-sm",
                  })
                )}
                aria-label={`${researcher.name}'s Twitter`}
              >
                <Icons.x className="size-3" strokeWidth={1.5} />
              </a>
            )}
            <a
              href={`mailto:${researcher.contact.email}`}
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "secondary",
                  className: "size-6 rounded-sm",
                })
              )}
              aria-label={`Email ${researcher.name}`}
            >
              <Icons.connect className="size-3" strokeWidth={1.5} />
            </a>
          </div>
          <Link
            href={`/team/${researcher.id}`}
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

export { ResearcherCard };

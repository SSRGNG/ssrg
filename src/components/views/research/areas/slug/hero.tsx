import { Icons } from "@/components/shared/icons";
import { HeroSection } from "@/components/shell/section";
import { ResearchAreasData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type RAreaType = ResearchAreasData[number];
type Props = React.ComponentPropsWithoutRef<typeof HeroSection> & {
  area: RAreaType | undefined;
};

function Hero({ area, className, ...props }: Props) {
  if (!area) return null;
  return (
    <HeroSection className={cn(className)} {...props}>
      <h1 className="text-balance">{area.title}</h1>
      <p className="text-balance text-base leading-normal text-muted-foreground">
        {area.detail}
      </p>
      <ul className="grid gap-4 xs:grid-cols-2 md:grid-cols-4 text-left">
        {area.questions.map((q, i) => (
          <li
            className="text-sm italic text-muted-foreground bg-card p-3 sm:p-4 flex items-start rounded-xl border"
            key={i}
          >
            <Icons.question className="text-brand size-4 mr-1.5 mt-1 shrink-0" />
            {q}
          </li>
        ))}
      </ul>
    </HeroSection>
  );
}

export { Hero };

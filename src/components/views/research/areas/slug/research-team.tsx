import { ResearcherCard } from "@/components/shared/researcher-card";
import { Section } from "@/components/shell/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn, getResearchersByArea } from "@/lib/utils";
import { ResearchAreasData } from "@/types";

type RAreaType = ResearchAreasData[number];
type Props = React.ComponentPropsWithoutRef<typeof Section> & {
  area: RAreaType | undefined;
};

function ResearchTeam({ area, className, ...props }: Props) {
  // const plugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true }));
  if (!area) return null;

  const team = getResearchersByArea(area.title);

  return (
    <Section
      spacing={"snug"}
      header={{
        title: "Research Team",
        description: `Meet the researchers focused on ${area.title}:`,
      }}
      className={cn(className)}
      {...props}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        // plugins={[plugin.current]}
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {team.map((researcher, idx) => (
            <CarouselItem key={idx} className="sm:basis-1/2">
              <ResearcherCard
                researcher={researcher}
                idx={idx}
                className="h-full"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </Section>
  );
}

export { ResearchTeam };

import { ResearcherCard } from "@/components/shared/researcher-card";
import { Section } from "@/components/shell/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { research_areas } from "@/config/constants";
import { cn, getResearchersByArea } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function ResearchTeam({ className, ...props }: Props) {
  const area = research_areas.find((a) => a.title == "Community Development");
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

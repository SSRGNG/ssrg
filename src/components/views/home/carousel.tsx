"use client";

import Autoplay from "embla-carousel-autoplay";
import { Award, Calendar, Pause, Play, Users } from "lucide-react";
import React from "react";

import { Section } from "@/components/shell/section";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselDataResults } from "@/lib/actions/queries";
import { cn, formatDate } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section> & {
  media: CarouselDataResults;
};

const T_D = 20000;

function HeroCarousel({ media, className, ...props }: Props) {
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const progressIntervalRef = React.useRef<number | null>(null);
  const autoplayRef = React.useRef(
    Autoplay({ delay: T_D, stopOnInteraction: true })
  );

  // Start progress bar animation
  const startProgressBar = React.useCallback(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Reset progress
    setProgress(0);

    // Don't animate if paused
    if (isPaused) return;

    const startTime = Date.now();
    const duration = T_D;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, 16); // ~60fps update
  }, [isPaused]);

  // Reset progress when slide changes
  const handleSelect = React.useCallback(() => {
    // Reset and restart progress bar
    setProgress(0);
    startProgressBar();
  }, [startProgressBar]);

  // Toggle play/pause
  const togglePlayPause = React.useCallback(() => {
    if (!api) return;

    setIsPaused((prevState) => {
      const newState = !prevState;

      if (newState) {
        // Pausing
        if (autoplayRef.current && autoplayRef.current.stop) {
          autoplayRef.current.stop();
        }

        // Clear progress animation
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        // Playing
        if (autoplayRef.current && autoplayRef.current.play) {
          autoplayRef.current.play();
        }

        // Restart progress animation
        startProgressBar();
      }

      return newState;
    });
  }, [api, startProgressBar]);

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Initialize progress bar when API is ready
  React.useEffect(() => {
    if (!api) return;

    // Setup event listeners
    api.on("select", handleSelect);

    // Start initial progress
    startProgressBar();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, handleSelect, startProgressBar]);

  const getTypeIcon = (type: "award" | "event") => {
    return type === "award" ? (
      <Award className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    );
  };

  const getTypeBadgeVariant = (type: "award" | "event") => {
    return type === "award" ? "secondary" : "default";
  };
  return (
    <Section className={cn(className)} {...props}>
      <Carousel
        className="grid gap-2.5 [&_[data-slot=carousel-content]]:rounded-xl"
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[autoplayRef.current]}
        setApi={setApi}
      >
        <CarouselContent>
          {media.map((item) => (
            <CarouselItem key={item.id} className="xs:basis-2/3">
              <div className="group relative h-[40vh] min-h-[300px] w-full overflow-hidden rounded-lg">
                {/* Background Image with Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/25 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex h-full items-end">
                  <div className="w-full p-6 md:p-8">
                    <div className="max-w-2xl space-y-2">
                      {/* Type Badge */}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getTypeBadgeVariant(item.type)}
                          className="flex items-center gap-1"
                        >
                          {getTypeIcon(item.type)}
                          {item.type === "award" ? "Award" : "Event"}
                        </Badge>
                        {item.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {formatDate(item.date)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h1 className="text-base md:text-lg lg:text-xl font-medium leading-tight">
                        {item.title}
                      </h1>

                      {/* CTA Button */}
                      {item.link && (
                        <div className="pt-4">
                          <a
                            href={item.link}
                            className={cn(buttonVariants({ size: "sm" }))}
                          >
                            Learn More
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex items-center gap-2.5 ">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
          <CarouselNext className="relative right-0 top-0 translate-y-0" />

          {/* Progress Bar */}
          <div className="h-2 w-[20%] ml-auto bg-primary/20 rounded-full overflow-hidden border border-brand">
            <div
              className="h-full bg-brand transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Play/Pause Button */}

          <Button
            variant={"outline"}
            size={"icon"}
            onClick={togglePlayPause}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            className="rounded-full size-8"
          >
            {isPaused ? (
              <Play className="size4" strokeWidth={1.5} />
            ) : (
              <Pause className="size4" strokeWidth={1.5} />
            )}
          </Button>
        </div>
      </Carousel>
    </Section>
  );
}

export { HeroCarousel };

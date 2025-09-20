"use client";

import Autoplay from "embla-carousel-autoplay";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { HeroSection } from "@/components/shell/section";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { research_areas } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const progressIntervalRef = React.useRef<number | null>(null);
  const autoplayRef = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
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
    const duration = 4000; // Match autoplay duration

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

  return (
    <HeroSection className={cn(className)} {...props}>
      <h1 className="text-balance">Research Focus Areas</h1>
      <p className="text-balance text-base leading-normal text-muted-foreground">
        SSRG conducts research across several interconnected domains, each
        addressing critical aspects of social challenges. Explore our research
        areas below to learn more about our work, methodologies, and findings
      </p>
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[autoplayRef.current]}
        setApi={setApi}
        className="grid gap-2.5"
      >
        <CarouselContent>
          {research_areas.map((area, idx) => (
            <CarouselItem key={idx} className="xs:basis-2/3">
              <Card
                className={cn(
                  "group gap-0 py-0 sm:py-0 overflow-hidden text-left md:flex-row h-full",
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <CardHeader className="px-0 sm:px-0 md:w-2/5 grid-rows-[auto]">
                  <Image
                    src={area.image}
                    alt={`Image for ${area.title}`}
                    height={800}
                    width={450}
                    className="h-full w-full object-cover aspect-[24/9] transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </CardHeader>
                <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-3/5">
                  <CardTitle className="flex items-center gap-2.5 truncate">
                    <area.icon className="text-brand" strokeWidth={1.5} />
                    {area.title}
                  </CardTitle>
                  <p className="line-clamp-4">{area.detail}</p>
                  <h4>Key Research Questions:</h4>
                  <ul className="space-y-1 list-none">
                    {area.questions.slice(0, 3).map((q, i) => (
                      <li
                        className="text-xs text-muted-foreground truncate border-l-2 pl-2 border-brand"
                        key={i}
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={area.href}
                    className={buttonVariants({
                      variant: "brand",
                      className: "whitespace-normal h-fit w-full text-xs",
                    })}
                  >
                    {area.linkText}
                  </Link>
                </CardContent>
              </Card>
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
    </HeroSection>
  );
}

export { Hero };

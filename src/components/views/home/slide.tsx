import { HeroSection } from "@/components/shell/section";
import { HeroCarousel } from "@/components/views/home/carousel";
import { Hero } from "@/components/views/home/hero";
import { getCarouselData } from "@/lib/queries/events";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

// const mockCarouselData = [
//   {
//     id: "1",
//     type: "event" as const,
//     title: "Annual Research Symposium 2024",
//     date: "2024-03-15",
//     imageUrl:
//       "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop",
//     link: "/events/1",
//   },
//   {
//     id: "2",
//     type: "award" as const,
//     title: "Excellence in Academic Achievement",
//     date: "2024-02-20",
//     imageUrl:
//       "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
//     link: "/awards/1",
//   },
//   {
//     id: "3",
//     type: "event" as const,
//     title: "International Conference on Innovation",
//     date: "2024-04-10",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
//     link: "/events/3",
//   },
// ];

async function Slide({}: Props) {
  const result = await getCarouselData();
  const media = result.success ? result.data : undefined;

  // console.log({ media });
  if (!media || media.length === 0) {
    return <Hero />;
  }

  return <HeroCarousel media={media} />;
  // return <HeroCarousel media={mockCarouselData} />;
}

export { Slide };

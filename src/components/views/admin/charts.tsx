import { Publication } from "@/components/views/admin/publication";
import { Videos } from "@/components/views/admin/videos";
import {
  getPublicationTypeDistribution,
  getVideoCategoryDistribution,
} from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"section">;

async function Charts({ className, ...props }: Props) {
  const [pubTypes, videoCategories] = await Promise.all([
    getPublicationTypeDistribution(),
    getVideoCategoryDistribution(),
  ]);

  return (
    <section className={cn("grid md:grid-cols-2 gap-4", className)} {...props}>
      <Publication pubs={pubTypes} />
      <Videos videos={videoCategories} />
    </section>
  );
}

export { Charts };

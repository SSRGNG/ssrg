import { TabsContent } from "@/components/ui/tabs";
import { RAreasDataTable } from "@/components/views/admin/ui-tables";
import { getCachedAdminResearchAreas } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent>;

async function ResearchAreas({ className, ...props }: Props) {
  const areas = await getCachedAdminResearchAreas();
  console.log({ areas });
  return (
    <TabsContent className={cn(className)} {...props}>
      <RAreasDataTable areas={areas} />
    </TabsContent>
  );
}

export { ResearchAreas };

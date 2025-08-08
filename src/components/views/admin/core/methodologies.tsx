import { TabsContent } from "@/components/ui/tabs";
import { RMethodologiesDataTable } from "@/components/views/admin/ui-tables";
import { getCachedResearchMethodologies } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent>;

async function ResearchMethodologies({ className, ...props }: Props) {
  const methodologies = await getCachedResearchMethodologies();
  return (
    <TabsContent className={cn(className)} {...props}>
      <RMethodologiesDataTable methodologies={methodologies} />
    </TabsContent>
  );
}

export { ResearchMethodologies };
